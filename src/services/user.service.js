import userRepository from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/util.js";
import cartRepository from "../repositories/cart.repository.js";


class UserServices {
    // async registerUser(userData) {
    //     const existingUser = await userRepository.getUserByEmail(userData.email);
    //     if(existingUser) throw new Error("El usuario ya existe"); 

    //     //Aca yo podria crear un carrito y asociar el id al usuario. 

    //     userData.password = createHash(userData.password); 
    //     return await userRepository.createUser(userData); 
    // }

    async registerUser(userData) {
        const existingUser = await userRepository.getUserByEmail(userData.email);
        if(existingUser) throw new Error("El usuario ya existe");

        // Crear un carrito vacío para el usuario y obtener el ID del carrito
        const newCart = await cartRepository.createCart(); // Método para crear un carrito vacío
        userData.cart = newCart._id; // Asociar el ID del carrito al usuario

        // Encriptar la contraseña
        userData.password = createHash(userData.password); 

        return await userRepository.createUser(userData); // Guardar el usuario con el ID del carrito asociado
    }


    async loginUser(usuario, password) {
        const user = await userRepository.getUserByUser(usuario); 
        console.log(user)
        if(!user || !isValidPassword(password, user)) throw new Error("Credenciales incorrectas"); 
        return user; 
    }

    async getUserById(id) {
        return await userRepository.getUserById(id); 
    }

    async getUserByCartId(cart) {
        return await userRepository.getUserByCartId(cart);
    }

     // Método para actualizar usuario
    async updateUser(id, userData) {
        const user = await userRepository.getUserById(id);
        if(!user) throw new Error("Usuario no encontrado");

        // Si se actualiza la contraseña, encripta la nueva contraseña
        if(userData.password) {
            userData.password = createHash(userData.password);
        }

        return await userRepository.updateUser(id, userData);
    }

    // Método para eliminar usuario
    async deleteUser(id) {
        const user = await userRepository.getUserById(id);
        if(!user) throw new Error("Usuario no encontrado");

        return await userRepository.deleteUser(id);
    }
}

export default new UserServices();