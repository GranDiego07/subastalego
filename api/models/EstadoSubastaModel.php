<?php
class EstadoSubastaModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * from Estados_Subasta";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

    public function getSubastaEstado($idcategoria)
    {
        //Consulta sql
        $vSql = "SELECT s.id, l.nombre, es.nombre
                FROM estados_subasta es, subastas s, lego l  
                where s.id_estado= es.id and  es.id =$idcategoria";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
}
