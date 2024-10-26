import userDao from "../dao/user.dao.js";

class UserRepository {
    async createUser(userData) {
        return await userDao.save(userData);
    }

    async getUserById(id) {
        return await userDao.findById(id);
    }

    async getUserByEmail(email) {
        return await userDao.findOne({email}); 
    }

    async getUserByUser(usuario) {
        return await userDao.findOne({usuario}); 
    }

    async getUserByCartId(cart) {
        return await userDao.findOne({ cart });
    }

     // Método para actualizar usuario
    async updateUser(id, userData) {
        return await userDao.update(id, userData);
    }

    // Método para eliminar usuario
    async deleteUser(id) {
        return await userDao.delete(id);
    }
}

export default new UserRepository(); 