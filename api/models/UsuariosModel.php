<?php
class UsuariosModel
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
        $vSql = "SELECT * FROM usuarios;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Retornar el objeto
        return $vResultado;
    }
    /*Obtener */
    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM usuarios where id=$id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
    /*Obtener los usuarios con su lego respectivo */
    public function getUsuariosLego($idMovie)
    {
        //Consulta SQL
        $vSQL = "SELECT u.id, u.nombre_completo , l.nombre
            FROM usuarios u, lego l
            where u.id=l.id_vendedor and l.id=$idMovie;";
        //Establecer conexión

        //Ejecutar la consulta
        $vResultado = $this->enlace->executeSQL($vSQL);
        //Retornar el resultado
        return $vResultado;
    }
    /*
    //Obtener información de un usuarios específico, incluyendo las películas en las que participa y los roles
    public function getUsuariosMoviesRol($id)
    {
        $movieM = new MovieModel();
        //Consulta sql
        $vSql = "SELECT * FROM usuarios where id=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
            $vResultado->movies = $movieM->moviesByUsuarios($id);
        }
        // Retornar el objeto
        return $vResultado;
    } */
}
