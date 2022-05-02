// La importacion se hace distinta y no import Express form 'express'
// const express=required('express');
// Gracias a que agregue la linea "type":"module" en el packege.json, 
//la importacion la puedo hacer de forma tradicional
import Express from 'express';
import {MongoClient, ObjectId} from 'mongodb';
import Cors from 'cors';


const stringbaseDeDatos=
'mongodb+srv://maxchz:devcba2022@proyectoconcesionario.naiqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// Cliente creado al que debo conectarme, a la clase MongoClient debo pasarle dos parametros
// el string de concexion y dos parametros que recomienda mongo useNewUrlParser y useUnifiedTopology

const client= new MongoClient(stringbaseDeDatos,{
    useNewUrlParser:true,
    useUnifiedTopology:true,

})

//Declaro una variable baseDeDatos global que servira para realizar tareas sobre la BD

let baseDeDatos;

// Declaramos la variable que sera el servidor, que tiene que escuchar un puerto especifico

const app=Express();

app.use(Express.json());
//El cors permite que expres comparta informacion a solicitudesd de otro origen 
app.use(Cors());

app.get("/vehiculos",(req, res)=>{
    console.log("alguien hizo get en la ruta /vehiculos");
    //Codigo de ejemplo de una entrega de datos en formato Json al frontend
    // const vehiculos =[
    //     {nombre:"corolla",marca:"toyota",modelo:'2014'},
    //     {nombre:"gol",marca:"chevrolet",modelo:'2020'},
    //     {nombre:"duster",marca:"renault",modelo:'2015'},
    //     {nombre:"x5",marca:"BMW",modelo:'2022'},
    // ];

    // Codigo para entregar una devulucion de datos desde la BD a traves del backend
    baseDeDatos.collection('vehiculo').find({}).limit(50).toArray((err,resultado)=>{
        if(err){
            res.status(500).send("Error consultando los vehiculos");
        }else{
            res.json(resultado);
        };
    });

    // res.send(vehiculos);
});

// Aqui se establece la ruta para comunicacion completa desde el fron al back, 
// uso Insomnia para simular envio de datos desde front
app.post ("/vehiculos/nuevo",(req, res)=>{

    const datosVehiculos= req.body
    console.log(datosVehiculos);

    console.log("Las llaves son:",Object.keys(datosVehiculos));
    try {
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
            baseDeDatos.collection('vehiculo').insertOne(datosVehiculos,(err,result)=>{
                if(err){
                    console.error(err);
                    res.sendStatus(500);
                }else {
                    console.log(result);
                    res.sendStatus(200);

                }

            });
            res.sendStatus(200);
            }else{
                res.sendStatus(500);
            }
        }
        catch{
            res.sendStatus(500);
        }

});

app.patch('/vehiculos/editar',(req,res)=>{
   const edicion=req.body;
   console.log(edicion);
   const filtroVehiculo= {_id:new ObjectId(edicion.id)};
   //Si envie los id por el body debo borralos por que sino se incorporan aa la BD y el elemento editado queda con dos id 
   //si mando los id por las rutas eso no es necesario

   delete edicion.id;

   //operaciones una operacion atomica, una instruccion que le envio al backend, que le indico que voy a editar
   const operacion={
       $set: edicion,};
   baseDeDatos
    .collection('vehiculo')
    .findOneAndUpdate(filtroVehiculo,operacion,{upsert:true,returnOriginal:true},(err,result)=>{
        if(err){
            console.error("Error actualizando el vehiculo", err);
            res.sendStatus(500);
        }else{
            console.log("Actualizado con exito");
            res.sendStatus(200);
            
        }
    })
});

app.delete('/vehiculos/eliminar', (req,res)=>{

    const filtroVehiculo= {_id:new ObjectId(req.body.id)};
    baseDeDatos.collection('vehiculo').deleteOne(filtroVehiculo,(err,result)=>{
        if(err){
            console.error(err);
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
});



// Defino un codigo main principal que es el encargado de conectarse a la BD, se ejecuta todo el tiempo
// que cuando se coecte mme retornara el app.listen() que tiene un ciclo for while que hace que se ejecute todo el tiempo

 const main =()=>{
     //A la funcion connect se le pasand dos parametros un error spor si no funciona y la BD propiemente dicha
     //Con esta linea de codigo se realiza la conexion a la BD
     client.connect((err,db)=>{
         if(err){
             console.error("Eror la conectar a la base de datos");
         }
         //Con la variable baseDeDatos trabajare cuando queira hacer algo en mi BD, 
         //le agino el valor de la conxion a la BD
         baseDeDatos=db.db('concesionario');
         console.log('baseDeDatos exitosa');
         return app.listen(5000,()=>{
            console.log('escuchando puerto 5000!!! '); 

     });
     
    });

 };
// Llamo a la funcion main
 main();


