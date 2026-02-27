<?php
class subasta  // ← Debe estar en minúsculas para que el router la encuentre
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $Subasta = new SubastaModel();
            $result = $Subasta->all();
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
            $Subasta = new SubastaModel();
            $result = $Subasta->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getSubastaActiva()
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getSubastasActivas();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getSubastasCanFin()
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getSubastasCanFin();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getDetalleSubasta($id)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getDetalleSubasta($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getHistorialPujas($id)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getHistorialPujas($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
