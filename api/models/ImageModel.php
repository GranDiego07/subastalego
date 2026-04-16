<?php
class ImageModel
{
    private $upload_path;
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif', 'webp');
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
        $this->upload_path = realpath(__DIR__ . '/../uploads') . DIRECTORY_SEPARATOR;
    }

    public function uploadFile($object)
    {
        if (!isset($_FILES['file'])) {
            return ['error' => 'No se recibió ningún archivo'];
        }

        if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            return ['error' => 'Error al subir archivo: ' . $_FILES['file']['error']];
        }

        if (empty($object->lego_id)) {
            return ['error' => 'lego_id es requerido'];
        }

        $file = $_FILES['file'];
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (!in_array($extension, $this->valid_extensions)) {
            return ['error' => 'Extensión no válida: ' . $extension];
        }

        $nombreCarpeta = isset($object->nombre)
            ? preg_replace('/[^a-zA-Z0-9_-]/', '_', $object->nombre)
            : 'lego_' . $object->lego_id;

        $carpeta = $this->upload_path . $nombreCarpeta . DIRECTORY_SEPARATOR;

        if (!is_dir($carpeta)) {
            mkdir($carpeta, 0755, true);
        }

        $filename = uniqid() . '_' . time() . '.' . $extension;
        $destination = $carpeta . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $id_lego = $object->lego_id;
            $url = 'uploads/' . $nombreCarpeta . '/' . $filename;

            $checkSQL = "SELECT COUNT(*) as total FROM imagenes WHERE id_lego = $id_lego AND es_principal = 1";
            $checkResult = $this->enlace->executeSQL($checkSQL);
            $tienePrincipal = $checkResult[0]->total > 0;

            $es_principal = $tienePrincipal ? 0 : 1;

            $sql = "INSERT INTO imagenes (url, es_principal, id_lego) 
                    VALUES ('$url', $es_principal, $id_lego)";
            $this->enlace->executeSQL_DML($sql);

            return ['url' => $url, 'es_principal' => $es_principal];
        } else {
            return ['error' => 'No se pudo guardar el archivo'];
        }
    }

    public function getImageMovie($idLego)
    {
        $vSql = "SELECT * FROM imagenes WHERE id_lego = $idLego";
        $vResultado = $this->enlace->executeSQL($vSql);
        if (!empty($vResultado)) {
            return $vResultado[0];
        }
        return $vResultado;
    }

    public function getImagenPrincipal($idLego)
    {
        $vSQL = "SELECT * FROM imagenes 
                    WHERE id_lego = $idLego 
                    AND es_principal = 1 
                    LIMIT 1";
        $vResultado = $this->enlace->executeSQL($vSQL);
        return (!empty($vResultado)) ? $vResultado[0] : null;
    }
}