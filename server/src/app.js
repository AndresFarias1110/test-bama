/**
 * Declaramos los paquetes a utilizar
 */
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
let users = [];

/**
 * ----- API REST ------
 * En esta parte hacemos que cuando visiten http://localhost:3000/ retore una pagina con "Hello World"
 */

app.get("/", function (req, res) {
  res.send("Hello World!");
});

/**
 * Fin API REST
 */

/**
 * -----------------------------------------------------
 * Socket.io conexion
 * ----------------------------------------------------
 */

io.on("connection", function (socket) {
    // console.log(socket);
  const id_handshake = socket.id;

  let { payload } = socket.handshake.query;

  console.log(`Nuevo dispositivo conectado:${id_handshake}`);
  users.push(id_handshake);
  io.emit("connectedUser", users);

  if (!payload) {
    console.log(`Sin payload`);
  } else {
    socket.on("default", function (res) {
      console.log("event:", res.event);
      switch (res.event) {
        case "IPConfigCommand":
          io.emit("notification", {
            msg: "ipConfig",
          });

          break;
        case "Finished":
          console.log("Se ha terminado de ejecutar el comando.");

          break;
        case "Error":
          console.log("Ocurrió un error al momento de ejecutar el comando.");

          break;
      }
    });
  }

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

server.listen(5000, function () {
  console.log("\n");
  console.log(`>> Socket listo y escuchando por el puerto: 5000'`);
});

app.listen(3000, function () {
  console.log(`>> Express listo y escuchando por el puerto: 3000`);
  console.log("\n");
});
