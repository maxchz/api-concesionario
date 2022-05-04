import {getDB} from '../../db/db.js';
import {ObjectId} from 'mongodb';

const queryAllSales= async (callback)=>{

 const baseDeDatos= getDB();
 await  baseDeDatos
 .collection('Venta')
 .find({})
 .limit(50)
 .toArray(callback);
  };

//controlador para crear nuevo Venta
const crearVenta=async (datosVentas, callback)=>{
    const baseDeDatos= getDB();
    await baseDeDatos.collection('Venta').insertOne(datosVentas,callback);
 };

//agergamos un filtro de ejemplo, dado que esta separado la conexion a la bd, las tareas de las rutas y el pocesamiento del backend
//resulta mas facil aplicar un filtro cualquiera que sea
//una vez definido el filtro debo crear la correspondiente ruta, en el archivo ruta.js
const consultarVenta=async(id,callback)=>{
    const baseDeDatos= getDB();
 await  baseDeDatos
 .collection('Venta')
 .findOne({_id:new ObjectId(id)}, callback);
 
}        

//controlador para editar  Ventas

const editarVenta=async (id, edicion, callback)=>{
    const filtroVenta= {_id:new ObjectId(id)};
    //Si envie los id por el body debo borralos por que sino se incorporan aa la BD y el elemento editado queda con dos id 
    //si mando los id por las rutas eso no es necesario
 
 
    //operaciones una operacion atomica, una instruccion que le envio al backend, que le indico que voy a editar
    const operacion={
        $set: edicion,};
 
    const baseDeDatos= getDB();
     
    await baseDeDatos
     .collection('Venta')
     .findOneAndUpdate(filtroVenta,operacion,{upsert:true,returnOriginal:true},callback);
     };
       
const eliminarVenta=async (id, callback)=>{
    const filtroVenta= {_id:new ObjectId(id)};
    const baseDeDatos= getDB();

    await baseDeDatos.collection('Venta').deleteOne(filtroVenta,callback);
    
};

export {queryAllSales, crearVenta, editarVenta, eliminarVenta, consultarVenta};