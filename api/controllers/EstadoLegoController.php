<?php
class EstadoLego
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $Estadolego = new EstadoLegoModel();
            $result = $Estadolego->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    public function getLegoEstado($idusuario)
    {
        try{
            $response= new Response();
            $Estadolego = new EstadoLegoModel();
            $result = $Estadolego->getLegoEstado($idusuario);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}