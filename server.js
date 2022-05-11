// La importacion se hace distinta y no import Express form 'express'
// const express=required('express');
// Gracias a que agregue la linea "type":"module" en el packege.json, 
//la importacion la puedo hacer de forma tradicional
import Express from 'express';
import Cors from 'cors';
import dotenv from 'dotenv';
import {conectarDB} from './db/db.js';
import rutasVehiculos from './views/vehiculos/rutas.js';
import rutasUsuarios from './views/usuarios/rutas.js';
import rutasVentas from './views/ventas/rutas.js';
import jwt from 'express-jwt';
import jwks  from 'jwks-rsa';
import { auth } from 'express-oauth2-jwt-bearer';



dotenv.config({path:'./.env'});


// Cliente creado al que debo conectarme, a la clase MongoClient debo pasarle dos parametros
// el string de concexion y dos parametros que recomienda mongo useNewUrlParser y useUnifiedTopology



//Declaro una variable baseDeDatos global que servira para realizar tareas sobre la BD, se declara en un archivo separado, en db.js

// Declaramos la variable que sera el servidor, que tiene que escuchar un puerto especifico

const app=Express();

app.use(Express.json());
//El cors permite que expres comparta informacion a solicitudesd de otro origen 
app.use(Cors());


// Confirmar si los JWT son validos a Auth0

const checkJwt = auth({
    audience: 'api-auth-concesionario',
    issuerBaseURL: `https://concecionario-vehiculos.us.auth0.com/`,
  });


//4 Y 5- ENVIAMOS DATOS AL BACKEND PARA QUE DEVUELVA SI ES VALIDO O NO

app.use(checkJwt);
// le indico al server que rutas debe usar, exportamos el codgio de rutas.js
app.use(rutasVehiculos);
app.use(rutasUsuarios);
app.use(rutasVentas);








// Defino un codigo main principal que es el encargado de conectarse a la BD, se ejecuta todo el tiempo
// que cuando se coecte mme retornara el app.listen() que tiene un ciclo for while que hace que se ejecute todo el tiempo

 const main =()=>{
     //A la funcion connect se le pasand dos parametros un error spor si no funciona y la BD propiemente dicha
     //Con esta linea de codigo se realiza la conexion a la BD
     return (app.listen(process.env.PORT,()=>{
        console.log(`escuchando puerto ${process.env.PORT}!!! `)}))
};
// Llamo a la funcion conectar y le paso el name, que seria el callback que ejecuta conectarDB una vez que realizo su tareas de conectarse
 conectarDB(main);


