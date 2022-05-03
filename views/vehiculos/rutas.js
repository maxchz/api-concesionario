import Express from 'express';
import {getDB} from '../../db/db.js';



const rutasVehiculos= Express.Router();

//reemplazamos los app.get por los rutasVehiculo.route

rutasVehiculos.route("/vehiculos").get((req, res)=>{
    console.log("alguien hizo get en la ruta /vehiculos");
    //Codigo de ejemplo de una entrega de datos en formato Json al frontend
    // const vehiculos =[
    //     {nombre:"corolla",marca:"toyota",modelo:'2014'},
    //     {nombre:"gol",marca:"chevrolet",modelo:'2020'},
    //     {nombre:"duster",marca:"renault",modelo:'2015'},
    //     {nombre:"x5",marca:"BMW",modelo:'2022'},
    // ];

    // Codigo para entregar una devulucion de datos desde la BD a traves del backend
    const baseDeDatos= getDB();
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
rutasVehiculos.route ("/vehiculos/nuevo").post((req, res)=>{

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
            const baseDeDatos= getDB();

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

rutasVehiculos.route('/vehiculos/editar').patch((req,res)=>{
   const edicion=req.body;
   console.log(edicion);
   const filtroVehiculo= {_id:new ObjectId(edicion.id)};
   //Si envie los id por el body debo borralos por que sino se incorporan aa la BD y el elemento editado queda con dos id 
   //si mando los id por las rutas eso no es necesario

   delete edicion.id;

   //operaciones una operacion atomica, una instruccion que le envio al backend, que le indico que voy a editar
   const operacion={
       $set: edicion,};

   const baseDeDatos= getDB();
    
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

rutasVehiculos.route('/vehiculos/eliminar').delete( (req,res)=>{

    const filtroVehiculo= {_id:new ObjectId(req.body.id)};
    const baseDeDatos= getDB();

    baseDeDatos.collection('vehiculo').deleteOne(filtroVehiculo,(err,result)=>{
        if(err){
            console.error(err);
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
});

export default rutasVehiculos;