import { MercadoPagoConfig, Preference } from 'mercadopago';

// 1. Configura tus credenciales de prueba
const client = new MercadoPagoConfig({ 
  accessToken: 'TU_ACCESS_TOKEN_DE_PRUEBA' 
});

// 2. Crea la ruta para tu botón de compra
app.post("/create_preference", async (req, res) => {
  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: 'Pedido de Miga y Crema',
            quantity: 1,
            unit_price: 150.00 // Precio de prueba
          }
        ],
        // A dónde regresa al usuario tras pagar
        back_urls: {
          success: "https://tusitio.com/exito",
          failure: "https://tusitio.com/error",
          pending: "https://tusitio.com/pendiente"
        },
        auto_return: "approved",
      }
    });

    // Devolvemos el ID al frontend
    res.json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear la preferencia");
  }
});