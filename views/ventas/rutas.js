import Express from 'express';
import {queryAllSales, crearVenta, editarVenta, eliminarVenta,consultarVenta} from '../../controllers/Ventas/controller.js';



const rutasVentas= Express.Router();

const genericCallback=(res)=>{
    return (err,result)=>{
        if(err){
            res.status(500).send("Error consultando los Ventas");
        }else{
            res.json(result);
        };
    }

   };



rutasVentas.route("/ventas").get((req, res)=>{
    console.log("alguien hizo get en la ruta /Ventas");
    queryAllSales(genericCallback(res));
});    
   
rutasVentas.route ("/ventas/nuevo").post((req, res)=>{

    crearVenta(req.body, genericCallback(res));
});

rutasVentas.route('/ventas/:id').patch((req,res)=>{
  editarVenta(req.params.id, req.body,genericCallback(res));
});

rutasVentas.route('/ventas/:id').delete( (req,res)=>{
    eliminarVenta(req.params.id, genericCallback(res));
   
});


rutasVentas.route("/ventas/:id").get((req, res)=>{
    console.log("alguien hizo get en la ruta /ventas");
    consultarVenta(req.params.id, genericCallback(res));
 
});

export default rutasVentas;