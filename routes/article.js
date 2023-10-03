'use strict';

var express = require('express');

var ArticleController =require('../controllers/article');


var router = express.Router();


// modulo multipart para cargar archivos

var multipart = require('connect-multiparty');
var md_upload= multipart({uploadDir:'./upload/articles'});

//rutas de pruebas
router.post('/datos-curso',ArticleController.datoCurso);
router.get('/test-controlador',ArticleController.test);

//rutas para articulos
router.post('/save',ArticleController.save);
//de manera opcional mandar la propiedad last que defini yo para los ultimos articulos
router.get('/articles/:last?',ArticleController.getArticles);
router.get('/article/:id',ArticleController.getArticle);
router.put('/article/:id',ArticleController.update);
router.delete('/article/:id',ArticleController.delete);
//subir un archivo de imagen a un articulo en concreto: Post(url,midleware,metodo)
router.post('/upload-images/:id',md_upload, ArticleController.upload)
//router.post('/upload-images/:id', ArticleController.upload)

router.get('/get-image/:image',ArticleController.getImage);
router.get('/search/:search',ArticleController.search);
module.exports = router;