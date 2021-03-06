import {getDB} from '../../db/db.js';
import {ObjectId} from 'mongodb';

const queryAllVehicles= async (callback)=>{

 const baseDeDatos= getDB();
 await  baseDeDatos
 .collection('vehiculo')
 .find({})
 .limit(50)
 .toArray(callback);
  };

//controlador para crear nuevo vehiculo
const crearVehiculo=async (datosVehiculos, callback)=>{
    
        if (
            // Estas lineas son una validacion de los datos recibidos desde el front/insomnia
            Object.keys(datosVehiculos).includes('name')&&
            Object.keys(datosVehiculos).includes('brand')&&
            Object.keys(datosVehiculos).includes('model')
            ){
            //aqui implemento codigo para crear vehiculo en la base de datos
            //Aqui uso funciones de mongo para crear o buscar informacion en la BD
            // La siguiente linea de codigo es una baseDeDatos a la coleecion(una BD) vehiculo e inserta los datos de
            // datosVehiculos, y dependiendo si hubo un error o no, me muestra un mnesaje por consola
            const baseDeDatos= getDB();

            await baseDeDatos.collection('vehiculo').insertOne(datosVehiculos,callback);
            
            }else{
                res.sendStatus(500);
            }
        };

//agergamos un filtro de ejemplo, dado que esta separado la conexion a la bd, las tareas de las rutas y el pocesamiento del backend
//resulta mas facil aplicar un filtro cualquiera que sea
//una vez definido el filtro debo crear la correspondiente ruta, en el archivo ruta.js
const consultarVehiculo=async(id,callback)=>{
    const baseDeDatos= getDB();
 await  baseDeDatos
 .collection('vehiculo')
 .findOne({_id:new ObjectId(id)}, callback);
 
}        

//controlador para editar  vehiculos

const editarVehiculo=async (id, edicion, callback)=>{
    const filtroVehiculo= {_id:new ObjectId(id)};
    //Si envie los id por el body debo borralos por que sino se incorporan aa la BD y el elemento editado queda con dos id 
    //si mando los id por las rutas eso no es necesario
 
 
    //operaciones una operacion atomica, una instruccion que le envio al backend, que le indico que voy a editar
    const operacion={
        $set: edicion,};
 
    const baseDeDatos= getDB();
     
    await baseDeDatos
     .collection('vehiculo')
     .findOneAndUpdate(filtroVehiculo,operacion,{upsert:true,returnOriginal:true},callback);
     };
       
const eliminarVehiculo=async (id, callback)=>{
    const filtroVehiculo= {_id:new ObjectId(id)};
    const baseDeDatos= getDB();

    await baseDeDatos.collection('vehiculo').deleteOne(filtroVehiculo,callback);
    
};

export {queryAllVehicles, crearVehiculo, editarVehiculo, eliminarVehiculo, consultarVehiculo};