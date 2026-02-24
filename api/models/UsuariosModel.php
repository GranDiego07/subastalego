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
    

    public function getUsuarioDetalle()
    {
        $estadoU = new EstadoUsuarioModel();
        $rolM=new RolModel();
        //Consulta sql
        $vSql = "SELECT u.correo, u.nombre_completo, u.fecha_registro, r.nombre, es.nombre 
        FROM usuarios u, roles r, estados_usuario es 
        where u.id_estado = es.id and u.id_rol=r.id order by u.id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
            $vResultado->estado = $estadoU->getUsuariosEstado();
            $vResultado->rol=$rolM->getRolUsuario();
        }
        // Retornar el objeto
        return $vResultado;
    } 
    //Obtener información de un usuarios específico, incluyendo las películas en las que participa y los roles
    public function getUsuarioDetallexId ($id)
    {
        $estadoU = new EstadoUsuarioModel();
        $rolM=new RolModel();
        //Consulta sql
        $vSql = "SELECT u.correo, u.nombre_completo, u.fecha_registro, r.nombre, es.nombre 
        FROM usuarios u, roles r, estados_usuario es 
        where u.id_estado = es.id and u.id_rol=r.id and u.id=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
            $vResultado->estado = $estadoU->getUsuariosEstado($id);
            $vResultado->rol=$rolM->getRolUsuarioId($id);
        }
        // Retornar el objeto
        return $vResultado;
    } 
}
