<?php
class lego
{
    // GET listar
    // localhost:81/subastalego/api/lego
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $legoM = new LegoModel;
            //Método del modelo
            $result = $legoM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //GET Obtener 
    // localhost:81/appmovie/api/movie/5
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $lego = new LegoModel();
            //Acción del modelo a ejecutar
            $result = $lego->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //Obtener peliculas por tienda
    public function legosByVendedor($idVendedor)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $lego = new LegoModel();
            //Acción del modelo a ejecutar
            $result = $lego->legobyVendedor($idVendedor);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    
    public function legosByEstado($idVendedor)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $lego = new LegoModel();
            //Acción del modelo a ejecutar
            $result = $lego->legoByEstado($idVendedor);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function legosByDetalle($idVendedor)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $lego = new LegoModel();
            //Acción del modelo a ejecutar
            $result = $lego->legoByDetalle($idVendedor);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //Obtener cantidad de peliculas por genero
    public function getCountByGenre($param)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $lego = new LegoModel();
            //Acción del modelo a ejecutar
            $result = $lego->getCountByGenre($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $lego = new LegoModel();
            //Acción del modelo a ejecutar
            $result = $lego->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //PUT actualizar
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $lego = new LegoModel();
            //Acción del modelo a ejecutar
            $result = $lego->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
