const { Router } = require("express");
const router = Router();
const Contenedor = require("../controllers/productsController.js");
const carritos = new Contenedor("./controllers/carritos.json");
const productos = new Contenedor("./controllers/productos.json");
const notFound = { error: "Producto no encontrado" };

const numeros = "0123456789";
const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numYLetras = numeros + letras;

router.post("/", async (req, res) => {
    console.log(`post req recibida con exito`);
    const carrito = {
        timestamp: Date.now(),
        productos: [],
    };
    const nuevoCarrito = await carritos.save(carrito);
    !nuevoCarrito && res.status(500).json(notFound);
    res.status(201).send("Carrito creado con exito");
});

router.post("/:id/productos", async (req, res) => {
    console.log(`post req recibida con exito`);
    const idCarrito = parseInt(req.params.id);
    const idProducto = req.body;
    const carrito = await carritos.getById(idCarrito);
    const producto = await productos.getById(idProducto);
    carrito.productos.push(producto);
    await carritos.modify(idCarrito, carrito);
    res.status(201).send("Carrito modificado con exito");
});

router.delete("/:id", async (req, res) => {
    console.log(`deleteById req recibida con exito`);
    const idCarrito = parseInt(req.params.id);
    const carrito = await carritos.getById(idCarrito);
    const eliminarCarrito = await carritos.deleteById(idCarrito);
    !carrito && res.status(404).json(notFound);
    res.status(200).json(carrito);
});

router.delete("/:id/productos/:id_prod", async (req, res) => {
    console.log(`deleteById req recibida con exito`);
    const idCarrito = parseInt(req.params.id);
    const idProducto = parseInt(req.params.id_prod);
    const carrito = await carritos.getById(idCarrito);
    let indexToDelete = -1;
    carrito.productos.forEach((producto, index) => {
        if (producto.id == idProducto) {
            indexToDelete = index;
        }
    });
    if (indexToDelete >= 0) {
        carrito.productos.splice(indexToDelete, 1);
    }
    await carritos.modify(idCarrito, carrito);
    res.status(200).json(carrito);
});

router.get("/:id/productos", async (req, res) => {
    console.log(`getById req recibida con exito`);
    const idCarrito = parseInt(req.params.id);
    const carrito = await carritos.getById(idCarrito);
    !carrito && res.status(404).json(notFound);
    res.status(200).json(carrito[0].productos);
});

router.put("/:id", async (req, res) => {
    console.log(`put req recibida con exito`);
    const idProducto = parseInt(req.params.id);
    const data = req.body;
    const productoEditado = await productos.modify(idProducto, data);
    !productoEditado && res.status(404).json(notFound);
    res.status(200).json(productoEditado);
});

module.exports = router;