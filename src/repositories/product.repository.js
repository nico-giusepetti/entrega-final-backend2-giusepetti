import productDao from "../dao/product.dao.js";

class ProductRepository {
    async createProduct(productData) {
        return await productDao.save(productData);
    }

    async getProductById(id) {
        return await productDao.findById(id);
    }

    async getProductByQuery(query) {
        return await productDao.findOne(query);
    }

    async getAllProducts(){
        return await productDao.getAll()
    }

    async updateProduct(id, productData) {
        return await productDao.update(id, productData);
    }

    async deleteProduct(id) {
        return await productDao.delete(id);
    }
}

export default new ProductRepository();
