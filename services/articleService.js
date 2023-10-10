const Article = require('../models/article'); // Adjust the path as needed
const validator = require('validator');
var fs = require('fs');
//modulo que permite conseguir la ruta del archivo
var path = require('path');
// Define your service methods
const articleService = {


    // Service: Contains the business logic for saving an article
    save: (params) => {
        // Validate data using the validator library
        const validate_title = !validator.isEmpty(params.title);
        const validate_content = !validator.isEmpty(params.content);

        // Return a promise to handle asynchronous operations
        return new Promise((resolve, reject) => {
            if (validate_title && validate_content) {
                // If title and content are valid, create a new article object
                const article = new Article({
                    title: params.title,
                    content: params.content,
                    image: 'no_image', // Set a default image if no image is provided
                });

                // Save the article to the database
                article.save()
                    .then((articleStored) => {
                        // Resolve the promise with a success status and the saved article
                        resolve({
                            success: true,
                            article: articleStored,
                        });
                    })
                    .catch((error) => {
                        // Reject the promise with an error message if there's an issue saving the article
                        reject(new Error('Error while saving the article'));
                    });
            } else {
                // Resolve the promise with a failure status and a message indicating missing data
                resolve({
                    success: false,
                    message: 'Missing data',
                });
            }
        });
    },

    

    // Service: Contains the business logic for fetching articles
    getArticles: (params) => {
        // Create a query to fetch articles from the database
        var query = Article.find({});
        var last = params.last;

        if (last || last !== undefined) {
            // If 'last' parameter is provided, limit the query to fetch only the last 5 articles
            query.limit(5);
        }

        // Sort the articles by the _id field in descending order to get the newest articles first
        query.sort('-_id');

        // Return a promise to handle the asynchronous database query
        return query.exec(); // Execute the query and return a promise
    },

    // Service: Fetches an article by its unique ID
    getArticleById: (id) => {
        // Check if the article ID is provided
        if (!id) {
            // If not provided, reject the promise with an error message
            return Promise.reject({
                status: 'error',
                message: 'No se proporcionó el ID del artículo.',
            });
        }

        // Fetch the article by its ID from the database
        return Article.findById(id)
            .then((article) => {
                // If the article is not found, reject the promise with an error message
                if (!article) {
                    return Promise.reject({
                        status: 'error',
                        message: 'El artículo no fue encontrado.',
                    });
                }

                // If the article is found, resolve the promise with the article data
                return article;
            })
            .catch((error) => {
                // If there's an error during the database query, reject the promise with an error message
                return Promise.reject({
                    status: 'error',
                    message: 'Error al buscar el artículo.',
                });
            });
    },

    // Service: Contains the business logic for updating an article
    update: (params) => {
        const articleId = params.id;

        try {
            const validate_title = !validator.isEmpty(params.title);
            const validate_content = !validator.isEmpty(params.content);

            if (validate_title && validate_content) {
                // Attempt to update the article in the database by its ID
                return Article.findOneAndUpdate({ _id: articleId }, params, { new: true })
                    .then((articleUpdate) => {
                        if (!articleUpdate) {
                            // If the article was not found, reject the promise with an error message
                            return {
                                success: false,
                                message: 'El artículo no existe o no se pudo encontrar y actualizar.',
                            };
                        }

                        // If the update was successful, resolve the promise with the updated article data
                        return {
                            success: true,
                            article: articleUpdate,
                        };
                    })
                    .catch((error) => {
                        // If there's an error during the database update, reject the promise with an error message
                        return {
                            success: false,
                            message: 'Error al actualizar los datos del artículo.',
                        };
                    });
            } else {
                // If there are validation errors (e.g., empty fields), reject the promise with an error message
                return {
                    success: false,
                    message: 'Algun campo tiene datos vacíos',
                };
            }
        } catch (err) {
            // If there's an error related to missing data, reject the promise with an error message
            return {
                success: false,
                message: 'Algun campo no se envió',
            };
        }
    },

   // Service: Contains the business logic for deleting an article by ID
delete: (params) => {
    const articleId = params.id;
  
    // Attempt to find and delete the article in the database by its ID
    return Article.findOneAndDelete({ _id: articleId })
      .then((articleRemoved) => {
        // If the article was not found, reject the promise with an error message
        if (!articleRemoved) {
          return {
            success: false,
            message: 'El artículo no existe o no se pudo eliminar.',
          };
        }
  
        // If the article was successfully deleted, resolve the promise with a success message
        return {
          success: true,
          message: `Se ha eliminado el artículo deseado con el ID: ${articleId}`,
          article: articleRemoved,
        };
      })
      .catch((error) => {
        // If there's an error during the database operation, reject the promise with an error message
        return {
          success: false,
          message: 'Error al eliminar el artículo. Puede haber un problema de conexión.',
        };
      });
  },


// Service: Contains the business logic for uploading an image file to an article
uploadFile: (articleId, filePath) => {
  // Handle file upload logic here
  return new Promise((resolve, reject) => {
    const file_split = filePath.split('\\');
    const file_name = file_split[2];
    const extension_split = file_name.split('.');
    const file_extension = extension_split[1];

    // Add your file validation and Article update logic here
    if (file_extension !== 'png' && file_extension !== 'jpg' && file_extension !== 'jpeg' && file_extension !== 'gif') {
      // If the file extension is not allowed, reject the promise with an error message
      fs.unlink(filePath, (err) => {
        reject('Invalid file extension');
      });
    } else {
      // If the file extension is valid, update the article with the image filename
      Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true })
        .then((articleUpdated) => {
          // If the article update was successful, resolve the promise with the updated article data
          resolve(articleUpdated);
        })
        .catch((error) => {
          // If there's an error during the article update, reject the promise with an error message
          reject('Error updating article with image');
        });
    }
  });
},


}

module.exports = articleService;
