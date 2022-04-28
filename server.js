// La importacion se hace distinta y no import Express form 'express'
// const express=required('express');
// Gracias a que agregue la linea "type":"module" en el packege.json, 
//la importacion la puedo hacer de forma tradicional
import Express from 'express';


// Declaramos la variable que sera el servidor

const app=Express();

app.use(Express.json());


app.get("/vehiculos",(req, res)=>{
    console.log("alguien hizo get en la ruta /vehiculos");
    const vehiculos =[
        {nombre:"corolla",marca:"toyota",modelo:'2014'},
        {nombre:"gol",marca:"chevrolet",modelo:'2020'},
        {nombre:"duster",marca:"renault",modelo:'2015'},
        {nombre:"x5",marca:"BMW",modelo:'2022'},
    ];

    res.send(vehiculos);
});

// Aqui se establece la ruta para comunicacion completa desde el fron al back, 
// uso Insomnia para simular envio de datos desde front
app.post ("/vehiculos/nuevo",(req, res)=>{

    const datosVehiculos= req.body
    console.log(datosVehiculos);

    console.log("Las llaves son:",Object.keys(datosVehiculos));
    try {
        if (
            Object.keys(datosVehiculos).includes('name')&&
            Object.keys(datosVehiculos).includes('brand')&&
            Object.keys(datosVehiculos).includes('model')
            ){
            //aqui implemento codigo para crear vehiculo en la base de datos
            res.sendStatus(200);
            }else{
                res.sendStatus(500);
            }
        }
        catch{
            res.sendStatus(500);
        }

});

app.listen(5000,()=>{
    console.log('escuchando puerto 5000!!! '); 
})