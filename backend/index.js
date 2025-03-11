const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de SQLite
const db = new sqlite3.Database('./poemas.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Crear la tabla de poemas (si no existe)
db.run(`
  CREATE TABLE IF NOT EXISTS poemas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    categoria TEXT NOT NULL,
    imagen_url TEXT NOT NULL,
    likes INTEGER DEFAULT 0
  )
`);

// Ruta para obtener poemas
app.get('/poemas', (req, res) => {
  db.all('SELECT * FROM poemas', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener los poemas');
    } else {
      res.json(rows);
    }
  });
});

// Ruta para actualizar los likes de un poema
app.put('/poemas/:id/like', (req, res) => {
  const poemaId = req.params.id;

  // Incrementa los likes en 1
  db.run(
    'UPDATE poemas SET likes = likes + 1 WHERE id = ?',
    [poemaId],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los likes');
      } else {
        res.send('Like actualizado correctamente');
      }
    }
  );
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});