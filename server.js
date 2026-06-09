const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// 1. Importamos el SDK oficial de Mercado Pago para Node.js
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(cors());
app.use(express.json());

// 2. CONFIGURA AQUÍ TU ACCESS TOKEN DE PRUEBA (Empieza con APP_USR-... o TEST-...)
const client = new MercadoPagoConfig({
    accessToken: "APP_USR-659949415529982-053023-6be7dfc1451d1574051112b8316ea668-3438543436"
});

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==========================================================================
   NUEVA RUTA: Recibe el carrito y crea la orden en Mercado Pago
   ========================================================================== */
app.post("/create_preference", async (req, res) => {
    try {
        const { items } = req.body;

        // Imprime en la consola de tu terminal lo que está llegando de la web para que lo veas
        console.log("Datos recibidos en el carrito:", items);

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        // Mapeo inteligente: detecta automáticamente cómo se llaman tus variables
        const itemsMercadoPago = items.map(producto => {
            // 1. Detectar el nombre/título del producto
            const titulo = producto.nombre || producto.title || producto.name || "Producto de Miga y Crema";
            
            // 2. Detectar el precio y limpiarlo (elimina el '$' o espacios si los tiene)
            let precioCrudo = producto.precio || producto.price || 0;
            if (typeof precioCrudo === "string") {
                precioCrudo = precioCrudo.replace(/[^0-9.]/g, ""); // Deja solo números y puntos
            }
            const precio = Number(precioCrudo);

            // 3. Detectar la cantidad
            const cantidad = Number(producto.cantidad || producto.quantity || producto.cant || 1);

            return {
                title: titulo,
                unit_price: precio,
                quantity: cantidad,
                currency_id: "MXN" // Cambia a ARS, COP, etc., si no estás en México
            };
        });

        console.log("Datos procesados listos para Mercado Pago:", itemsMercadoPago);

        const preference = new Preference(client);
        
        const result = await preference.create({
            body: {
                items: itemsMercadoPago,
                back_urls: {
                    success: "http://localhost:3000",
                    failure: "http://localhost:3000",
                    pending: "http://localhost:3000"
                },
                auto_return: "approved",
            }
        });

        res.json({ id: result.id });

    } catch (error) {
        console.error("Error detallado en Mercado Pago:", error);
        res.status(500).json({ error: "No se pudo crear la preferencia de pago" });
    }
});