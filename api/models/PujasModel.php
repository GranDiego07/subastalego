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
        $vSql = "Select s.id, u.nombre_completo, p.monto, p.fecha_hora
                from pujas p 
                inner join subastas s on p.id_subasta=s.id
                inner join usuarios u on p.id_usuario=u.id
                order by p.id desc";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }
}
