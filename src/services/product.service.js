import productRepository from "../repositories/product.repository.js";

class ProductService {
    async addProduct({ title, description, price, code, stock, category, thumbnails }) {
        try {
            // Validación de campos obligatorios
            if (!title || !description || !price || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }

            // Verificación si el producto ya existe
            const existingProduct = await productRepository.getProductByQuery({ code });
            if (existingProduct) {
                throw new Error("El código del producto debe ser único.");
            }

            // Crear nuevo producto
            const newProduct = {
                title,
                description,
                price,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || [] // Si no se envían thumbnails (no obligatorio), se usa un array vacío
            };

            return await productRepository.createProduct(newProduct);
        } catch (error) {
            console.log("Ocurrió un error al agregar el producto", error);
            throw error;
        }
    }

    async getAllProducts() {
        try {
            // Obtenemos todos los productos del repositorio sin paginación ni límites
            const products = await productRepository.getAllProducts(); // Aquí puedes agregar filtros si lo necesitas
    
            // Retornamos todos los productos
            return {
                docs: products, // Retornamos los productos directamente
                totalProducts: products.length, // Contamos la cantidad total de productos
            };
        } catch (error) {
            console.log("Ocurrió un error al obtener todos los productos", error);
            throw error;
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                sortOptions.price = sort === 'asc' ? 1 : -1;
            }

            const products = await productRepository.getProductByQuery(queryOptions);
            console.log("Tipo de products:", typeof products);  // Debe ser 'object', pero deberías verificar si es un array
            console.log("¿Es un array?", Array.isArray(products));  // Debe ser true si products es un array
            console.log("Contenido de products:", products);

            const totalProducts = products.length;

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products.slice(skip, skip + limit),
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Ocurrió un error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await productRepository.getProductById(id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            console.log("Ocurrió un error al buscar producto por ID", error);
            throw error;
        }
    }

    async updateProduct(id, updatedProductData) {
        try {
            const updatedProduct = await productRepository.updateProduct(id, updatedProductData);
            if (!updatedProduct) {
                throw new Error("No se encuentra el producto para actualizar");
            }
            return updatedProduct;
        } catch (error) {
            console.log("Ocurrió un error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productRepository.deleteProduct(id);
            if (!deletedProduct) {
                throw new Error("No se encuentra el producto para eliminar");
            }
            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.log("Ocurrió un error al eliminar el producto", error);
            throw error;
        }
    }
}

export default new ProductService();
