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
        $vSql = "SELECT * FROM rol where id=$id";

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
}
