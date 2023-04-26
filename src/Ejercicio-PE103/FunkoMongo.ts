import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'funko-app';

interface FunkoAppInterface {
  nombre: string;
  descripcion: string;
  tipo: 'Pop!'| 'Vanilla'| 'Rock Candy'| 'ReAction'| 'Pocket Pop!'| 'Pop! Keychain';
  genero: 'Anime' | 'Cine' | 'Cómics' | 'Música' | 'Videojuegos' | 'Otros';
  precio: number;
  franquicia: string;
  idFranquicia: number;
  exclusivo: boolean;
}

app.use(bodyParser.json());

app.get('/add', async (req, res) => {
  const funko = req.body;
  MongoClient.connect(dbURL).then((client) => {
    const db = client.db(dbName);
    const user  = req.query.user as string;

    return db.collection<FunkoAppInterface>(user).insertOne(funko);

  }).then ((result) =>{
    console.log(result);
  }).catch((error) => {
    console.log(error);
    res.status(500).send({ message: 'Error al insertar el FunkoPop' });
  });
});

app.delete('/remove', async (req, res) => {
  MongoClient.connect(dbURL).then((client) => {
    const db = client.db(dbName);
    const user  = req.query.user as string;
    return db.collection<FunkoAppInterface>(user).deleteOne({
      nombre: req.body.nombre
    });
  }).then ((result) =>{
    console.log(result);
  }).catch((error) => {
    console.log(error);
    res.status(500).send({ message: 'Error al eliminar el FunkoPop' });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
