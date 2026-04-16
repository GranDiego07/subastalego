<?php
class image
{
    public function create()
    {
        try {
            $response = new Response();

            $inputFILE = new stdClass();
            $inputFILE->lego_id = $_POST['lego_id'] ?? null;
            $inputFILE->nombre  = $_POST['nombre']  ?? null; // ✅ agrega el nombre

            $imagen = new ImageModel();
            $result = $imagen->uploadFile($inputFILE);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $imagen = new ImageModel();
            $result = $imagen->getImageMovie($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}