<?php
class PagoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Crear un pago nuevo con estado 'pendiente' por defecto
     */
    public function crear($objeto)
    {
        $conectorTemp   = new MySqlConnect();
        $nombreEscapado = $conectorTemp->escape($objeto->nombre_usuario ?? 'Usuario');

        $sql = "INSERT INTO pagos 
                (id_subasta, id_usuario, nombre_usuario, monto, fecha_de_pago, estado) 
                VALUES (
                    " . intval($objeto->id_subasta) . ",
                    " . intval($objeto->id_usuario) . ",
                    '$nombreEscapado',
                    " . floatval($objeto->monto) . ",
                    NOW(),
                    'pendiente'
                )";

        return $this->enlace->executeSQL_DML_last($sql);
    }

    /**
     * Confirmar un pago: cambia estado a 'confirmado'
     */
    public function confirmar($id)
    {
        $sql = "UPDATE pagos 
                SET estado = 'confirmado'
                WHERE id = " . intval($id);

        $this->enlace->executeSQL_DML($sql);

        return [
            "success" => true,
            "message" => "Pago confirmado correctamente"
        ];
    }

    /**
     * Obtener pago por ID
     */
    public function getById($id)
    {
        $sql = "SELECT 
                    p.id            AS pago_id,
                    p.id_subasta,
                    p.id_usuario,
                    p.nombre_usuario,
                    p.monto,
                    p.fecha_de_pago AS fecha_creacion,
                    p.estado,
                    s.id            AS subasta_id,
                    l.nombre        AS subasta_nombre
                FROM pagos p
                LEFT JOIN subastas s ON s.id = p.id_subasta
                LEFT JOIN lego   l ON l.id = s.id_lego
                WHERE p.id = " . intval($id) . "
                LIMIT 1";

        $resultado = $this->enlace->executeSQL($sql);
        return !empty($resultado) ? $resultado[0] : null;
    }

    /**
     * Obtener todos los pagos PENDIENTES de un usuario
     */
    public function getPorUsuario($id_usuario)
    {
        $response   = new Response();
        $id_usuario = $_GET['id_usuario'] ?? null;

        error_log(">>> getPorUsuario llamado con id_usuario: " . $id_usuario); // ← agrega esto

        $sql = "SELECT 
                        p.id            AS pago_id,
                        p.id_subasta,
                        p.id_usuario,
                        p.nombre_usuario,
                        p.monto,
                        p.fecha_de_pago AS fecha_creacion,
                        p.estado,
                        l.nombre        AS subasta_nombre
                    FROM pagos p
                    LEFT JOIN subastas s ON s.id = p.id_subasta
                    LEFT JOIN lego   l ON l.id = s.id_lego
                    WHERE p.id_usuario = $id_usuario
                    AND p.estado = 'pendiente'
                    ORDER BY p.fecha_de_pago DESC";

        return $this->enlace->executeSQL($sql);
    }

    /**
     * Verificar si ya existe un pago para una subasta
     */
    public function existePagoParaSubasta($id_subasta)
    {
        $vSql      = "SELECT id FROM pagos WHERE id_subasta = " . intval($id_subasta) . " LIMIT 1";
        $resultado = $this->enlace->executeSQL($vSql);
        return !empty($resultado);
    }

    /**
     * Resumen estadístico de pagos de un usuario
     */
    public function resumenPorUsuario($id_usuario)
    {
        $sql = "SELECT
                    COUNT(*)                                        AS total,
                    SUM(monto)                                      AS monto_total,
                    SUM(estado = 'pendiente')                       AS pendientes,
                    SUM(estado = 'confirmado')                      AS confirmados
                FROM pagos
                WHERE id_usuario = " . intval($id_usuario);

        $resultado = $this->enlace->executeSQL($sql);
        return !empty($resultado) ? $resultado[0] : null;
    }
}
