<?php
class PujasModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM pujas;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }


    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM pujas where id=$id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
    public function getPujasDetalle()
    {
        $vSql = "SELECT 
                p.id, 
                u.nombre_completo AS NombreUsuario, 
                l.nombre AS NombreLego, 
                p.monto, 
                p.fecha_hora
            FROM pujas p 
            INNER JOIN subastas s ON p.id_subasta = s.id
            INNER JOIN usuarios u ON p.id_usuario = u.id
            INNER JOIN lego l ON s.id_lego = l.id
            ORDER BY p.id DESC";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    public function getPujasPorUsuario($id_usuario)
    {
        $id = intval($id_usuario);
        $vSql = "SELECT 
                    p.id AS puja_id,
                    p.id_subasta,
                    p.monto,
                    p.fecha_hora,
                    l.nombre AS lego_nombre,
                    es.nombre AS estado_subasta
                FROM pujas p
                INNER JOIN subastas s ON s.id = p.id_subasta
                INNER JOIN lego l ON l.id = s.id_lego
                INNER JOIN estados_subasta es ON es.id = s.id_estado
                WHERE p.id_usuario = $id
                ORDER BY p.fecha_hora DESC";

        return $this->enlace->ExecuteSQL($vSql);
    }
}