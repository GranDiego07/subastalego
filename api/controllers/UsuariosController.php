<?php
class usuarios
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $usuarios = new UsuariosModel();
            $result = $usuarios->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    public function get($param)
    {
        try {
            $response = new Response();
            $usuarios = new UsuariosModel();
            $result = $usuarios->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    public function getUsuariosLego($id)
    {
        try {
            $response = new Response();
            $usuarios = new UsuariosModel();
            $result = $usuarios->getUsuariosLego($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    /*
    public function getActorMoviesRol($param)
    {
        try {
            $response = new Response();
            $usuarios = new UsuariosModel();
            $result = $usuarios->getUsuarioMoviesRol($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }*/
}
