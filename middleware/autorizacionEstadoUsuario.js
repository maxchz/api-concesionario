import {getDB} from '../db/db.js';
import jwt_decode from 'jwt-decode';



const autorizacionEstadoUsuario = async (req, res, next)=>{
    //1- obtener el ussuario desde el token
    const token =req.headers.authorization.split('Bearer')[1];
    const  user=jwt_decode(token)['http://localhost/userData'];
    console.log(user);

    //2- consultar el usuario en la bd
    const baseDeDatos= getDB();
    await baseDeDatos.collection('Usuario').findOne({email: user.email}, async (err, response)=>{
     if(response){   
      console.log("response consulta bd",response);
    //3- veridicar el estado del usuario

      if(response.estado==='rechazado'){
    //4- si el usuario es rechazado, devolver un error de autenticacion
        res.sendStatus(401);
        res.end();
        // callback(err, response);
      } else{
          console.log('habilitado');
     //5- si el usuario esta pendiente o habilitado, ejecutar next ()
        next();

      }
    }else{
      next();
    }
    });

    // console.log("hola mundo soy un middleware");

};

export default autorizacionEstadoUsuario;