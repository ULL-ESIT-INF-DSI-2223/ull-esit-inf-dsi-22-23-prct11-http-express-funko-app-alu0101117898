import express from "express";
import http from "http";

/**
 *  Se crea una instancia de Express y definimos el puerto que usará.
 */
const app = express();
const port = 3000;

/** 
 * Definimos la ruta '/weather' que recibirá una petición GET con el parámetro 'location'
 * que contendrá la ubicación de la que queremos obtener el clima.
 */

app.get('/weather', (req, res) => {
  const { location } = req.query;
  const api_key = 'c2e5e5bac366fda7739450f75f6c3b09';

  /**
   *  Hacemos una petición a la API de Weatherstack con la 
   * clave de API y la ubicación recibida como parámetro.
   */
  http.get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${location}`, (response) => {
    let data = '';

    /**
     * Concatenamos los fragmentos de datos que recibimos en la respuesta.
     */
    response.on('data', (chunk) => {
      data += chunk;
    });

    /**
     * Cuando termina de recibir los datos, parseamos 
     * la respuesta y la enviamos como respuesta de la petición GET.
     */
    response.on('end', () => {
      const result = JSON.parse(data);

      /**
       * Si la respuesta indica que no tuvo éxito, 
       * devolvemos un error 500 con el mensaje de error.
       */
      if (result.success === false) {
        res.status(500).json({ error: result.error.info });

        /**
         * Si la respuesta tuvo éxito, se devuelve 
         * la respuesta en formato JSON.
         */
      } else {
        res.json(result);
      }
    });

    /**
     * Si ocurrió un error en la petición, devolvemos 
     * un error 500 con el mensaje de error.
     */
  }).on('error', (error) => {
    res.status(500).json({ error: error.message });
  });
});

/**
 * Si se recibe una petición a una ruta 
 * diferente a '/weather', devolvemos un error 404
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/**
 * Se inicia el servidor en el puerto definido `port`.
 */
app.listen(port, () => {
  console.log(`Se está ejecutando el servidor en el puerto ${port}:`);
});
