<?php
class EstadoUsuarioModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM estados_usuario;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Retornar el objeto
        return $vResultado;
    }
    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM estados_usuario where id=$id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    public function getUsuariosEstadoID($idUsuario)
    {
        //Consulta SQL
        $vSQL = "SELECT es.id, es.nombre
            FROM estados_usuario es, usuarios u 
            WHERE u.id = $idUsuario AND u.id_estado = es.id;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->executeSQL($vSQL);
        //Retornar el resultado
        return $vResultado;
    }
    public function getUsuariosEstado()
    {
        //Consulta SQL
        $vSQL = "SELECT es.id, es.nombre
            FROM estados_usuario es, usuarios u 
            WHERE u.id_estado = es.id order by u.id;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->executeSQL($vSQL);
        //Retornar el resultado
        return $vResultado;
    }
}
