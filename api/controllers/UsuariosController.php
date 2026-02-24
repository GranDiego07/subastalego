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

    public function getUsuarioDetalleId($param)
    {
        try {
            $response = new Response();
            $usuarios = new UsuariosModel();
            $result = $usuarios->getUsuarioDetallexId($param);
            $response->toJSON($result);
        } catch (Exception $e) {
            // Elimina $response->toJSON($result); 
            $response->toJSON(["error" => $e->getMessage()]);
            handleException($e);
        }
    }
    // UsuariosController.php

    // En UsuariosController.php
    public function getUsuarioDetalle()
    {
        try {
            $response = new Response();
            $usuarios = new UsuariosModel();
            $result = $usuarios->getUsuarioDetalle();
            $response->toJSON($result);
        } catch (Exception $e) {
            // Devolver un objeto de error claro
            $response->toJSON(["error" => $e->getMessage()]);
        }
    }
}
