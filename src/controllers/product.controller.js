import productService from "../services/product.service.js";

class ProductController {
    // Obtener todos los productos (con paginacion)
    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;

            const productos = await productService.getProducts({
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                query,
            });

            res.json({
                status: 'success',
                payload: productos,
                totalPages: productos.totalPages,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage,
                page: productos.page,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevLink: productos.prevLink,
                nextLink: productos.nextLink,
            });
        } catch (error) {
            console.error("Ocurrió un error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error en el servidor",
            });
        }
    }

    // Obtener producto por id
    async getProductById(req, res) {
        const id = req.params.pid;

        try {
            const producto = await productService.getProductById(id);
            if (!producto) {
                return res.status(404).json({
                    error: "Producto no encontrado",
                });
            }

            res.json(producto);
        } catch (error) {
            console.error("Error al obtener producto", error);
            res.status(500).json({
                error: "Error interno del servidor",
            });
        }
    }

    // Obtener todos los productos
    async getAllProducts(req, res) {
        try {
            // Llamamos al servicio para obtener todos los productos
            const products = await productService.getAllProducts();

            // Enviamos la respuesta con los productos obtenidos
            res.status(200).json(products);
        } catch (error) {
            console.error("Ocurrió un error al obtener todos los productos en el controlador:", error);
            res.status(500).json({ error: "Ocurrió un error al obtener los productos" });
        }
    }


    // Crear nuevo producto
    async addProduct(req, res) {
        const nuevoProducto = req.body;

        try {
            await productService.addProduct(nuevoProducto);
            res.status(201).json({
                message: "Producto agregado exitosamente",
            });
        } catch (error) {
            console.error("Error al agregar producto", error);
            res.status(500).json({
                error: "Error interno del servidor",
            });
        }
    }

    // Actualizar producto por id
    async updateProduct(req, res) {
        const id = req.params.pid;
        const nuevosDatos = req.body;

        try {
            await productService.updateProduct(id, nuevosDatos);
            res.json({
                message: "Producto actualizado exitosamente",
            });
        } catch (error) {
            console.error("Error al actualizar producto", error);
            res.status(500).json({
                error: "Error interno del servidor",
            });
        }
    }

    // Eliminar producto por id
    async deleteProduct(req, res) {
        const id = req.params.pid;

        try {
            await productService.deleteProduct(id);
            res.json({
                message: "Producto eliminado exitosamente",
            });
        } catch (error) {
            console.error("Error al eliminar producto", error);
            res.status(500).json({
                error: "Error interno del servidor",
            });
        }
    }
}

export default new ProductController();
