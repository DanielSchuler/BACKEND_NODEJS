'use strict';

/*------IMPORTANTE---------
    
    var params = req.body;

    El body en post man representa la viñeta body donde se envia la informacion 
    tambien se podria usar la viñeta params si y solo si usamos
    var params = req.params ;
*/
// Ruta o metodo de prueba para el api rest
//app.get('/probando',function(req,res){

/*app.post('/probando',(req,res)=>{
    var hola = req.params.hola;
return res.status(200).send({
    curso: 'Master en Frameworks JS',
    autor: 'Daniel Schuler',
    web:'www.prueba.com',
    hola
})
});*/

var validator = require('validator');
var Article = require('../models/article');

//modulo de filesystem para ubicar los archivos subidos y poderlos borrar
var fs = require('fs');
//modulo que permite conseguir la ruta del archivo
var path = require('path');

var controller = {
  datoCurso: (req, res) => {
    var hola = req.body.hola;
    return res.status(200).send({
      curso: 'Master en Frameworks JS',
      autor: 'Daniel Schuler',
      web: 'www.prueba.com',
      hola
    })
  },
  test: (req, res) => {
    return res.status(200).send({
      menssage: 'soy la accion test de mi controlador de articulos'

    })

  },


  /* Los call backs no son aceptados para la coneccion con MongoDB
  revisar article copy para ver como era con callbacks y como fueron modificados a usar then o async
  */




  //USING THEN
  //metodo save
  save: (req, res) => {
    const params = req.body;
    console.log('Received params:', params);

    // Validate data using validator
    const validate_title = !validator.isEmpty(params.title);
    const validate_content = !validator.isEmpty(params.content);

    if (validate_title && validate_content) {

      // crear el objeto a guardar
      var article = new Article();

      // asignar valores
      article.title = params.title;
      article.content = params.content;

      //date pero este se crea solo 

      article.image = null;

      // Save the article to the database using a promise (`.then()` syntax)
      /*
      
      manajamos la siguiente estructura:
      objeto.metodo().then((variable)=>{})
      */
      article
        .save()
        .then((articleStored) => {
          if (!articleStored) {
            return res.status(404).send({
              status: 'error',
              message: 'El artículo no se ha guardado',
            });
          }

          return res.status(200).send({
            status: 'success',
            article: articleStored,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            status: 'error',
            message: 'Error interno del servidor',
          });
        });
    } else {
      return res.status(200).send({
        status: 'error',
        message: 'Faltan datos',
      });
    }
  },//end save article
  //metodo get para todos los articulos
  //si deseo los ultimos 5 es opcional el parametro


  getArticles: (req, res) => {

    var query = Article.find({})
    var last = req.params.last;
    if (last || last != undefined) {
      query.limit(5);
    }

    //find para sacar los datos de la base de datos
    // para ordenarlo del mas nuevo al mas viejo se usa sort y -el parametro que requiera validar
    query.sort('-_id')
      .then((articles) => {


        if (!articles || articles.length === 0) {
          return res.status(404).send({
            status: 'error',
            message: 'No hay articulos para devolver',
          });
        }

        return res.status(200).send({

          status: 'success',
          articles
        });

      }).catch(error => {

        return res.status(500).send({
          status: 'error',
          message: 'Error al devolver los articulos'
        })


      });


  },//end get all articles




  // Handler for retrieving an article by IDs
  getArticle: (req, res) => {
    // Extract the article ID from the URL parameters
    const articleId = req.params.id;

    // Check if the articleId is missing or null, which is considered a bad request
    if (!articleId) {
      return res.status(400).send({
        status: 'error',
        message: 'No se proporcionó el ID del artículo.',
      });
    }

    // Use Mongoose's findById method to find the article by its unique ID
    Article.findById(articleId)
      .then((article) => {
        // Explicacion por que se REMUEVE LA CONDICION DE SI EL ARTICULO EXISTE esta condicion esta en el README dentro de controllers LINEA 90


        // If found, respond with a 200 status and the article data
        return res.status(200).send({
          status: 'success',
          article,
        });
      })
      .catch((error) => {
        // Handle any unexpected database query errors with a 500 status
        // PROBLEMAS DE CONECCION O EXISTENCIA DE ID
        return res.status(500).send({
          status: 'error',
          message: 'Error al buscar el artículo en la base de datos. Puede que haya dado un Id que no exista o puede haber un problema de conexión.',
        });
      });
  },//end get article by id

  update: (req, res) => {
    // Extract article ID from the URL parameters
    const articleId = req.params.id;
    // Extract data from the request body
    const params = req.body;

    try {
      // Validate the title and content fields
      const validate_title = !validator.isEmpty(params.title);
      const validate_content = !validator.isEmpty(params.content);

      if (validate_title && validate_content) {
        // Use findOneAndUpdate with promises to find and update the article
        Article.findOneAndUpdate({ _id: articleId }, params, { new: true })
          .then((articleUpdate) => {
            // Check if the article was found and updated successfully
            if (!articleUpdate) {
              // If not found or not updated, respond with a 404 status and a message
              return res.status(404).send({
                status: 'error',
                message: 'El artículo no existe o no se pudo encontrar y actualizar.',
              });
            }

            // If successful, send a 200 status with the updated article
            return res.status(200).send({
              status: 'success',
              article: articleUpdate,
            });
          })
          .catch((error) => {
            // Handle any errors during the update operation
            return res.status(500).send({
              status: 'error',
              message: 'Error al actualizar los datos del artículo.',
            });
          });
      } else {
        // Send a 200 status with a validation error message
        return res.status(200).send({
          status: 'error',
          message: 'Algun campo tiene datos vacios',
        });
      }
    } catch (err) {
      // Handle any errors related to missing data
      return res.status(200).send({
        status: 'error',
        message: 'algun campo no se envio',
      });
    }
  },//end update by id




  delete: function (req, res) {
    // Extract article ID from the URL parameters
    const articleId = req.params.id;

    // Use findOneAndDelete with promises to find and delete the article
    Article.findOneAndDelete({ _id: articleId })
      .then((articleRemoved) => {
        // Check if the article was found and deleted successfully
        if (!articleRemoved) {
          // If not found or not deleted, respond with a 404 status and a message
          return res.status(404).send({
            status: 'error',
            message: 'El artículo no existe o no se pudo eliminar.',
          });
        }

        // If successful, send a 200 status with the deleted article
        return res.status(200).send({
          status: 'success',
          message: `Se ha eliminado el artículo deseado con el ID: ${articleId}`,
          article: articleRemoved,
        });
      })
      .catch((error) => {
        // Handle any errors during the delete operation or database connectivity issues
        return res.status(500).send({
          status: 'error',
          message: 'Error al eliminar el artículo. Puede haber un problema de conexión.',
        });
      });
  },//end delete article by id

  upload: function (req, res) {
    // configurar el modulo connect mutiparty router/article.js


    //recoger el archivo de la peticion
    var file_name = 'Imagen no subida...'
    console.log(req.files);
    if (!req.files){
        return res.status(404).send({
          status:'error',  
          message:file_name, 
        
        })
    }
    // conseguir el nombre y la extension
    var file_path = req.files.file0.path;
    var file_split =  file_path.split('\\')

    /* si estoy usando linux o mac o lo voy a subir al servidor linux
    ADVERTENCIA: var file_split =  file_name.split('/')
    */


    // Nombre del archivo
    
    file_name = file_split[2];
    console.log('nombre del archivo'+file_name)

    // Extension del archivo
    var extension_split=file_name.split('\.');
    
    var file_extension=extension_split[1];
    // comprobar la extension, solo imagenes. si no es valido borrar el archivo

    if(file_extension!='png'&& file_extension!='jpg'&&file_extension!='jpeg'&& file_extension!='gif')
    {
      //borrar el archivo subido
      // el .unlink permite borrar el archivo con la ruta especificada
      fs.unlink(file_path,(err)=>{

        return res.status(200).send({
          status:'error',
          message:'La extension del archivo no es valido'
        });
        
      });
    }else{

      // si todo es valido
      //tomo el id del articulo que llego por parametro
      var articleId = req.params.id;
      //buscar el articulo asignarle el nombre de la imagen y actualizarlo
      Article.findOneAndUpdate({_id: articleId},{image:file_name},{new:true})
      .then((articleUpdated) => {
        
        
        return res.status(200).send({
          status: 'success',
          message: articleUpdated,
          archivos:req.files,
          split:file_split,
          file_name:file_name,
          extension_archivo:file_extension
        });

      }).catch((error) => {

        return res.status(200).send({
          status: 'error',
          message: 'Error al guardar la imagen de articulo'

        });

      })
     

    }
 
    


  
  },//end upload file

  //Se usa funcion flecha para hacer mas corta la sentencia
 /**
 * Función para obtener y enviar una imagen solicitada desde el sistema de archivos.
 *
 * @param {Object} req - El objeto de solicitud (request) que contiene información sobre la solicitud HTTP.
 * @param {Object} res - El objeto de respuesta (response) que se utilizará para enviar la respuesta HTTP.
 */
getImage: (req, res) => {
  // Paso 1: Obtener el nombre del archivo de la URL proporcionada en la solicitud
  var file = req.params.image;
  
  // Paso 2: Construir la ruta completa del archivo solicitado
  var path_file = './upload/articles/' + file;

  // Paso 3: Comprobar si el archivo existe utilizando fs.access
  fs.access(path_file, fs.constants.F_OK, (err) => {
      if (err) {
          // Paso 4a: Si el archivo no existe, responder con un estado 404 y un mensaje de error
          return res.status(404).send({
              status: 'success',
              message: 'La imagen no existe',
              file
          });
      } else {
          // Paso 4b: Si el archivo existe, enviar el archivo como respuesta HTTP
          // Nota: Esto se utiliza para cargar la imagen en una etiqueta de imagen en el navegador 
          console.log('allgood');
          return res.sendFile(path.resolve(path_file));
      }
  });
},// end getImage


//metodo para buscar elementos 

search:(req, res) =>{

  // sacar el string a buscar

  var search_text=req.params.search


   // Verificar que el texto de búsqueda tenga al menos 3 caracteres
   if (search_text.length < 3) {
    return res.status(400).send({
      status: 'error',
      message: 'El texto de búsqueda debe tener al menos 3 caracteres',
    });
  }

  // find or para hacer varias condiciones
  // no quiero que sean condiciones and o fijas y por eso usaremos el or
  Article.find({"$or":[
    //busqueda por titulo: cuando el titulo contenga el el search_text con la opcion incluir {i}
    // elemplo palabra a buscar guillermo titulos que lo contengan: Guillermo Tell, caballero Guillermo... etc,...
    // si el search_text esta incluido en el titulo o en el content
    {'title':{"$regex":search_text,'$options':'i'}},
    {'content':{"$regex":search_text,'$options':'i'}}


  ]})
  .sort([['date','descending']])
  .exec().then((articles) => {


    if(!articles||articles.length<=0) {
      return res.status(404).send({
        status: 'error',
        message: 'No hay articulos que coincidan con tu busqueda ',
        
        
    });

    }


    return res.status(200).send({
      status: 'success',
      message: 'estas en el metodo search',
      articles
      
  });


  }).catch((err) =>{


    if(err) {
      return res.status(500).send({
        status: 'success',
        message: 'error en la peticion',
        
        
    });

    }


  });
  
    



 



},//end search function


};// END CONTROLLER


//metodo para devolver este controlador y poderlo usar

module.exports = controller;