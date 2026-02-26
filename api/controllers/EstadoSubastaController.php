<?php
class EstadoSubasta
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $EstadoSubasta = new EstadoSubastaModel();
            $result = $EstadoSubasta->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    public function getSubastaEstado($idusuario)
    {
        try{
            $response= new Response();
            $EstadoSubasta = new EstadoSubastaModel();
            $result = $EstadoSubasta->getSubastaEstado($idusuario);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}