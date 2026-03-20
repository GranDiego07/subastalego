<?php
class Rol
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $Rol = new RolModel();
            $result = $Rol->all();
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
            $rol = new RolModel();
            $result = $rol->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getRolUsuarioId($id)
    {
        try {
            $response = new Response();
            $rol = new RolModel();
            $result = $rol->getRolUsuarioId($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getRolUsuario($id)
    {
        try {
            $response = new Response();
            $rol = new RolModel();
            $result = $rol->getRolUsuario($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
