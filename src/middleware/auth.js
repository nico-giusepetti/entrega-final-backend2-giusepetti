//Middleware para el admin: 

export function accessAdmin(req, res, next) {
    if(req.user.rol === "admin") {
        next(); 
    }else{
        res.status(403).send("Acceso NO PERMITIDO. Solo para ADMIN"); 
    }
}

//Middleware para el user: 

export function accessUser(req, res, next) {
    if(req.user.rol === "user") {
        next(); 
    }else {
        res.status(403).send("Acceso NO PERMITIDO. Solo USUARIOS"); 
    }
}