import {getDB} from '../../db/db.js';

const queryAllVehicles= async (callback)=>{

 const baseDeDatos= getDB();
await  baseDeDatos
 .collection('vehiculo')
 .find({})
 .limit(50)
 .toArray(callback);
  };

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

            baseDeDatos.collection('vehiculo').insertOne(datosVehiculos,callback);
            
            }else{
                res.sendStatus(500);
            }
        }
       

  


export {queryAllVehicles, crearVehiculo};