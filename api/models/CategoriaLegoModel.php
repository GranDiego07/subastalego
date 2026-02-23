<?php
class CategoriaLegoModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM categorias";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

    public function getLegoCategoria($idcategoria)
    {
        //Consulta sql
        $vSql = "SELECT l.id, l.nombre, l.descripcion, c.nombre AS Categoria_Set
        FROM lego l, categorias c
        where l.id_categoria=$idcategoria";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    public function getLegoUsuarioCategoria($idusuario)
    {
        //Consulta sql
        $vSql = "SELECT l.id, l.nombre, l.descripcion, c.nombre AS Categoria_Set, u.nombre_completo As Nombre
        FROM lego l, categorias c, usuarios u 
        where l.id_categoria= c.id and l.id=$idusuario";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
}
