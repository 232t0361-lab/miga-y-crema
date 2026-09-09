// Catálogo: cada producto indica su categoría y la sección donde aparece.
const postres = [
       {
        nombre: "Beso de Angel",
        categoria: "postres",
        tipo: "postres",
        precio: 50,
        descripcion: "Una rebanada celestial, suave y cremosa que te hará suspirar con cada bocado.",
        imagen: "assets/images/angel.jpg"
       },
        {
        nombre: "Brownie sencillo",
        categoria: "postres",
        tipo: "postres",
        precio: 20,
        descripcion: "Chocolatoso, denso y con la textura ideal por dentro y por fuera.",
        imagen: "assets/images/sencillo.png"
       },
      {
        nombre: "Brownie con Nutella",
        categoria: "postres",
        tipo: "postres",
        precio: 25,
        descripcion: "Nuestro brownie clásico cubierto con una generosa capa de Nutella.",
        imagen: "assets/images/brownies.jpg"
       },
      {
        nombre: "Brownie con Nutella y Topping",
        categoria: "postres",
        tipo: "postres",
        precio: 30,
        descripcion: "El brownie definitivo: Nutella y tu topping favorito para darle texturas.",
        imagen: "assets/images/brownies.jpg"
       },
      {
        nombre: "Concha Tematica",
        categoria: "postres",
        tipo: "postres",
        precio: 25,
        descripcion: "Pan tradicional esponjoso con diseños creativos y personalizados de tus personajes o festividades favoritas.",
        imagen: "assets/images/mini conchas.png"
       },
       {
        nombre: "Chocoflan",
        categoria: "postres",
        tipo: "postres",
        precio: 45,
        descripcion: "La mezcla perfecta de flan y pastel de chocolate.",
        imagen: "assets/images/chocoflan.jpg"
       },
       {
        nombre: "Cheesecake de Zarzamora",
        categoria: "postres",
        tipo: "postres",
        precio: 220,
        descripcion: "Base crujiente de galleta con una cubierta de mermelada.",
        imagen: "assets/images/cheescake_zarzamora.jpg",
       },
       {
        nombre: "Cheesecake Tortuga",
        categoria: "postres",
        tipo: "postres",
        precio: 50,
        descripcion: "Base crujiente de galleta con una cubierta de mermelada.",
        imagen: "assets/images/cheescake_tortuga.jpg",
       },
        {
        nombre: "Cheesecake de Oreo",
        categoria: "postres",
        tipo: "postres",
        precio: 50,
        descripcion: "Base crujiente de galleta de oreo.",
        imagen: "assets/images/cheescake_oreo.jpg"
       },
       {
        nombre: "Empanada Rellena",
        categoria: "postres",
        tipo: "postres",
        precio: 12,
        descripcion: "Crujiente y deliciosa empanade rellena de chocolate.",
        imagen: "assets/images/empanadas.jpg"
       },
        {
        nombre: "Mini Hotcakes Charola chica",
        categoria: "postres",
        tipo: "postres",
        precio: 35, 
        descripcion: "Pequeños y esponjosos, perfectos para compartir.",
        imagen: "assets/images/hotcakes.jpg"
       },
       {
        nombre: "Mini Hotcakes Charola Grande",
        categoria: "postres",
        tipo: "postres",
        precio: 60, 
        descripcion: "Pequeños y esponjosos, perfectos para compartir.",
        imagen: "assets/images/hotcakes.jpg"
       },
       {
        nombre: "Mini Donitas",
        categoria: "postres",
        tipo: "postres",
        precio: 35,
        descripcion: "Mini donitas super ricas y calientitas.",
        imagen: "assets/images/donitas.jpg"
       },
       {
        nombre: "Mini Waffles",
        categoria: "postres",
        tipo: "postres",
        precio: 35,
        descripcion: "Mini waffles super ricos, crujientes y calientitos.",
        imagen: "assets/images/mini waffles.png"
       },
       {
        nombre: "Mojadito con Nuez",
        categoria: "postres",
        tipo: "postres",
        precio: 35,
        descripcion: "Pastelito de 3 leches cubierto de merengue y nuez.",
        imagen: "assets/images/mojadito_1.jpg"
       },
        {
        nombre: "Mojadito con Chispas de Chocolate",
        categoria: "postres",
        tipo: "postres",
        precio: 35,
        descripcion: "Pastelito de 3 leches cubierto de merengue y chispas de chocolate.",
        imagen: "assets/images/mojadito_2.jpg"
       },
        {
        nombre: "Mojadito de Galleta Oreo",
        categoria: "postres",
        tipo: "postres",
        precio: 35,
        descripcion: "Pastelito de 3 leches cubierto de merengue y galleta oreo.",
        imagen: "assets/images/mojadito_3.jpg"
       },
       {
        nombre: "Panque de Elote",
        categoria: "postres",
        tipo: "postres",
        precio: 35,
        descripcion: "Panque esponjoso y delicioso hecho de elote.",
        imagen: "assets/images/panque_elote.jpg"
       },
      {
        nombre: "Panque de nuez",
        categoria: "postres",
        tipo: "postres",
        precio: 150,
        descripcion: "Panque esponjoso y delicioso hecho de elote.",
        imagen: "assets/images/panque de nuez.jpg"
       },
       {
        nombre: "Pay de Queso",
        categoria: "postres",
        tipo: "postres",
        precio: 200,
        descripcion: "Esponjoso y Delicioso.",
        imagen: "assets/images/cheescake.jpg"
       },
        {
        nombre: "Pastel Matilda",
        categoria: "postres",
        tipo: "postres",
        precio: 300,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/pastel_matilda.jpg"
       },
       {
        nombre: "Pastel de Zanahoria",
        categoria: "postres",
        tipo: "postres",
        precio: 300,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/pastel de zanahoria.jpg"
       },
        {
        nombre: "Trenza de Nutella y Philadelfia",
        categoria: "postres",
        tipo: "postres",
        precio: 40,
        descripcion: "Panecito largo como una trenza, relleno de nutella y queso philadelfia.",
        imagen: "assets/images/trenza.jpg"
       },
        {
        nombre: "Trenza de Zarzamora",
        categoria: "postres",
        tipo: "postres",
        precio: 40,
        descripcion: "Panecito largo como una trenza, relleno de Zarzamora y queso philadelfia.",
        imagen: "assets/images/trenza.jpg"
       },
       {
        nombre: "Desayuno de Cumpleaños",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 300,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/cumpleaños 1.jpg"
       },
        {
        nombre: "Desayuno de Cumpleaños",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 350,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/desayuno.jpg"
       },
        {
        nombre: "Desayuno de Cumpleaños",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 300,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/cumpleaños 2.jpg"
       },
        {
        nombre: "Desayuno de Cumpleaños",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 350,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/cumpleaños.jpg"
       },
      {
        nombre: "Desayuno de Cumpleaños",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 550,
        descripcion: "Nosotros hacemos realidad ese diseño.",
        imagen: "assets/images/pastel de cumpleaños.jpg"
       },
      {
        nombre: "Desayuno de Cumpleaños",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 500,
        descripcion: "Algo dulce para un dia especial.",
        imagen: "assets/images/pastel de cumpleaños 1.jpg"
       },
       {
        nombre: "Desayuno de Cumpleaños",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 320,
        descripcion: "Romántico desayuno con detalles dulces.",
        imagen: "assets/images/cumpleaños 3.jpg"
       },
       {
        nombre: "Desayuno de Cumpleaños",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 320,
        descripcion: "Romántico desayuno con detalles dulces.",
        imagen: "assets/images/cumpleaños 4.jpg"
       },
        {
        nombre: "Desayuno para Papá",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 300,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/desayuno_2.jpg"
       },
        {
        nombre: "Desayuno para Papá",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 300,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/desayuno_3.jpg"
       },
        {
        nombre: "Desayuno para Papá",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 320,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/desayuno_5.jpg"
       },
       {
        nombre: "Desayuno para Mamá",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 320,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/desayuno1.jpg"
       },
       {
        nombre: "Desayuno para Mamá",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 350,
        descripcion: "El mejor dia para endulzarle la vida a mamá.",
        imagen: "assets/images/mama.jpg"
       },
        {
        nombre: "Desayuno para Papá",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 240,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/desayuno_4.jpg"
       },
       {
        nombre: "Desayuno para Pareja",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 320,
        descripcion: "Romántico desayuno con detalles dulces.",
        imagen: "assets/images/desayuno_6.jpg"
       },
       {
        nombre: "Desayuno para Pareja",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 320,
        descripcion: "Romántico desayuno con detalles dulces.",
        imagen: "assets/images/desayuno_7.jpg"
       },
        {
        nombre: "Desayuno para Pareja",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 240,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/desayuno_0.jpg"
       },
        {
        nombre: "Desayuno para Pareja",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 240,
        descripcion: "Un detalle muy dulce.",
        imagen: "assets/images/desayuno 10.jpg"
       },
       {
        nombre: "Desayuno para el Dia del Maestro",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 350,
        descripcion: "Un dulce desayuno para el/la mejor Maestr@.",
        imagen: "assets/images/maestro.jpg"
       },
        {
        nombre: "Eventos",
        categoria: "desayunos",
        tipo: "desayunos",
        precio: 240,
        descripcion: "disponibles para cualquier evento.",
        imagen: "assets/images/eventos.jpg"
       },
       {
        nombre: "Soda Italiana de Fresa",
        categoria: "bebidas",
        tipo: "frias",
        precio: 45,
        descripcion: "Rica soda burbujeante sabor fresa.",
        imagen: "assets/images/bebida 1.jpg"
       },
       {
        nombre: "Soda Italiana de Manzana",
        categoria: "bebidas",
        tipo: "frias",
        precio: 45,
        descripcion: "Rica soda burbujenate sabor manzana",
        imagen: "assets/images/bebida 10.jpg"
       },
        {
        nombre: "Café Americano",
        categoria: "bebidas",
        tipo: "calientes",
        precio: 40,
        descripcion: "El clásico e indispensable café negro, balanceado y aromático.",
        imagen: "assets/images/cafee.jpg"
       },
       {
        nombre: "Café Espresso",
        categoria: "bebidas",
        tipo: "calientes",
        precio: 25,
        descripcion: "Corto, intenso y con mucha energía en cada sorbo.",
        imagen: "assets/images/cafe.jpg"
       },
       {
        toggle: true,
        nombre: "Café Lechero",
        categoria: "bebidas",
        tipo: "calientes",
        precio: 45,
        descripcion: "Tradicional y reconfortante combinación de café con leche cremosa.",
        imagen: "assets/images/cafe.jpg"
       },
       {
        nombre: "Capuchino",
        categoria: "bebidas",
        tipo: "frias",
        precio: 65,
        descripcion: "Equilibrio perfecto entre espresso, leche vaporizada y espuma densa.",
        imagen: "assets/images/capuchino.jpg"
       },
       {
        nombre: "Café Capuchino",
        categoria: "bebidas",
        tipo: "calientes",
        precio: 65,
        descripcion: "Todo el sabor y la espuma de un capuchino, pero en una versión refrescante y helada.",
        imagen: "assets/images/capuchino caliente.jpg"
       },
       {
        nombre: "Café Capuchino con Sabor",
        categoria: "bebidas",
        tipo: "calientes",
        precio: 55,
        descripcion: "Nuestro capuchino clásico con un toque dulce de tu jarabe favorito",
        imagen: "assets/images/capuchino caliente.jpg"
       },
       {
        nombre: "Café Latte",
        categoria: "bebidas",
        tipo: "calientes",
        precio: 25,
        descripcion: "Suave, ligero y con mayor porción de leche vaporizada.",
        imagen: "assets/images/late.jpg"
       },
       {
        nombre: "Café Late con Sabor",
        categoria: "bebidas",
        tipo: "calientes",
        precio: 55,
        descripcion: "La delicadeza del latte mezclada con un delicioso toque de sabor.",
        imagen: "assets/images/late con sabor.jpg"
       },
       {
        nombre: "Latte Frio",
        categoria: "bebidas",
        tipo: "frias",
        precio: 50,
        descripcion: "Tu café con leche de siempre, pero servido bien helado para refrescar el día.",
        imagen: "assets/images/late.jpg"
       },
       {
        nombre: "Latte Frio de Taro",
        categoria: "bebidas",
        tipo: "frias",
        precio: 65,
        descripcion: "Una combinación suave, balanceada y con el toque dulce del taro.",
        imagen: "assets/images/late de taro.jpg"
       },
       {
        nombre: "Frappe de Carlos V",
        categoria: "bebidas",
        tipo: "frias",
        precio: 65,
        descripcion: "Un clásico mexicano transformado en una bebida fría intensamente chocolatosa.",
        imagen: "assets/images/bebida carlos.jpg"
       },
       {
        nombre: "Frappe de Crema Irlandesa",
        categoria: "bebidas",
        tipo: "frias",
        precio: 65,
        descripcion: "Elegante y cremosa, con las notas dulces y aromáticas.",
        imagen: "assets/images/bebida mazapan.jpg"
       },
        {
        nombre: "Frappe de Ferrero Rocher",
        categoria: "bebidas",
        tipo: "frias",
        precio: 65,
        descripcion: "El sabor del lujo hecho bebida: chocolate premium y avellana en perfecta sintonía.",
        imagen: "assets/images/bebida 9.jpg"
       },
       {
        nombre: "Frappe de Gansito",
        categoria: "bebidas",
        tipo: "frias",
        precio: 70,
        descripcion: "Disfruta un delicioso frappe de gansito.",
        imagen: "assets/images/bebida 6.jpg"
       },
       {
        nombre: "Frappe de Mazapan",
        categoria: "bebidas",
        tipo: "frias",
        precio: 65,
        descripcion: "Un homenaje a la nostalgia; súper cremoso y con el auténtico sabor al dulce de cacahuate.",
        imagen: "assets/images/mazapan.jpg"
       },
       {
        nombre: "Frappe de Moka",
        categoria: "bebidas",
        tipo: "frias",
        precio: 65,
        descripcion: "La combinación celestial de espresso, leche fría y un toque irresistible de chocolate.",
        imagen: "assets/images/bebida moka.jpg"
       },
       {
        nombre: "Frappe de Oreo",
        categoria: "bebidas",
        tipo: "frias",
        precio: 65,
        descripcion: "Una explosión cremosa cargada de trocitos de la galleta favorita de todos.",
        imagen: "assets/images/bebida 7.jpg"
       },
       {
        nombre: "Frappe de Taro",
        categoria: "bebidas",
        tipo: "frias",
        precio: 65,
        descripcion: "Una bebida cremosa, de un lindo tono morado y con ese sabor dulce y exótico tan característico.",
        imagen: "assets/images/bebida 8.jpg"
       }
    ];