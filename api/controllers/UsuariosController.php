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
    public function getByRol()
    {
        try {
            $response = new Response();
            $usuarios = new UsuariosModel();
            $result = $usuarios->getByRol();
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

            // Forzamos entero para evitar caracteres extraños como ":1"
            $id = intval($param);

            $result = $usuarios->getUsuarioDetallexId($id);

            if (!$result) {
                // Si el ID no existe en la BD
                http_response_code(404);
                $response->toJSON(["error" => "Usuario no encontrado"]);
                return;
            }

            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(["error" => $e->getMessage()]);
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
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $usuarios = new UsuariosModel();
            $result = $usuarios->create($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(["error" => $e->getMessage()]);
            handleException($e);
        }
    }
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $movie = new UsuariosModel();
            //Acción del modelo a ejecutar
            $result = $movie->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}
