<?php
class EstadoLegoModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * from Estados_lego";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

    public function getLegoEstado($idcategoria)
    {
        //Consulta sql
        $vSql = "SELECT l.id, l.nombre, l.descripcion, el.nombre 
        FROM  estados_lego el, lego l 
        where l.id_estado=$idcategoria";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
}
