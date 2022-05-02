import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';


dotenv.config({path:'./.env'});

// Cliente creado al que debo conectarme, a la clase MongoClient debo pasarle dos parametros
// el string de concexion y dos parametros que recomienda mongo useNewUrlParser y useUnifiedTopology
const stringConexion= process.env.DATABASE_URL;


const client= new MongoClient(stringConexion,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

//Declaro una variable baseDeDatos global que servira para realizar tareas sobre la BD

let baseDeDatos;

const conectarDB=(callback)=>{
     //A la funcion connect se le pasand dos parametros un error spor si no funciona y la BD propiemente dicha
     //Con esta linea de codigo se realiza la conexion a la BD
     client.connect((err,db)=>{
        if(err){
            console.error("Eror la conectar a la base de datos");
            return 'error';
        }
        //Con la variable baseDeDatos trabajare cuando queira hacer algo en mi BD, 
        //le agino el valor de la conxion a la BD
        baseDeDatos=db.db('concesionario');
        console.log('Conexion a base De Datos exitosa');
        return callback(); 

    });
    
   };

   //cada vez que llame a la funcion getDB me retorna la BAse de datos, luego puedo usar en cualquier parte del
   //codigo del server.js a la variable baseDeDatos
const getDB=()=>{
       return baseDeDatos;
   }

   export {conectarDB, getDB}
