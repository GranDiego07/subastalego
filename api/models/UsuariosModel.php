<?php
// UsuariosModel.php
require_once "models/EstadoUsuarioModel.php"; // Ajusta la ruta según tu estructura
require_once "models/RolModel.php";

use Firebase\JWT\JWT;

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
    public function getByRol()
    {
        //Consulta sql
        $vSql = "SELECT * FROM usuarios where id_rol=2";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
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

    public function getUsuarioList()
    {
        $vSql = "SELECT u.nombre_completo,
                        r.nombre AS rol_nombre, 
                        es.nombre AS estado_nombre
                    FROM usuarios u, roles r, estados_usuario es
                    where u.id_rol=r.id and  u.id_estado=es.id
                    ORDER BY u.id desc";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
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
        // 1. Consulta con subconsultas para campos calculados
        $vSql = "SELECT u.id, u.correo, u.nombre_completo, u.fecha_registro, 
                    r.nombre AS rol_nombre, 
                    es.nombre AS estado_nombre,
                    (SELECT COUNT(*) FROM subastas s WHERE s.id_creador = u.id) AS cantidad_subastas,
                    (SELECT COUNT(*) FROM pujas p WHERE p.id_usuario = u.id) AS cantidad_pujas
                FROM usuarios u
                INNER JOIN roles r ON u.id_rol = r.id
                INNER JOIN estados_usuario es ON u.id_estado = es.id
                WHERE u.id = $id";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];

            // 2. Cargar listas adicionales si el componente las requiere (opcional)
            $estadoU = new EstadoUsuarioModel();
            $rolM = new RolModel();
            $vResultado->lista_estados = $estadoU->all();
            $vResultado->lista_roles = $rolM->all();

            return $vResultado;
        }
        return null;
    }

    public function toggleEstado($id)
    {
        // Si es 1 lo pasa a 2, si es 2 lo pasa a 1
        $sql = "UPDATE usuarios SET id_estado = IF(id_estado = 1, 2, 1) WHERE id = $id";
        $this->enlace->executeSQL_DML($sql);

        return $this->get($id);
    }

    public function create($objeto)
    {
        $sql = "INSERT INTO usuarios (correo, contrasena, nombre_completo, id_rol, id_estado, fecha_registro)" .
            " VALUES (
            '$objeto->correo', 
            '$objeto->contrasena',
            '$objeto->nombre_completo', 
            $objeto->id_rol, 
            $objeto->id_estado, 
            '$objeto->fecha_registro'
        )";
        $idUsuario = $this->enlace->executeSQL_DML_last($sql);
        $resultado = $this->get($idUsuario);
        return $resultado;
    }
    public function update($objeto)
    {
        $sql = "UPDATE usuarios SET 
                nombre_completo = '$objeto->nombre_completo',
                correo = '$objeto->correo'
            WHERE id = $objeto->id";

        $this->enlace->executeSQL_DML($sql);

        return $this->get($objeto->id);
    }
    public function login($objeto)
    {
        $vSql = "SELECT * from User where email='$objeto->email'";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (is_object($vResultado[0])) {
            $user = $vResultado[0];
            if (password_verify($objeto->password, $user->password)) {
                $usuario = $this->get($user->id);
                if (!empty($usuario)) {
                    // Datos para el token JWT
                    $data = [
                        'id' => $usuario->id,
                        'email' => $usuario->email,
                        'rol' => $usuario->rol,
                        'iat' => time(),  // Hora de emisión
                        'exp' => time() + 3600 // Expiración en 1 hora
                    ];

                    // Generar el token JWT
                    $jwt_token = JWT::encode($data, config::get('SECRET_KEY'), 'HS256');

                    // Enviar el token como respuesta
                    return $jwt_token;
                }
            }
        } else {
            return false;
        }
    }
}
