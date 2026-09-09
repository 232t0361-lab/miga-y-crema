$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$browser = Start-Process -FilePath 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' -ArgumentList @('--headless','--disable-gpu','--no-first-run','--remote-debugging-port=9238',"--user-data-dir=$env:TEMP\miga-cdp-review-2",'about:blank') -WindowStyle Hidden -PassThru
$socket = $null
try {
    $target = $null
    for ($attempt = 0; $attempt -lt 50; $attempt++) {
        try {
            $tabs = Invoke-RestMethod 'http://127.0.0.1:9238/json/list'
            $target = $tabs | Where-Object type -eq 'page' | Select-Object -First 1
            if ($target) { break }
        } catch { }
        Start-Sleep -Milliseconds 200
    }
    if (!$target) { throw 'Browser connection failed' }
    $socket = New-Object Net.WebSockets.ClientWebSocket
    $socket.ConnectAsync([uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    $script:messageId = 0
    function Send-CDP($method, $parameters) {
        $script:messageId++
        $id = $script:messageId
        $json = @{ id = $id; method = $method; params = $parameters } | ConvertTo-Json -Depth 30 -Compress
        $bytes = [Text.Encoding]::UTF8.GetBytes($json)
        $tokenSource = New-Object Threading.CancellationTokenSource(15000)
        try {
            $segment = New-Object 'ArraySegment[byte]' -ArgumentList @(,$bytes)
            $socket.SendAsync($segment, [Net.WebSockets.WebSocketMessageType]::Text, $true, $tokenSource.Token).GetAwaiter().GetResult()
            do {
                $message = New-Object IO.MemoryStream
                do {
                    $buffer = New-Object byte[] 65536
                    $segment = New-Object 'ArraySegment[byte]' -ArgumentList @(,$buffer)
                    $received = $socket.ReceiveAsync($segment, $tokenSource.Token).GetAwaiter().GetResult()
                    $message.Write($buffer, 0, $received.Count)
                } while (!$received.EndOfMessage)
                $response = [Text.Encoding]::UTF8.GetString($message.ToArray()) | ConvertFrom-Json
                $message.Dispose()
            } while ($response.id -ne $id)
            if ($response.error) { throw ($response.error | ConvertTo-Json -Compress) }
            return $response.result
        } finally { $tokenSource.Dispose() }
    }
    $null = Send-CDP 'Emulation.setDeviceMetricsOverride' @{ width = 390; height = 844; deviceScaleFactor = 1; mobile = $true }
    $testURL = ([uri](Join-Path $projectRoot 'tests/regression.html')).AbsoluteUri
    $null = Send-CDP 'Page.navigate' @{ url = $testURL }
    $expression = @'
new Promise(resolve => { let n=0; const t=setInterval(()=>{const report=document.getElementById('verification-results');if(report || n++>100){clearInterval(t);resolve(report?report.textContent:'FAIL test timeout');}},50); })
'@
    $result = Send-CDP 'Runtime.evaluate' @{ expression = $expression; awaitPromise = $true; returnByValue = $true }
    $result.result.value
    if ($result.result.value -match 'FAIL') { throw 'Mobile regression failed' }
    $expression = @'
document.getElementById('verification-results').remove();document.querySelector('[data-category="todos"]').click();document.getElementById('quantity-0').value=2;document.querySelector('[data-add="0"]').click();document.getElementById('toast').hidden=true;document.getElementById('menu').scrollIntoView();JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,cartTop:document.getElementById('floating-cart').getBoundingClientRect().top})
'@
    $result = Send-CDP 'Runtime.evaluate' @{ expression = $expression; returnByValue = $true }
    $result.result.value
    Start-Sleep -Milliseconds 500
    $shot = Send-CDP 'Page.captureScreenshot' @{ format = 'png' }
    [IO.File]::WriteAllBytes((Join-Path $projectRoot 'docs/previews/menu-mobile-restored.png'), [Convert]::FromBase64String($shot.data))
    $null = Send-CDP 'Emulation.setDeviceMetricsOverride' @{ width = 1440; height = 1000; deviceScaleFactor = 1; mobile = $false }
    $null = Send-CDP 'Runtime.evaluate' @{ expression = "document.getElementById('btn-logout').click()" }
    Start-Sleep -Milliseconds 250
    $shot = Send-CDP 'Page.captureScreenshot' @{ format = 'png' }
    [IO.File]::WriteAllBytes((Join-Path $projectRoot 'docs/previews/login-restored.png'), [Convert]::FromBase64String($shot.data))
} finally {
    if ($socket) { $socket.Dispose() }
    Stop-Process -Id $browser.Id -ErrorAction SilentlyContinue
}
