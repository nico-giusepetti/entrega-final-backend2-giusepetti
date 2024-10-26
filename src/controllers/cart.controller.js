import cartService from "../services/cart.service.js";
import productService from "../services/product.service.js";

import { generateRandomCode, calcularTotal } from "../utils/cartUtil.js";
import TicketModel from "../dao/models/ticket.model.js";
import userService from "../services/user.service.js";

class CartController {
    
    // Crear carrito
    async crearCarrito(req, res) {
        try {
            const nuevoCarrito = await cartService.crearCarrito();
            res.json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Ocurrió un error al crear el carrito. c");
        }
    }

    // Obtener carrito por ID
    async getCarritoById(req, res) {
        const cartId = req.params.cid;
        try {
            const carrito = await cartService.getCarritoById(cartId);
            if (carrito) {
                res.json(carrito.products);
            } else {
                res.status(404).send("Carrito no encontrado.");
            }
        } catch (error) {
            res.status(500).send("Ocurrió un error al obtener el carrito.");
        }
    }

    // Agregar producto al carrito
    async addProductToCart(req, res) {
        const carritoId = req.params.cid;
        const productoId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const actualizado = await cartService.addProductToCart(carritoId, productoId, quantity);
            res.json(actualizado.products);
        } catch (error) {
            res.status(500).send("Ocurrió un error al agregar el producto.");
        }
    }

    // Vaciar carrito
    async vaciarCarrito(req, res) {
        const carritoId = req.params.cid;
        try {
            const carritoVaciado = await cartService.vaciarCarrito(carritoId);
            if (carritoVaciado) {
                res.json({ message: "Carrito vaciado." });
            } else {
                res.status(404).send("Carrito no encontrado.");
            }
        } catch (error) {
            res.status(500).send("Ocurrió un error al vaciar el carrito.");
        }
    }

    // Eliminar producto del carrito
    async removeProductFromCart(req, res) {
        const carritoId = req.params.cid;
        const productoId = req.params.pid;
        try {
            const carritoActualizado = await cartService.removeProductFromCart(carritoId, productoId);
            if (carritoActualizado) {
                res.json(carritoActualizado.products);
            } else {
                res.status(404).send("Carrito o producto no encontrado.");
            }
        } catch (error) {
            res.status(500).send("Ocurrió un error al eliminar el producto.");
        }
    }

    // Actualizar cantidad de producto en el carrito
    async updateProductQuantity(req, res) {
        const carritoId = req.params.cid;
        const productoId = req.params.pid;
        const nuevaCantidad = req.body.quantity;
        try {
            if (typeof nuevaCantidad !== 'number' || nuevaCantidad <= 0) {
                return res.status(400).send("Cantidad inválida.");
            }

            const carritoActualizado = await cartService.updateProductQuantity(carritoId, productoId, nuevaCantidad);
            if (carritoActualizado) {
                res.json(carritoActualizado.products);
            } else {
                res.status(404).send("Carrito o producto no encontrado.");
            }
        } catch (error) {
            res.status(500).send("Ocurrió un error al actualizar la cantidad del producto.");
        }
    }


    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
    
        try {
            const cart = await cartService.getCarritoById(cartId);
            const productos = cart.products;
    
            const productosNoDisponibles = [];
            let total = 0;
    
            // Itera sobre los productos en el carrito
            for (const item of productos) {
                const productId = item.product;
    
                // Recupera el producto completo desde la base de datos para obtener el precio
                const product = await productService.getProductById(productId);
    
                // Verifica el stock
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity; // Resta la cantidad comprada al stock
                    await product.save(); // Guarda los cambios en el stock
                    total += product.price * item.quantity; // Calcula el total usando el precio actual
                } else {
                    productosNoDisponibles.push(productId); // Agrega productos sin stock suficiente
                }
            }
    
            // Obtén el usuario con el carrito
            const userWithCart = await userService.getUserByCartId(cartId);
    
            // Genera y guarda el ticket con el total calculado
            const ticket = new TicketModel({
                code: generateRandomCode(),
                purchase_datetime: new Date(),
                amount: total,
                purchaser: userWithCart.email
            });
    
            await ticket.save();

             // Filtra los productos no disponibles para que se queden en el carrito
            cart.products = cart.products.filter(item =>
                productosNoDisponibles.some(prodId => prodId.equals(item.product))
            );

            await cart.save();

            console.log("Productos en carrito:", cart.products);
            console.log("Productos no disponibles:", productosNoDisponibles);

        
            // Renderiza la vista del checkout
            res.render("checkout", {
                cliente: userWithCart.first_name,
                email: userWithCart.email,
                numTicket: ticket._id
            });
    
        } catch (error) {
            console.error("Error al procesar la compra:", error);
            res.status(500).send("Ocurrió un error al procesar la compra");
        }
    }
    
}

export default new CartController();
