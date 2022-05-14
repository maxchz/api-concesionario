import Express from 'express';
import {queryAllUsers, crearUsuario, editarUsuario, eliminarUsuario,consultarUsuario, consultarOCrearUsuario} from '../../controllers/usuarios/controller.js';



const rutasUsuarios= Express.Router();

const genericCallback=(res)=>{
    return (err,result)=>{
        if(err){
            res.status(500).send("Error consultando los Usuarios");
        }else{
            res.json(result);
        };
    }

   };



rutasUsuarios.route("/usuarios").get((req, res)=>{
    console.log("alguien hizo get en la ruta /Usuarios");
    queryAllUsers(genericCallback(res));
});    
   
rutasUsuarios.route ("/usuarios/nuevo").post((req, res)=>{

    crearUsuario(req.body, genericCallback(res));
});

rutasUsuarios.route('/usuarios/:id').patch((req,res)=>{
  editarUsuario(req.params.id, req.body,genericCallback(res));
});

rutasUsuarios.route('/usuarios/:id').delete( (req,res)=>{
    eliminarUsuario(req.params.id, genericCallback(res));
   
});

//Ruta para self, consultasi el usuario logeado esta registrado en el back
rutasUsuarios.route("/usuarios/self").get((req, res)=>{
    console.log("alguien hizo get en la ruta /self");
    consultarOCrearUsuario(req, genericCallback(res));
    // consultarUsuario(req.params.id, genericCallback(res));
 
});


rutasUsuarios.route("/usuarios/:id").get((req, res)=>{
    console.log("alguien hizo get en la ruta /Usuarios");
    consultarUsuario(req.params.id, genericCallback(res));
 
});

export default rutasUsuarios;