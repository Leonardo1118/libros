//Importando paquetes
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
//Importando y configurando dotenv
require('dotenv').config();
//Ejecutar express y guardar una instancia en app
const app = express();
//Agregando middlewares a travez del metodo use() de express
app.use(cors());
app.use(express.json());
const mongoUri = process.env.MONGO_URI;
try {
  mongoose.connect(mongoUri);
  console.log('Conectado a MongoDB');
} catch (error) {
  console.error('Error de conexión', error);
}

//creando el esquema de la base de datos

const libroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
});

const Libro = mongoose.model('Libro', libroSchema);

//middleware de autenticación
app.use((req, res, next) => {
  const authToken = req.headers['authorization'];
  if (authToken === 'miTokenSecreto123') {
    next();
  } else {
    res.status(401).send('Acceso no autorizado');
  }
});
app.post('/libros', async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
  });

  try {
    await libro.save();
    res.status(201).json(libro);
  } catch (error) {
    res.status(400).json({ error: 'Error al guardar el libro' });
  }
});

//Obtener un libro por su id
app.get('/libros/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const libro = await Libro.findById(id);
    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send('Libro no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al buscar el libro');
  }
});
app.listen(3000, () => {
  console.log(`Servidor corriendo en el puerto 3000`);
});

//Obtener todos los libros
app.get('/libros', async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).send('Error al obtener los libros');
  }
});

//eliminar un libro por su id
app.delete('/libros/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const libro = await Libro.findByIdAndDelete(id);
    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send('Libro no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error eliminando el libro');
  }
});
app.listen(3000, () => {
  console.log(`Servidor corriendo en el puerto 3000`);
});

//Actualizar un libro por su id
app.put('/libros/:id', async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        titulo: req.body.titulo,
        autor: req.body.autor,
      },
      { new: true } // Esta opción hará que se devuelva el documento actualizado
    );

    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send('Libro no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al actualizar el libro');
  }
});
