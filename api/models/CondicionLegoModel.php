<?php
class CondicionLegoModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM condiciones_lego;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

    public function getLegoCondicion($idusuario)
    {
        //Consulta sql
        $vSql = "SELECT l.id, l.nombre, l.descripcion, cl.nombre 
        FROM condiciones_lego cl, lego l
        where l.id_condicion=$idusuario";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    public function getLegoCondicionCategoria($idusuario)
    {
        //Consulta sql
        $vSql = "SELECT l.id, l.nombre, l.descripcion, cl.nombre, c.nombre 
        FROM condiciones_lego cl, lego l, categorias c 
        where l.id_categoria=c.id and l.id_condicion=$idusuario";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
}
