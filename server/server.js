// server.js
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "personas",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: ", err);
    return;
  }
  console.log("Conexión exitosa a la base de datos MySQL");
});

// Ruta para manejar la solicitud GET a la ruta raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido al servidor del proyecto CRUD con Node.js y MySQL!");
});
// Definir las rutas para el CRUD

// Ruta para obtener todos los usuarios
app.get("/api/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, result) => {
    if (err) {
      console.error("Error al obtener usuarios: ", err);
      res.status(500).send("Error al obtener usuarios");
      return;
    }
    res.json(result);
  });
});

// Ruta para obtener un usuario por su ID
app.get("/api/usuarios/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM usuarios WHERE id = ?", userId, (err, result) => {
    if (err) {
      console.error("Error al obtener el usuario: ", err);
      res.status(500).send("Error al obtener el usuario");
      return;
    }
    res.json(result[0]);
  });
});

// Ruta para agregar un nuevo usuario
app.post("/api/usuarios", (req, res) => {
  const { nombre, email, edad } = req.body;
  db.query(
    "INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)",
    [nombre, email, edad],
    (err, result) => {
      if (err) {
        console.error("Error al agregar un usuario: ", err);
        res.status(500).send("Error al agregar un usuario");
        return;
      }
      res.json({ message: "Usuario agregado correctamente", id: result.insertId });
    }
  );
});

// Ruta para actualizar un usuario existente
app.put("/api/usuarios/:id", (req, res) => {
  const userId = req.params.id;
  const { nombre, email, edad } = req.body;
  db.query(
    "UPDATE usuarios SET nombre = ?, email = ?, edad = ? WHERE id = ?",
    [nombre, email, edad, userId],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar el usuario: ", err);
        res.status(500).send("Error al actualizar el usuario");
        return;
      }
      res.json({ message: "Usuario actualizado correctamente" });
    }
  );
});

// Ruta para eliminar un usuario
app.delete("/api/usuarios/:id", (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM usuarios WHERE id = ?", userId, (err, result) => {
    if (err) {
      console.error("Error al eliminar el usuario: ", err);
      res.status(500).send("Error al eliminar el usuario");
      return;
    }
    res.json({ message: "Usuario eliminado correctamente" });
  });
});

app.listen(port, () => {
  console.log(`Servidor Node.js en funcionamiento en http://localhost:${port}`);
});