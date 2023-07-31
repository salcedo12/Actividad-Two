import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null); // Estado para almacenar el usuario que estamos editando
  const [errorMensaje, setErrorMensaje] = useState(null); // Nuevo estado para el mensaje de error

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios: ", error);
    }
  };

  const handleAgregarUsuario = async () => {
    try {
      if (nombre && email && edad) {
        if (!usuarioEditando) {
          // Si no estamos editando un usuario, realizamos la validación de correo duplicado
          const correoExistente = usuarios.find((usuario) => usuario.email === email);
          if (correoExistente) {
            setErrorMensaje("El correo electrónico ya está registrado. Por favor, use otro correo.");
            return;
          }
        }
  
        if (usuarioEditando && usuarioEditando.email !== email) {
          // Si estamos editando un usuario y el nuevo correo no es el mismo que el actual
          // realizamos la validación de correo duplicado
          const correoExistente = usuarios.find((usuario) => usuario.email === email);
          if (correoExistente) {
            setErrorMensaje("El correo electrónico ya está registrado. Por favor, use otro correo.");
            return;
          }
        }
  
        if (usuarioEditando) {
          const usuarioActualizado = {
            nombre: nombre,
            email: email,
            edad: edad,
          };
          await axios.put(
            `http://localhost:5000/api/usuarios/${usuarioEditando.id}`,
            usuarioActualizado
          );
          setUsuarioEditando(null);
        } else {
          const nuevoUsuario = {
            nombre: nombre,
            email: email,
            edad: edad,
          };
          await axios.post("http://localhost:5000/api/usuarios", nuevoUsuario);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMensaje("El correo electrónico ingresado no es válido.");
        return;
      }
        }
        setShowModal(false); // Cerrar el modal
    setUsuarioEditando(null); // Establecer el usuarioEditando en null
    setNombre(""); // Limpiar los campos del formulario
    setEmail("");
    setEdad("");
        setErrorMensaje(null); // Limpiamos el mensaje de error
        fetchUsuarios();
      } else {
        setErrorMensaje("Todos los campos son obligatorios");
      }
    } catch (error) {
      console.error("Error al guardar el usuario: ", error);
    }
  };
  const handleEditarUsuario = (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setEdad(usuario.edad);
    setUsuarioEditando(usuario);
    setShowModal(true);
  };

  const handleEliminarUsuario = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${id}`);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar un usuario: ", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <>
    <div className="container mt-5">
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Agregar Usuario
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.edad}</td>
              <td>
                <Button variant="info" onClick={() => handleEditarUsuario(usuario.id)}>
                  Editar
                </Button>{" "}
                <Button variant="danger" onClick={() => handleEliminarUsuario(usuario.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{usuarioEditando ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMensaje && <Alert variant="danger">{errorMensaje}</Alert>}
          <Form>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="edad">
              <Form.Label>Edad</Form.Label>
              <Form.Control type="number" value={edad} onChange={(e) => setEdad(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAgregarUsuario}>
            {usuarioEditando ? "Guardar Cambios" : "Agregar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default App;