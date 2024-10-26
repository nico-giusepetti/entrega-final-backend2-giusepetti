import cartRepository from "../repositories/cart.repository.js";

class CartService {
    // Crear carrito
    async crearCarrito() {
        try {
            const nuevoCarrito = { products: [] };
            return await cartRepository.createCart(nuevoCarrito);
        } catch (error) {
            console.log("Ocurrió un error al crear el carrito. s");
            throw error;
        }
    }

    // Obtener carrito por ID
    async getCarritoById(carritoId) {
        try {
            const carritoBuscado = await cartRepository.getCartById(carritoId);
            if (!carritoBuscado) {
                console.log("No existe el carrito buscado.");
                return null;
            }
            return carritoBuscado;
        } catch (error) {
            console.log("Ocurrió un error al obtener el carrito por id.");
            throw error;
        }
    }

    // Agregar producto al carrito
    async addProductToCart(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            if (!carrito) {
                console.log("Carrito no encontrado.");
                return null;
            }

            const existeProducto = carrito.products.find(item => item.product.toString() === productoId);
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productoId, quantity });
            }

            return await cartRepository.updateCart(carritoId, { products: carrito.products });
        } catch (error) {
            console.log("Ocurrió un error al agregar el producto al carrito.");
            throw error;
        }
    }

    // Vaciar carrito
    async vaciarCarrito(carritoId) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            if (!carrito) {
                console.log("Carrito no encontrado.");
                return null;
            }

            carrito.products = [];
            return await cartRepository.updateCart(carritoId, { products: carrito.products });
        } catch (error) {
            console.log("Ocurrió un error al vaciar el carrito.");
            throw error;
        }
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(carritoId, productoId) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            if (!carrito) {
                console.log("Carrito no encontrado.");
                return null;
            }

            const index = carrito.products.findIndex(item => item.product.toString() === productoId);
            if (index !== -1) {
                carrito.products.splice(index, 1);
                return await cartRepository.updateCart(carritoId, { products: carrito.products });
            } else {
                console.log("Producto no encontrado en el carrito.");
                return null;
            }
        } catch (error) {
            console.log("Ocurrió un error al eliminar el producto del carrito.");
            throw error;
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(carritoId, productoId, nuevaCantidad) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            if (!carrito) {
                console.log("Carrito no encontrado.");
                return null;
            }

            const existeProducto = carrito.products.find(item => item.product.toString() === productoId);
            if (existeProducto) {
                existeProducto.quantity = nuevaCantidad;
                return await cartRepository.updateCart(carritoId, { products: carrito.products });
            } else {
                console.log("Producto no encontrado en el carrito.");
                return null;
            }
        } catch (error) {
            console.log("Ocurrió un error al actualizar la cantidad del producto en el carrito.");
            throw error;
        }
    }
}

export default new CartService();
