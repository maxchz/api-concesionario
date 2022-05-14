import {getDB} from '../../db/db.js';
import {ObjectId} from 'mongodb';
import jwt_decode from 'jwt-decode';

const queryAllUsers= async (callback)=>{

 const baseDeDatos= getDB();
 await  baseDeDatos
 .collection('Usuario')
 .find({})
 .limit(50)
 .toArray(callback);
  };

//controlador para crear nuevo Usuario
const crearUsuario=async (datosUsuarios, callback)=>{
    const baseDeDatos= getDB();
    await baseDeDatos.collection('Usuario').insertOne(datosUsuarios,callback);
 };

//agergamos un filtro de ejemplo, dado que esta separado la conexion a la bd, las tareas de las rutas y el pocesamiento del backend
//resulta mas facil aplicar un filtro cualquiera que sea
//una vez definido el filtro debo crear la correspondiente ruta, en el archivo ruta.js
const consultarUsuario=async(id,callback)=>{
    const baseDeDatos= getDB();
 await  baseDeDatos
 .collection('Usuario')
 .findOne({_id:new ObjectId(id)}, callback);
 
}        

//controlador para consultar usuario logeado en la BD o crearlo si no esta en la BD
const consultarOCrearUsuario= async (req, callback)=>{
  console.log("Estoy llegando a crear usuario");
    //6.1.obtener los datos del usuario desde el tojen 
    const token =req.headers.authorization.split('Bearer')[1];
    //con esta linea desencrito el token
    // console.log("token",jwt_decode(token));
    const  user=jwt_decode(token)['https://secret-shelf-03392.herokuapp.com/userData'];
    console.log(user);

    //6.2. cnon el correo del usuario o con el id de auth0, veiricar si el usuario ua esta en la bd  o no
    const baseDeDatos= getDB();
    await baseDeDatos.collection('Usuario').findOne({email: user.email}, 
      async (err, response)=>{
      console.log("response consulta bd",response);
      if(response){
    //7.1. si el usuario ya esta en la bd, devuelve la info del usuario
        callback(err, response);
      }else{
    //eliminamos el _id que proporciona Auth0 para quedarnos conel ObjectID de BD
    user.auth0ID = user._id;
    delete user._id;
    //cuando se crea un usuario no le asignamos un rol y le dejamos en estado pendiente
    user.rol='sin rol';
    user.estado= 'pendiente';

    //7.2.si el usuario no esta en la bd, lo crea y devuelve la info
    await crearUsuario(user, (err, respuesta)=> callback(err,user));
    };
  });
};


//controlador para editar  Usuarios

const editarUsuario=async (id, edicion, callback)=>{
    const filtroUsuario= {_id:new ObjectId(id)};
    //Si envie los id por el body debo borralos por que sino se incorporan aa la BD y el elemento editado queda con dos id 
    //si mando los id por las rutas eso no es necesario
 
 
    //operaciones una operacion atomica, una instruccion que le envio al backend, que le indico que voy a editar
    const operacion={
        $set: edicion,};
 
    const baseDeDatos= getDB();
     
    await baseDeDatos
     .collection('Usuario')
     .findOneAndUpdate(filtroUsuario,operacion,{upsert:true,returnOriginal:true},callback);
     };
       
const eliminarUsuario=async (id, callback)=>{
    const filtroUsuario= {_id:new ObjectId(id)};
    const baseDeDatos= getDB();

    await baseDeDatos.collection('Usuario').deleteOne(filtroUsuario,callback);
    
};

export {queryAllUsers, crearUsuario, editarUsuario, eliminarUsuario, consultarUsuario, consultarOCrearUsuario};