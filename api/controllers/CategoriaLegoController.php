<?php
class CategoriaLego
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $categorialego = new CategoriaLegoModel();
            $result = $categorialego->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    public function getLegoUsuarioCategoria($idusuario)
    {
        try{
            $response= new Response();
            $categorialego = new CategoriaLegoModel();
            $result = $categorialego->getLegoUsuarioCategoria($idusuario);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}
