const express = require("express");
const { Router } = express;
const Contenedor = require("./managers/contenedorProductos");
const ContenedorCarrito = require("./managers/contenedorCarrito");

const app = express();
const carritoRouter = Router();
const prodRouter = Router();
const PORT = 8080;
const productosService = new Contenedor("./src/productos.txt");
const carritoService = new ContenedorCarrito("./src/carrito.txt");

let isAdmin = true;

app.listen(PORT, () => console.log(`[Express]: Server ejecutandose en el puerto: ${PORT}`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", prodRouter);
app.use("/api/carrito", carritoRouter);

if (isAdmin) {
    console.log("[APP]: Te has conectado como administrador.");
}

// [RUTAS /api/productos]
prodRouter.get("/", async (req, res) => {
    const productos = await productosService.getAll();
    res.send(productos);
})

prodRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    const producto = await productosService.getById(Number(id));
    res.send(producto);
})

prodRouter.post("/", async (req, res) => {
    if (isAdmin) {
        const newProduct = req.body;
        await productosService.save(newProduct);

        res.send({ success: "El producto ha sido agregado correctamente!" });
    } else {
        res.send({ error: "No tienes los permisos suficientes para agregar un producto" });
    }
})

prodRouter.put("/:id", async (req, res) => {
    if (isAdmin) {
        const { id } = req.params;
        const newProduct = req.body;

        await productosService.updateById(Number(id), newProduct);

        res.send({ success: "El producto ha sido modificado correctamente!" });

    } else {
        res.send({ error: "No tienes los permisos suficientes para modificar un producto" });
    }
})

prodRouter.delete("/:id", async (req, res) => {
    if (isAdmin) {
        const { id } = req.params;

        await productosService.deleteById(Number(id));

        res.send({ success: `El producto ${id} ha sido eliminado correctamente.` });

    } else {
        res.send({ error: "No tienes los permisos suficientes para eliminar un producto" });
    }
})

// [RUTAS /api/carrito]
carritoRouter.get("/", async (req, res) => {
    const carritos = await carritoService.getAll();
    res.send(carritos);
})

carritoRouter.post("/", async (req, res) => {
    const carrito = [{
        "id": 1,
        "timestamp": 1669214110662,
        "title": "Escuadra",
        "price": 123.45,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"
    },
    {
        "id": 2,
        "timestamp": 1669214124522,
        "title": "Calculadora",
        "price": 234.56,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"
    },
    {
        "id": 3,
        "timestamp": 1669214125942,
        "title": "Globo Terráqueo",
        "price": 345.67,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"
    }];

    const id = await carritoService.save(carrito);
    res.send({ success: `Se ha creado el carrito ID: ${id}` });
});

carritoRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    await carritoService.deleteById(Number(id));
    rres.send({ success: `Se ha eliminado el carrito ID: ${id}` });
})

carritoRouter.get("/:id/productos", async (req, res) => {
    const { id } = req.params;

    const carrito = await carritoService.getById(Number(id));
    res.send(carrito.productos);
})

carritoRouter.post("/:id/productos", async (req, res) => {
    const newProducto = {
        "id": 4,
        "timestamp": 1669214125942,
        "title": "Globo Terráqueo Nuevo",
        "price": 345.67,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"
    };

    const { id } = req.params;
    const carrito = await carritoService.getById(Number(id));
    carrito.productos.push(newProducto);

    await carritoService.updateById(Number(id), carrito);

    res.send(carrito);
})

carritoRouter.delete("/:id/productos/:id_prod", async (req, res) => {
    const { id, id_prod } = req.params;

    const carrito = await carritoService.getById(Number(id));
    const newProducts = carrito.productos.filter(item => item.id !== Number(id_prod));
    const updatedCarrito = { ...carrito, productos: newProducts };

    await carritoService.updateById(Number(id), updatedCarrito);

    res.send({ success: `Se ha eliminado el producto ${id_prod} del carrito ID: ${id}` });
})
