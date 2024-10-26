import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router();

// RUTAS

// Método GET para obtener todos los productos
router.get("/", productController.getAllProducts);

// Método GET para obtener un producto por id
router.get("/:pid", productController.getProductById);

// Método POST para agregar un nuevo producto
router.post("/", productController.addProduct);

// Método PUT para actualizar un producto por id
router.put("/:pid", productController.updateProduct);

// Método DELETE para eliminar un producto por id
router.delete("/:pid", productController.deleteProduct);

export default router;
