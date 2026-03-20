<?php
class EstadoUsuario
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $EstadoUsuario = new EstadoUsuarioModel();
            $result = $EstadoUsuario->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $EstadoUsuario = new EstadoUsuarioModel();
            $result = $EstadoUsuario->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function getUsuariosEstadoID($idusuario)
    {
        try {
            $response = new Response();
            $EstadoUsuario = new EstadoUsuarioModel();
            $result = $EstadoUsuario->getUsuariosEstadoID($idusuario);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getUsuariosEstado()
    {
        try {
            $response = new Response();
            $EstadoUsuario = new EstadoUsuarioModel();
            $result = $EstadoUsuario->getUsuariosEstado();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
