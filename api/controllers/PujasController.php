<?php
class PujasController
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $Pujas = new PujasModel();
            $result = $Pujas->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            
            handleException($e);
        }
    }
    public function get($param)
    {
        try {
            $response = new Response();
            $Pujas = new PujasModel();
            $result = $Pujas->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getPujasDetalle()
    {
        try {
            $response = new Response();
            $Pujass = new PujasModel();
            $result = $Pujass->getPujasDetalle();
            $response->toJSON($result);
        } catch (Exception $e) {
            // Devolver un objeto de error claro
            $response->toJSON(["error" => $e->getMessage()]);
        }
    }
}
