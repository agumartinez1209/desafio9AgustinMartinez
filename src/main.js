import express from "express";
import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";
import ContenedorSQL from "./contenedores/ContenedorSQL.js";
import config from "./config.js";
import * as productoRandom from "./api/prodRandom.js";
import ContenedorMongoDB from "./contenedores/ContenedorMongoDB.js";
import * as configMensajes from "./config/configMensajes.js";
import * as messageNormalizr from "./utils/normalizr.js";

//--------------------------------------------
// instancio servidor, socket y api

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

const productosApi = new ContenedorSQL(config.mariaDb, "productos");
const mensajesApi = new ContenedorMongoDB(configMensajes.mensajesConfigCollection, configMensajes.mensajesSchema);

//--------------------------------------------
// configuro el socket

const processMsgData = (msgData) => {
  const plainMsgs = msgData.map((msg) => {
    const dateTime = new Date(parseInt(msg.id.substring(0, 8), 16) * 1000);
    delete msg.author["_id"];
    delete msg["__v"];
    msg = { ...msg, dateTime };
    return msg;
  });
  const originalData = { id: "mensajes", mensajes: plainMsgs };
  return messageNormalizr.getNormalized(originalData)
};
import util from "util"
io.on("connection", async (socket) => {
  
  const productos = await productosApi.getAll();
  io.sockets.emit("productos", productos);
  const msgData = await mensajesApi.getAll();
  const mensajes = processMsgData(msgData)
  io.sockets.emit("mensajes", mensajes);

  console.log("Nueva conexion");
  
  socket.on("newProduct", async (data) => {
    await productosApi.guardar(data);
    const productos = await productosApi.getAll();
    io.sockets.emit("productos", productos);
  });

  
  socket.on("newMessage", async (data) => {
    await mensajesApi.createNew(data);
    const msgData = await mensajesApi.getAll();
    const mensajes = processMsgData(msgData)
    io.sockets.emit("mensajes", mensajes);
  });
});

//--------------------------------------------
// agrego middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// agrego una ruta get

app.get("/api/productos-test", (req, res) => {
  const randomProduct = productoRandom.generateMany(5);
  res.send(randomProduct);
});

//--------------------------------------------
// inicio el servidor

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`);
});
connectedServer.on("error", (error) => console.log(`Error en servidor ${error}`));