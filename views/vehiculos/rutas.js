import Express from 'express';
import {queryAllVehicles, crearVehiculo, editarVehiculo, eliminarVehiculo,consultarVehiculo} from '../../controllers/vehiculos/controller.js';



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
rutasVehiculos.route ("/vehiculos/nuevo/").post((req, res)=>{

    crearVehiculo(req.body, genericCallback(res));
});

rutasVehiculos.route('/vehiculos/:id').patch((req,res)=>{
  editarVehiculo(req.params.id, req.body,genericCallback(res));
});

rutasVehiculos.route('/vehiculos/:id').delete( (req,res)=>{
    eliminarVehiculo(req.params.id, genericCallback(res));
   
});

//Ruta del filtro consultarVehiculo

rutasVehiculos.route("/vehiculos/:id").get((req, res)=>{
    console.log("alguien hizo get en la ruta /vehiculos");
    consultarVehiculo(req.params.id, genericCallback(res));
 
});

export default rutasVehiculos;