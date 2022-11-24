const fs = require("fs");

class ContenedorCarrito {
    constructor (filename) {
        this.filename = filename;
    }

    save = async (carrito) => {
        try {
            if(fs.existsSync(this.filename)) {
                const carritos = await this.getAll();
                const lastID = carritos.reduce((acc, item) => item.id > acc ? acc = item.id : acc, 0);
                const newCarrito = {
                    id: lastID + 1,
                    timestamp: Date.now(),
                    productos: carrito
                }

                carritos.push(newCarrito);
                await fs.promises.writeFile(this.filename, JSON.stringify(carritos, null, 2));

                return lastID;
            }
            else {
                const newCarrito = {
                    id: 1,
                    timestamp: Date.now(),
                    productos: carrito
                }

                await fs.promises.writeFile(this.filename, JSON.stringify([newCarrito], null, 2));

                return 1;
            }
        } catch (error) {
            console.log(error);
        }
    }

    getById = async (id) => {
        try {
            if(fs.existsSync(this.filename)) {
                const carritos = await this.getAll();
                const carrito = carritos.find(item => item.id === id);
                return carrito;
            }
        } catch (error) {
            console.log(error);
        }
    }

    getAll = async () => {
        try {
            const contenido = await fs.promises.readFile(this.filename, "utf8");
            const carritos = JSON.parse(contenido);
            return carritos;
        } catch (error) {
            console.log(error);
        }
    }

    deleteById = async (id) => {
        try {
            const carritos = await this.getAll();
            const newCarritos = carritos.filter(item => item.id !== id);
            await fs.promises.writeFile(this.filename, JSON.stringify(newCarritos, null, 2));
        } catch (error) {
            console.log(error);
        }
    }

    deleteAll = async () => {
        try {
            await fs.promises.writeFile(this.filename, JSON.stringify([]));
        } catch (error) {
            console.log(error);
        }
    }

    updateById = async (id, body) => {
        try {
            const carritos = await this.getAll();
            const carritoPos = carritos.findIndex(elemento => elemento.id === id);
            carritos[carritoPos] = {
                id:id,
                productos: [],
                ...body
            };
            
            await fs.promises.writeFile(this.filename, JSON.stringify(carritos, null, 2));
            return carritos;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ContenedorCarrito;