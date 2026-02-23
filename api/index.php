<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Agregar todos los modelos*/
require_once "models/CategoriaLegoModel.php";
require_once "models/CondicionLegoModel.php";
require_once "models/EstadoLegoModel.php";
require_once "models/ImageModel.php";
require_once "models/LegoModel.php";
require_once "models/RolModel.php";
require_once "models/UsuariosModel.php";

/***--- Agregar todos los controladores*/
require_once "controllers/CategoriaLegoController.php";
require_once "controllers/CondicionLegoController.php";
require_once "controllers/EstadoLegoController.php";
require_once "controllers/ImageController.php";
require_once "controllers/LegoController.php";
require_once "controllers/RolController.php";
require_once "controllers/UsuariosController.php";


//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();



