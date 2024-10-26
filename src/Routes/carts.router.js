// routes/carts.router.js
import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const router = Router();

//RUTAS

// Crear carrito
router.post("/", CartController.crearCarrito);

// Obtener carrito por ID
router.get("/:cid", CartController.getCarritoById);

// Agregar producto al carrito
router.post("/:cid/product/:pid", CartController.addProductToCart);

// Vaciar carrito
router.delete("/:cid", CartController.vaciarCarrito);

// Eliminar producto del carrito
router.delete("/:cid/product/:pid", CartController.removeProductFromCart);

// Actualizar cantidad de producto en el carrito
router.put("/:cid/product/:pid", CartController.updateProductQuantity);

router.post("/:cid/purchase", CartController.finalizarCompra)

export default router;
