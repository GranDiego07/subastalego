<?php
class PagoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function crear($objeto)
    {
        // Conector temporal para el escape (evita el error 500 de conexión cerrada)
        $conectorTemp = new MySqlConnect();
        $nombreEscapado = $conectorTemp->escape($objeto->nombre_usuario ?? 'Usuario');

        $sql = "INSERT INTO pagos 
                (id_subasta, id_usuario, nombre_usuario, monto, fecha_de_pago) 
                VALUES (
                    " . intval($objeto->id_subasta) . ",
                    " . intval($objeto->id_usuario) . ",
                    '$nombreEscapado',
                    " . floatval($objeto->monto) . ",
                    NOW()
                )";

        return $this->enlace->executeSQL_DML_last($sql);
    }

    public function existePagoParaSubasta($id_subasta)
    {
        $vSql = "SELECT id FROM pagos WHERE id_subasta = " . intval($id_subasta) . " LIMIT 1";
        $resultado = $this->enlace->executeSQL($vSql);
        return !empty($resultado);
    }
}