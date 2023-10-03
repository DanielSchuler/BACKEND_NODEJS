'use strict';


const mongoose = require('mongoose');
var app = require('./app');
var port=3900;
//se usan las promesas con el then
//mongoose.connect(url,opciones).then(()=>{
//url: usaremos en estos momentos nuestra coneccion a la maquina local

//se hace la coneccion y la base de datos que se va a crear si no existencia
//como opciones usaremos el urlParser



// se manejaran promesas para evitar errores con mongodb
// Set MongoDB connection option

mongoose.Promise = global.Promise;
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  };
  
  mongoose.connect('mongodb://localhost:27017/api_rest_blog', mongooseOptions)
    .then(() => {
      console.log('La conexión a la base de datos se ha realizado bien!!');

      // Crear servidor y ponerme a escuchar peticiones http
      app.listen(port,() => {
        console.log('Servidor corriendo en el http://localhost:'+port);
      });
    })
    .catch((error) => {
      console.error('Error al conectar a la base de datos:', error);
    });