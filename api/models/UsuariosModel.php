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
        $vSql = "SELECT u.id, u.correo, u.nombre_completo, u.fecha_registro, 
                        r.nombre AS rol_nombre, 
                        es.nombre AS estado_nombre
                    FROM usuarios u
                    inner join roles r on u.id_rol=r.id
                    inner join estados_usuario es on u.id_estado=es.id
                    ORDER BY u.id desc";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }
    //Obtener información de un usuarios específico, incluyendo las películas en las que participa y los roles
    public function getUsuarioDetallexId($id)
    {
        $estadoU = new EstadoUsuarioModel();
        $rolM = new RolModel();
        
        $vSql = "SELECT u.id, u.correo, u.nombre_completo, u.fecha_registro, 
                        r.nombre AS rol_nombre, 
                        es.nombre AS estado_nombre 
                    FROM usuarios u
                    INNER JOIN roles r ON u.id_rol = r.id
                    INNER JOIN estados_usuario es ON u.id_estado = es.id
                    WHERE u.id = $id";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
            $vResultado->lista_estados = $estadoU->all();
            $vResultado->lista_roles = $rolM->all();
        }
        return $vResultado;
    }
}
