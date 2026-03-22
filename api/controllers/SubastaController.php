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
    public function getConDetalle($id)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getConDetalle($id);
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
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $Subasta = new SubastaModel();
            $result = $Subasta->create($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(["error" => $e->getMessage()]);
            handleException($e);
        }
    }
    public function allConDetalle()
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->allConDetalle();
            $response->toJSON($result);
        } catch (Exception $e) {
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
            $Subasta = new SubastaModel();
            //Acción del modelo a ejecutar
            $result = $Subasta->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function publicar($id)
    {
        try {
            $response = new Response();
            $subasta  = new SubastaModel();
            $result   = $subasta->publicar(intval($id));
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(["error" => $e->getMessage()]);
        }
    }

    public function cancelar($id)
    {
        try {
            $response = new Response();
            $subasta  = new SubastaModel();
            $result   = $subasta->cancelar(intval($id));
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(["error" => $e->getMessage()]);
        }
    }
    public function reactivar($id)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->reactivar($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
