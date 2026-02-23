<?php
class CondicionLego
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $Condicionlego = new CondicionLegoModel();
            $result = $Condicionlego->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    public function getLegoUsuarioCondicion($idusuario)
    {
        try{
            $response= new Response();
            $Condicionlego = new CondicionLegoModel();
            $result = $Condicionlego->getLegoCondicionCategoria($idusuario);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}