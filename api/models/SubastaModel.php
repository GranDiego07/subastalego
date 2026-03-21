<?php
class SubastaModel
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
        $vSql = "SELECT * FROM subastas;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Retornar el objeto
        return $vResultado;
    }
    /*Obtener */
    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM subastas where id=$id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
    public function getSubastasActivas()
    {
        $vSql = "SELECT s.id AS subasta_id, l.nombre AS Lego,(SELECT url FROM imagenes WHERE id_lego = l.id limit 1) AS imagen,
                s.fecha_cierre,s.precio_base as Precio, s.incremento_minimo,
                (SELECT COUNT(*) FROM pujas WHERE id_subasta = s.id) AS cantidad_pujas,
                es.nombre AS estado_final
                FROM subastas s
                INNER JOIN lego l ON s.id_lego = l.id
                INNER JOIN estados_subasta es ON s.id_estado = es.id
                where es.id=1
                ORDER BY s.fecha_cierre DESC;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }
    public function getSubastasCanFin()
    {
        $vSql = "SELECT s.id AS subasta_id, l.nombre AS Lego,(SELECT url FROM imagenes WHERE id_lego = l.id limit 1) AS imagen,
                s.fecha_cierre,s.precio_base as Precio, s.incremento_minimo,
                (SELECT COUNT(*) FROM pujas WHERE id_subasta = s.id) AS cantidad_pujas,
                es.nombre AS estado_final
                FROM subastas s
                INNER JOIN lego l ON s.id_lego = l.id
                INNER JOIN estados_subasta es ON s.id_estado = es.id
                where es.id=2 or es.id=3
                ORDER BY s.fecha_cierre DESC;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    public function getDetalleSubasta($id)
    {
        $vSql = "SELECT 
                s.id AS subasta_id,
                COALESCE(l.nombre, 'Lego no asignado') AS Lego,   
                s.precio_base AS Precio,
                s.fecha_cierre,
                s.incremento_minimo,
                es.nombre AS estado_final,
                COUNT(p.id) AS cantidad_pujas,
                (SELECT url FROM imagenes WHERE id_lego = l.id LIMIT 1) AS imagen
                FROM subastas s
                LEFT JOIN lego l ON s.id_lego = l.id                 
                INNER JOIN estados_subasta es ON s.id_estado = es.id
                LEFT JOIN pujas p ON p.id_subasta = s.id
                WHERE s.id = $id
                GROUP BY s.id, l.nombre, s.precio_base, s.fecha_cierre, s.incremento_minimo, es.nombre";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Debug: ver qué devuelve realmente
        error_log("getDetalleSubasta($id) resultado: " . print_r($vResultado, true));

        return $vResultado;
    }
    public function getConDetalle($id)
    {
        $vSql = "SELECT s.*, l.nombre AS lego_nombre
                    FROM subastas s
                    INNER JOIN lego l ON s.id_lego = l.id
                    WHERE s.id = $id";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado[0];
    }
    /*Obtener historial de pujas de una subasta */
    public function getHistorialPujas($id)
    {
        $vSql = "SELECT p.id AS puja_id,p.monto,p.fecha_hora,p.id_subasta,u.nombre_completo AS usuario_pujador
                    FROM pujas p, usuarios u
                    WHERE p.id_usuario = u.id and p.id_subasta = $id   
                    ORDER BY p.fecha_hora DESC;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    public function create($objeto)
    {
        $sql = "Insert into subastas (id_lego, id_creador, fecha_inicio, fecha_cierre, precio_base, incremento_minimo, id_estado)" .
            "Values($objeto->id_lego,$objeto->id_creador,'$objeto->fecha_inicio','$objeto->fecha_cierre','$objeto->precio_base',
        '$objeto->incremento_minimo',$objeto->id_estado)";

        $idSubasta = $this->enlace->executeSQL_DML_last($sql);
        $resultado = $this->get($idSubasta);
        return $resultado;
    }
    public function update($objeto)
    {
        $sql = "UPDATE subastas SET 
                precio_base = '$objeto->precio_base',
                incremento_minimo = '$objeto->incremento_minimo',
                fecha_inicio = '$objeto->fecha_inicio',
                fecha_cierre = '$objeto->fecha_cierre'
            WHERE id = $objeto->id";

        $this->enlace->executeSQL_DML($sql);

        return $this->get($objeto->id);
    }
    public function allConDetalle()
    {
        $vSql = "SELECT s.id, s.id_estado, l.nombre AS lego_nombre, s.fecha_inicio, s.fecha_cierre, s.precio_base, s.incremento_minimo,
            (SELECT COUNT(*) FROM pujas WHERE id_subasta = s.id) AS cantidad_pujas, es.nombre AS estado_nombre
            FROM subastas s
            INNER JOIN lego l ON s.id_lego = l.id
            INNER JOIN estados_subasta es ON s.id_estado = es.id
            ORDER BY s.fecha_cierre DESC;";
        return $this->enlace->ExecuteSQL($vSql);
    }

    public function publicar($id)
    {
        $vSql = "SELECT id_estado, fecha_inicio FROM subastas WHERE id = $id";
        $resultado = $this->enlace->ExecuteSQL($vSql);

        if (empty($resultado)) {
            return (object)["success" => false, "message" => "Subasta no encontrada"];
        }

        $subasta     = $resultado[0];
        $idEstado    = (int)$subasta->id_estado;
        $fechaInicio = new DateTime($subasta->fecha_inicio);
        $ahora       = new DateTime();

        if ($idEstado === 1) {
            return (object)["success" => false, "message" => "La subasta ya está activa"];
        }

        if ($idEstado === 3) {
            return (object)["success" => false, "message" => "No se puede publicar una subasta cancelada"];
        }

        if ($fechaInicio <= $ahora) {
            return (object)["success" => false, "message" => "La fecha de inicio debe ser mayor a la fecha actual"];
        }

        $sql = "UPDATE subastas SET id_estado = 1 WHERE id = $id";
        $this->enlace->executeSQL_DML($sql);

        return (object)["success" => true, "message" => "Subasta publicada correctamente"];
    }

    public function cancelar($id)
    {
        $vSql = "SELECT s.id_estado, s.fecha_inicio,
                (SELECT COUNT(*) FROM pujas WHERE id_subasta = s.id) AS cantidad_pujas
                    FROM subastas s WHERE s.id = $id";
        $resultado = $this->enlace->ExecuteSQL($vSql);

        if (empty($resultado)) {
            return (object)["success" => false, "message" => "Subasta no encontrada"];
        }

        $subasta     = $resultado[0];
        $idEstado    = (int)$subasta->id_estado;
        $cantPujas   = (int)$subasta->cantidad_pujas;
        $fechaInicio = new DateTime($subasta->fecha_inicio);
        $ahora       = new DateTime();

        if ($idEstado === 3) {
            return (object)["success" => false, "message" => "La subasta ya está cancelada"];
        }

        if ($fechaInicio <= $ahora && $cantPujas > 0) {
            return (object)["success" => false, "message" => "No se puede cancelar: la subasta ya inició y tiene pujas"];
        }

        $sql = "UPDATE subastas SET id_estado = 3 WHERE id = $id";
        $this->enlace->executeSQL_DML($sql);

        return (object)["success" => true, "message" => "Subasta cancelada correctamente"];
    }
}
