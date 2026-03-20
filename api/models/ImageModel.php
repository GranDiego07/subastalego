<?php
class ImageModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif', 'webp');

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function uploadFile($object)
    {
        // Debug temporal — revisa C:\xampp\php\logs\php_error_log
        error_log("=== uploadFile ===");
        error_log("FILES: " . print_r($_FILES, true));
        error_log("POST: " . print_r($_POST, true));
        error_log("object lego_id: " . print_r($object, true));

        // Verificar que llegó el archivo
        if (!isset($_FILES['file'])) {
            error_log("ERROR: No se recibió ningún archivo");
            return ['error' => 'No se recibió ningún archivo'];
        }

        if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            error_log("ERROR upload: " . $_FILES['file']['error']);
            return ['error' => 'Error al subir archivo: ' . $_FILES['file']['error']];
        }

        // Verificar lego_id
        if (empty($object->lego_id)) {
            error_log("ERROR: lego_id no recibido");
            return ['error' => 'lego_id es requerido'];
        }

        $file = $_FILES['file'];
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        // Validar extensión
        if (!in_array($extension, $this->valid_extensions)) {
            error_log("ERROR: Extensión no válida: " . $extension);
            return ['error' => 'Extensión no válida: ' . $extension];
        }

        // Crear carpeta uploads si no existe
        if (!is_dir($this->upload_path)) {
            mkdir($this->upload_path, 0755, true);
            error_log("Carpeta uploads creada");
        }

        // Generar nombre único
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $destination = $this->upload_path . $filename;

        // Mover archivo
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $url = $destination;
            $id_lego = $object->lego_id;

            // Verificar si ya tiene imagen principal
            $checkSQL = "SELECT COUNT(*) as total FROM imagenes WHERE id_lego = $id_lego AND es_principal = 1";
            $checkResult = $this->enlace->ExecuteSQL($checkSQL);
            $tienePrincipal = $checkResult[0]['total'] > 0;

            $es_principal = $tienePrincipal ? 0 : 1;

            $sql = "INSERT INTO imagenes (url, es_principal, id_lego) 
                    VALUES ('$url', $es_principal, $id_lego)";
            $this->enlace->executeSQL_DML($sql);

            error_log("Imagen guardada: " . $url);
            return ['url' => $url, 'es_principal' => $es_principal];
        }

        error_log("ERROR: move_uploaded_file falló");
        return ['error' => 'No se pudo guardar el archivo'];
    }

    public function getImageMovie($idLego)
    {
        $vSql = "SELECT * FROM imagenes WHERE id_lego = $idLego";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
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
        $vResultado = $this->enlace->ExecuteSQL($vSQL);
        return (!empty($vResultado)) ? $vResultado[0] : null;
    }
}
