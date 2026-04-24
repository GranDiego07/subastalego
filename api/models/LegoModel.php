<?php
class LegoModel
{
    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar peliculas
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        $imagenM = new ImageModel();

        // Consulta SQL con JOINs para traer los nombres
        $vSQL = "SELECT l.*,c.nombre AS categoria_nombre,cond.nombre AS condicion_nombre,e.nombre AS estado_nombre,
                        i.url AS imagen_url, s.precio_base as precio
                    FROM lego l
                    inner join subastas s on s.id_lego = l.id
                    inner JOIN categorias c ON l.id_categoria = c.id
                    inner JOIN condiciones_lego cond ON l.id_condicion = cond.id
                    inner jOIN estados_lego e ON l.id_estado = e.id
                    inner jOIN imagenes i ON i.id_lego = l.id AND i.es_principal = 1
                    ORDER BY l.id DESC;";
        // Ejecutar consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $vResultado[$i]->imagen = $imagenM->getImagenPrincipal($vResultado[$i]->id);
            }
        }

        return $vResultado;
    }

    public function sinSubasta($id, $rol)
    {
        $imagenM = new ImageModel();

        // Si es administrador (rol 3) trae todos, si no filtra por vendedor
        if (intval($rol) === 3) {
            $where = "";
        } else {
            $where = "WHERE l.id_vendedor = $id";
        }

        $vSQL = "SELECT l.*,c.nombre AS categoria_nombre,cond.nombre AS condicion_nombre,e.nombre AS estado_nombre,
                        i.url AS imagen_url
                    FROM lego l
                    inner JOIN categorias c ON l.id_categoria = c.id
                    inner JOIN condiciones_lego cond ON l.id_condicion = cond.id
                    inner jOIN estados_lego e ON l.id_estado = e.id
                    inner jOIN imagenes i ON i.id_lego = l.id AND i.es_principal = 1
                    $where
                    ORDER BY l.id DESC;";

        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $vResultado[$i]->imagen = $imagenM->getImagenPrincipal($vResultado[$i]->id);
            }
        }

        return $vResultado;
    }
    /**
     * Obtener una pelicula
     * @param $id de la pelicula
     * @return $vresultado - Objeto pelicula
     */
    //
    public function get($id)
    {
        $categoriaM = new CategoriaLegoModel();
        $condicionM = new CondicionLegoModel();
        $usuarioM = new UsuariosModel();
        $imagenM = new ImageModel();
        $vSql = "SELECT * FROM lego
                    where id=$id;";

        //Ejecutar la consulta sql
        $vResultado = $this->enlace->executeSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
            //Imagen
            $vResultado->imagen = $imagenM->getImageMovie($vResultado->id);
            //Categoria
            $vResultado->categoria = $categoriaM->getLegoCategoria($vResultado->id);
            //Condicion
            $vResultado->condicion = $condicionM->getLegoCondicion($vResultado->id);
            //Actores - actors
            $vResultado->usuario = $usuarioM->getUsuariosLego($vResultado->id);
        }

        //Retornar la respuesta
        return $vResultado;
    }

    public function legoByEstado($idActor)
    {
        $imagenM = new ImageModel();
        //Consulta SQL
        $vSQL = "SELECT l.* 
                FROM lego l, estados_lego el
                where l.id_estado=$idActor";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);
        //Retornar la respuesta

        return $vResultado;
    }

    public function legobyVendedor($idUsuario)
    {
        $imagenM = new ImageModel();
        //Consulta SQL
        $vSQL = "SELECT l.*, u.nombre_completo
                    FROM lego l, usuarios u
                    where l.id_vendedor=$idUsuario
                    order by l.nombre desc";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        //Incluir imagenes
        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $vResultado[$i]->imagen = $imagenM->getImageMovie(($vResultado[$i]->id));
            }
        }
        //Retornar la respuesta

        return $vResultado;
    }
    public function legoByDetalle($idActor)
    {
        $vSQL = "SELECT l.id, l.nombre, l.descripcion, cl.nombre AS condicion, c.nombre AS categoria, 
        v.nombre_completo AS vendedor, e.nombre AS estado,
        (SELECT GROUP_CONCAT(url) FROM imagenes WHERE id_lego = l.id) AS imagenes_urls,
        (SELECT GROUP_CONCAT(
            CONCAT(u.nombre_completo, '|', p.monto, '|', p.fecha_hora)
            ORDER BY p.fecha_hora DESC
            SEPARATOR ';;'
        ) FROM pujas p
        LEFT JOIN usuarios u ON p.id_usuario = u.id
        WHERE p.id_subasta = l.id
        ) AS historial_pujas
        FROM lego l
        LEFT JOIN categorias c ON l.id_categoria = c.id
        LEFT JOIN usuarios v ON l.id_vendedor = v.id
        LEFT JOIN estados_lego e ON l.id_estado = e.id
        LEFT JOIN condiciones_lego cl ON l.id_condicion = cl.id
        WHERE l.id = $idActor;";

        $vResultado = $this->enlace->ExecuteSQL($vSQL);
        return $vResultado;
    }
    /**
     * Obtener la cantidad de peliculas por genero
     * @param 
     * @return $vresultado - Cantidad de peliculas por genero
     */
    //
    public function getCountByGenre()
    {

        $vResultado = null;
        //Consulta sql
        $vSql = "SELECT count(l.id_categoria) as 'Cantidad', c.nombre as 'Categoria'
			FROM lego l, categorias c
			where c.id=l.id_categoria 
			group by c.id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

    public function LegosByShop($LegosByShop)
    {
        $imagenM = new ImageModel();

        // Consulta SQL
        $vSQL = "SELECT l.*, 
                    c.nombre AS condicion, 
                    e.nombre AS estado,
                    cat.nombre AS categoria
                    FROM lego l
                    INNER JOIN condiciones_lego c ON l.id_condicion = c.id
                    INNER JOIN estados_lego e ON l.id_estado = e.id
                    INNER JOIN categorias cat ON l.id_categoria = cat.id
                    WHERE l.id_vendedor = $LegosByShop
                    ORDER BY l.fecha_registro DESC";

        // Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        // Incluir imagen principal de cada lego
        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $vResultado[$i]->imagen = $imagenM->getImagenPrincipal($vResultado[$i]->id);
            }
        }

        return $vResultado;
    }

    /**
     * Crear pelicula
     * @param $objeto pelicula a insertar
     * @return $this->get($idMovie) - Objeto pelicula
     */
    //
    public function create($objeto)
    {
        $sql = "INSERT INTO lego (nombre, descripcion, id_condicion, id_estado, id_vendedor, id_categoria)" .
            " VALUES ('$objeto->nombre', '$objeto->descripcion',
                $objeto->id_condicion, $objeto->id_estado, 
                $objeto->id_vendedor, $objeto->id_categoria)";

        $idLego = $this->enlace->executeSQL_DML_last($sql);

        return $this->get($idLego);
    }
    /**
     * Actualizar pelicula
     * @param $objeto pelicula a actualizar
     * @return $this->get($idMovie) - Objeto pelicula
     */
    //
    public function update($objeto)
    {
        $sql = "UPDATE lego SET 
                nombre = '$objeto->nombre',
                descripcion = '$objeto->descripcion',
                id_condicion = $objeto->id_condicion,
                id_estado = $objeto->id_estado,
                id_categoria = $objeto->id_categoria
            WHERE id = $objeto->id";

        $this->enlace->executeSQL_DML($sql);


        return (object)["success" => true, "message" => "Lego actualizado correctamente", "id" => $objeto->id];
    }
    public function delete($id)
    {
        $vSql = "SELECT id_estado FROM lego WHERE id = $id";
        $resultado = $this->enlace->ExecuteSQL($vSql);

        if (empty($resultado)) {
            return (object)["success" => false, "message" => "Lego no encontrado"];
        }

        $idEstado = (int)$resultado[0]->id_estado;

        if (!in_array($idEstado, [3, 4, 5])) {
            return (object)["success" => false, "message" => "No se puede eliminar: el lego debe estar en estado Vendido, Retirado o Inactivo"];
        }

        try {
            $sql = "DELETE FROM lego WHERE id = $id";
            $this->enlace->executeSQL_DML($sql);
            return (object)["success" => true, "message" => "Lego eliminado correctamente"];
        } catch (Exception $e) {
            return (object)["success" => false, "message" => $e->getMessage()];
        }
    }
}