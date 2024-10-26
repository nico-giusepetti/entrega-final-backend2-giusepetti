import userService from "../services/user.service.js";
import jwt from "jsonwebtoken"; 
import UserDTO from "../dto/user.dto.js";

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, age, usuario, password } = req.body; 

        try {
            const newUser = await userService.registerUser({
                first_name, last_name, email, age, usuario, password
            }); 

            const token = jwt.sign({usuario: newUser.usuario, email: newUser.email, rol: newUser.rol}, "coderhouse", {expiresIn: "1h"}); 

            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});

            res.redirect("/api/sessions/current"); 

        } catch (error) {
            res.status(500).send({error: error}); 
        }
    }

    async login(req, res) {
        const {usuario, password } = req.body; 

        try {
            const user = await userService.loginUser(usuario, password); 

            const token = jwt.sign({usuario: user.usuario, email: user.email, rol: user.rol}, "coderhouse", {expiresIn: "1h"}); 

            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});

            res.redirect("/api/sessions/current");

        } catch (error) {
            res.status(500).send({error: error}); 
        }
    }

    async current(req, res) {
        if(req.user) {
            console.log(req.user)
            const user = req.user; 
            const userDTO = new UserDTO(user); 
            res.render("profile", {user: userDTO}); 
        }else {
            res.send("NO autorizado."); 
        }
    }

    async logout(req, res) {
        res.clearCookie("coderCookieToken"); 
        res.redirect("/login");
    }

    async admin(req,res) {
        if(req.user.rol !=="admin"){
            return res.status(403).send("ACCESO DENEGADO, necesitas un rol superior.")
        }
        
        //Si es admin, renderizamos la vista 
        res.render("admin", {usuario: req.user.usuario})
    }
}


export default UserController; 