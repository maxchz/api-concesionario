import Express from 'express';
import {getDB} from '../../db/db.js';
import {queryAllVehicles, crearVehiculo} from '../../controllers/vehiculos/controller.js';



const rutasVehiculos= Express.Router();
// Definiremos un controlador generico, que tiene una funcion anidada

const genericCallback=(res)=>{
    return (err,result)=>{
        if(err){
            res.status(500).send("Error consultando los vehiculos");
        }else{
            res.json(result);
        };
    }

   };



//reemplazamos los app.get por los rutasVehiculo.route

rutasVehiculos.route("/vehiculos").get((req, res)=>{
    console.log("alguien hizo get en la ruta /vehiculos");
    
    queryAllVehicles(genericCallback(res));
    //Codigo de ejemplo de una entrega de datos en formato Json al frontend
    // const vehiculos =[
    //     {nombre:"corolla",marca:"toyota",modelo:'2014'},
    //     {nombre:"gol",marca:"chevrolet",modelo:'2020'},
    //     {nombre:"duster",marca:"renault",modelo:'2015'},
    //     {nombre:"x5",marca:"BMW",modelo:'2022'},
    // ];

    // Codigo para entregar una devulucion de datos desde la BD a traves del backend
   

    // res.send(vehiculos);
});

// Aqui se establece la ruta para comunicacion completa desde el fron al back, 
// uso Insomnia para simular envio de datos desde front
rutasVehiculos.route ("/vehiculos/nuevo").post((req, res)=>{

    crearVehiculo(req.body, genericCallback(res));

   

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