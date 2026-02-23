<?php
// Composer autoloader
require_once 'vendor/autoload.php';

/*--- CORS Headers - deben ir ANTES de cualquier output ---*/
header("Access-Control-Allow-Origin: *");                  // Sin espacio al final
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");                   // Cachea preflight 24h

// Manejo explícito de preflight OPTIONS (muy importante)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);  // 204 No Content es estándar para OPTIONS exitoso
    exit(0);
}

/*--- Content-Type ---*/
header('Content-Type: application/json; charset=utf-8');

/*--- Requerimientos Clases o librerías ---*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Modelos ---*/
require_once "models/CategoriaLegoModel.php";
require_once "models/CondicionLegoModel.php";
require_once "models/EstadoLegoModel.php";
require_once "models/ImageModel.php";
require_once "models/LegoModel.php";
require_once "models/RolModel.php";
require_once "models/UsuariosModel.php";

/***--- Controladores ---*/
require_once "controllers/CategoriaLegoController.php";
require_once "controllers/CondicionLegoController.php";
require_once "controllers/EstadoLegoController.php";
require_once "controllers/ImageController.php";
require_once "controllers/LegoController.php";
require_once "controllers/UsuariosController.php";

// Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();