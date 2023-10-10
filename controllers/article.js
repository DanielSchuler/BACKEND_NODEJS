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
const articleService = require('../services/articleService');

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



  // Controller: Handles HTTP request and response
  save: (req, res) => {
    // Extract request parameters from the HTTP request body
    const params = req.body;

    // Call the save function in the articleService
    articleService.save(params)
      .then((result) => {
        if (result.success) {
          // If the article was successfully saved, respond with a success status (200) and the saved article
          return res.status(200).send({
            status: 'success',
            article: result.article,
          });
        } else {
          // Check for the error message 'Missing data' and send a bad request status (400) if it's missing data,
          // otherwise, send a not found status (404) indicating the article wasn't saved
          if (result.message === 'Missing data') {
            return res.status(400).send({
              status: 'error',
              message: 'Missing data',
            });
          } else {
            return res.status(404).send({
              status: 'error',
              message: 'El artículo no se ha guardado',
            });
          }
        }
      })
      .catch((error) => {
        // Handle any unexpected errors by responding with a server error status (500)
        return res.status(500).send({
          status: 'error',
          message: 'Error interno del servidor',
        });
      });
  },


  // Controller: Handles HTTP request and response for fetching articles
  getArticles: (req, res) => {
    // Extract request parameters from the HTTP request
    var params = req.params;

    // Call the getArticles function in the articleService
    articleService.getArticles(params)
      .then((articles) => {
        if (!articles || articles.length === 0) {
          // If no articles were found, respond with a not found status (404) and an error message
          return res.status(404).send({
            status: 'error',
            message: 'No hay artículos para devolver',
          });
        }

        // If articles were found, respond with a success status (200) and the retrieved articles
        return res.status(200).send({
          status: 'success',
          articles,
        });
      })
      .catch((error) => {
        // Handle any unexpected errors by responding with a server error status (500)
        return res.status(500).send({
          status: 'error',
          message: 'Error al devolver los artículos',
        });
      });
  },

  // Controller: Handles HTTP request and response for fetching an article by ID
  getArticle: (req, res) => {
    // Extract the article ID from the request parameters
    const articleId = req.params.id;

    // Call the getArticleById function from the articleService
    articleService.getArticleById(articleId)
      .then((article) => {
        // If the article is found, respond with a success status (200) and the article data
        return res.status(200).send({
          status: 'success',
          article,
        });
      })
      .catch((error) => {
        // If there's an error (e.g., article not found or database error), respond with a server error status (500)
        // and send the error response directly to the client
        return res.status(500).send(error);
      });
  },

  // Controller: Handles HTTP request and response for updating an article
  update: (req, res) => {
    // Extract the request body containing update parameters
    const params = req.body;

    // Call the update function from the articleService
    articleService.update(params)
      .then((result) => {
        if (result.success) {
          // If the update was successful, respond with a success status (200) and the updated article
          return res.status(200).send({
            status: 'success',
            article: result.article,
          });
        } else {
          // If there was an issue with the update (e.g., validation error or article not found),
          // respond with an error status (404) and an error message
          return res.status(404).send({
            status: 'error',
            message: result.message,
          });
        }
      })
      .catch((error) => {
        // If there's a server error during the update process, respond with a server error status (500)
        // and an internal server error message
        return res.status(500).send({
          status: 'error',
          message: 'Error interno del servidor',
        });
      });
  },
  //end get article by id
  /*
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
    },*///end update by id


  // Controller: Handles HTTP request and response for deleting an article
delete: function (req, res) {
  // Extract the request parameters containing the article ID to be deleted
  const params = req.params;

  // Call the delete function from the articleService
  articleService.delete(params)
    .then((result) => {
      if (result.success) {
        // If the deletion was successful, respond with a success status (200) and a success message
        return res.status(200).send({
          status: 'success',
          message: result.message,
        });
      } else {
        // If there was an issue with the deletion (e.g., article not found), respond with an error status (404)
        // and an error message
        return res.status(404).send({
          status: 'error',
          message: result.message,
        });
      }
    })
    .catch((error) => {
      // If there's a server error during the deletion process, respond with a server error status (500)
      // and an internal server error message
      return res.status(500).send({
        status: 'error',
        message: 'Error interno del servidor',
      });
    });
},







  // Controller: Handles HTTP request and response for uploading an image file to an article
upload: function (req, res) {
  // Extract the article ID and file path from the request
  const articleId = req.params.id;
  const file_path = req.files.file0.path;

  // Call the uploadFile method from the articleService
  articleService
    .uploadFile(articleId, file_path)
    .then((articleUpdated) => {
      // If the image upload and article update were successful, respond with a success status (200)
      // and additional information about the uploaded file
      res.status(200).send({
        status: 'success',
        message: articleUpdated,
        archivos: req.files,
        split: file_path.split('\\'),
        file_name: file_path.split('\\')[2],
        extension_archivo: file_path.split('\\')[2].split('.')[1],
      });
    })
    .catch((error) => {
      // If there's an error during the upload or article update, respond with an error status (200)
      // and an error message
      res.status(200).send({
        status: 'error',
        message: error,
      });
    });
},



  //end upload file

  //Se usa funcion flecha para hacer mas corta la sentenci
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

  search: (req, res) => {

    // sacar el string a buscar

    var search_text = req.params.search


    // Verificar que el texto de búsqueda tenga al menos 3 caracteres
    if (search_text.length < 3) {
      return res.status(400).send({
        status: 'error',
        message: 'El texto de búsqueda debe tener al menos 3 caracteres',
      });
    }

    // find or para hacer varias condiciones
    // no quiero que sean condiciones and o fijas y por eso usaremos el or
    Article.find({
      "$or": [
        //busqueda por titulo: cuando el titulo contenga el el search_text con la opcion incluir {i}
        // elemplo palabra a buscar guillermo titulos que lo contengan: Guillermo Tell, caballero Guillermo... etc,...
        // si el search_text esta incluido en el titulo o en el content
        { 'title': { "$regex": search_text, '$options': 'i' } },
        { 'content': { "$regex": search_text, '$options': 'i' } }


      ]
    })
      .sort([['date', 'descending']])
      .exec().then((articles) => {


        if (!articles || articles.length <= 0) {
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


      }).catch((err) => {


        if (err) {
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