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
        $vSql = "SELECT s.*,l.nombre AS lego_nombre,COUNT(p.id) AS total_pujas
                    FROM subastas s
                    JOIN lego l ON s.id_lego = l.id
                    LEFT JOIN pujas p ON p.id_subasta = s.id
                    GROUP BY s.id, s.id_lego, s.precio_base, s.id_estado, l.nombre;;";

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
        $vSql = "SELECT s.id AS subasta_id, l.nombre AS Lego,
                (SELECT url FROM imagenes WHERE id_lego = l.id LIMIT 1) AS imagen,
                s.fecha_cierre,
                (SELECT MAX(monto) FROM pujas WHERE id_subasta = s.id) AS UltimaPuja,
                s.incremento_minimo,
                (SELECT COUNT(*) FROM pujas WHERE id_subasta = s.id) AS cantidad_pujas,
                es.nombre AS estado_final
                    FROM subastas s
                    INNER JOIN lego l ON s.id_lego = l.id
                    INNER JOIN estados_subasta es ON s.id_estado = es.id
                    WHERE es.id = 1
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
                GROUP BY s.id, l.nombre, s.precio_base, s.fecha_cierre, s.incremento_minimo, es.nombre
                order by l.id desc";

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
                    WHERE s.id = $id
                    order by l.id desc";

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
        $sql = "INSERT INTO subastas (id_lego, id_creador, fecha_inicio, fecha_cierre, precio_base, incremento_minimo, id_estado) " .
            "VALUES (
            " . intval($objeto->id_lego) . ",
            " . intval($objeto->id_creador) . ",
            '" . $objeto->fecha_inicio . "',
            '" . $objeto->fecha_cierre . "',
            " . floatval($objeto->precio_base) . ",
            " . floatval($objeto->incremento_minimo) . ",
            " . intval($objeto->id_estado ?? 4) . ")";

        $idSubasta = $this->enlace->executeSQL_DML_last($sql);
        return $this->get($idSubasta);
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
    public function allConDetalle($id, $rol)
    {
        $this->enlace->executeSQL_DML("UPDATE subastas 
        SET id_estado = 1 
        WHERE id_estado = 4 
        AND fecha_inicio <= NOW()");

        // Cerrar activas vencidas CON pujas → Finalizada
        $this->enlace->executeSQL_DML("UPDATE subastas 
        SET id_estado = (SELECT id FROM estados_subasta WHERE nombre = 'Finalizada' LIMIT 1)
        WHERE id_estado = 1 
        AND fecha_cierre <= NOW()
        AND (SELECT COUNT(*) FROM pujas WHERE id_subasta = subastas.id) > 0");

        // Cerrar activas vencidas SIN pujas → Borrador
        $this->enlace->executeSQL_DML("UPDATE subastas 
        SET id_estado = 5
        WHERE id_estado = 1 
        AND fecha_cierre <= NOW()
        AND (SELECT COUNT(*) FROM pujas WHERE id_subasta = subastas.id) = 0");

        // Admin (rol 3) trae todas, vendedor solo las suyas
        $where = (intval($rol) === 3) ? "" : "WHERE s.id_creador = $id";

        $vSql = "SELECT s.id, s.id_estado, l.nombre AS lego_nombre, s.fecha_inicio, s.fecha_cierre, s.precio_base, s.incremento_minimo,
        (SELECT COUNT(*) FROM pujas WHERE id_subasta = s.id) AS cantidad_pujas, es.nombre AS estado_nombre
        FROM subastas s
        INNER JOIN lego l ON s.id_lego = l.id
        INNER JOIN estados_subasta es ON s.id_estado = es.id
        $where
        ORDER BY l.id DESC;";
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

        if ($idEstado === 4) {
            return (object)["success" => false, "message" => "La subasta ya está finalizada"];
        }

        if ($fechaInicio <= $ahora && $cantPujas > 0) {
            return (object)["success" => false, "message" => "No se puede cancelar: la subasta ya inició y tiene pujas"];
        }

        $sql = "UPDATE subastas SET id_estado = 3 WHERE id = $id";
        $this->enlace->executeSQL_DML($sql);

        return (object)["success" => true, "message" => "Subasta cancelada correctamente"];
    }
    public function reactivar($id)
    {
        $resultado = $this->enlace->ExecuteSQL(
            "SELECT id_estado FROM subastas WHERE id = $id"
        );

        if (empty($resultado)) {
            return (object)["success" => false, "message" => "Subasta no encontrada"];
        }

        if ((int)$resultado[0]->id_estado !== 3) {
            return (object)["success" => false, "message" => "Solo se pueden reactivar subastas canceladas"];
        }

        $this->enlace->executeSQL_DML(
            "UPDATE subastas SET id_estado = 4 WHERE id = $id"
        );

        return (object)["success" => true, "message" => "Subasta reactivada como borrador"];
    }
    public function getParaInterfaz($id)
    {
        // 1. Verificar si la subasta debe cerrarse por fecha antes de consultar
        $idLimpiado = intval($id);
        if ($idLimpiado <= 0) return null;

        // 1. Verificar cierre por fecha
        $this->verificarCierre($idLimpiado);

        $vSql = "SELECT
                    s.id,
                    s.id_creador,
                    s.fecha_inicio,
                    s.fecha_cierre,
                    s.precio_base,
                    s.incremento_minimo,
                    es.id   AS id_estado,
                    es.nombre AS estado,
                    l.nombre  AS lego_nombre,
                    l.descripcion AS lego_descripcion,
                    u.nombre_completo AS vendedor_nombre,
                    GROUP_CONCAT(i.url ORDER BY i.id SEPARATOR '||') AS imagenes
                FROM subastas s
                INNER JOIN estados_subasta es ON es.id = s.id_estado
                INNER JOIN lego l             ON l.id  = s.id_lego
                INNER JOIN usuarios u         ON u.id  = s.id_creador
                LEFT  JOIN imagenes i         ON i.id_lego = l.id
                WHERE s.id = $idLimpiado
                GROUP BY s.id";

        $resultado = $this->enlace->ExecuteSQL($vSql);
        if (empty($resultado)) return null;

        $subasta = $resultado[0];
        // Convertir imágenes concatenadas a array
        $subasta->imagenes = $subasta->imagenes
            ? explode('||', $subasta->imagenes)
            : [];

        return $subasta;
    }

    /**
     * Historial de pujas ordenado por monto DESC (el líder primero).
     */
    public function getHistorialPujasOrdenado($id)
    {
        $vSql = "SELECT
                    p.id AS puja_id,
                    p.monto,
                    p.fecha_hora,
                    p.id_usuario,
                    u.nombre_completo AS usuario_pujador
                FROM pujas p
                INNER JOIN usuarios u ON u.id = p.id_usuario
                WHERE p.id_subasta = $id
                ORDER BY p.monto DESC, p.fecha_hora DESC";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /**
     * Puja más alta de una subasta.
     */
    public function getPujaMaxima($id)
    {
        $vSql = "SELECT p.monto, p.id_usuario, u.nombre_completo AS usuario_nombre
                FROM pujas p
                INNER JOIN usuarios u ON u.id = p.id_usuario
                WHERE p.id_subasta = $id
                ORDER BY p.monto DESC
                LIMIT 1";

        $resultado = $this->enlace->ExecuteSQL($vSql);
        return empty($resultado) ? null : $resultado[0];
    }

    /**
     * Registra una nueva puja.
     */
    public function registrarPuja($id_subasta, $id_usuario, $monto)
    {
        $vSql = "INSERT INTO pujas (id_subasta, id_usuario, monto, fecha_hora)
                    VALUES ($id_subasta, $id_usuario, $monto, NOW())";
        $this->enlace->executeSQL_DML($vSql);
        return true;
    }

    /**
     * Cierra la subasta si ya venció su fecha_cierre y aún está Activa (id_estado = 1).
     * Llama a este método en getParaInterfaz y en pujar para cumplir el requerimiento
     * de cierre por consulta/puja (sin cron jobs).
     */
    // DESPUÉS
    public function verificarCierre($id)
    {
        // Cierra con pujas → Finalizada
        $vSql = "UPDATE subastas
            SET id_estado = (SELECT id FROM estados_subasta WHERE nombre = 'Finalizada' LIMIT 1)
            WHERE id = $id
            AND fecha_cierre <= NOW()
            AND id_estado = 1
            AND (SELECT COUNT(*) FROM pujas WHERE id_subasta = $id) > 0";

        $afectadas = $this->enlace->executeSQL_DML($vSql); // ← ya retorna affected_rows

        // ← NUEVO: Si se cerró con pujas, crear el pago del ganador
        if ($afectadas > 0) {
            $ganadorSql = "SELECT p.id_usuario, p.monto
                                FROM pujas p
                                WHERE p.id_subasta = $id
                                ORDER BY p.monto DESC, p.fecha_hora ASC
                                LIMIT 1";
            $resultado = $this->enlace->ExecuteSQL($ganadorSql);

            if (!empty($resultado)) {
                $ganador = $resultado[0];
                $pagoM = new PagoModel();
                if (!$pagoM->existePagoParaSubasta($id)) {
                    $pagoM->crear((object)[
                        "id_subasta" => $id,
                        "id_usuario" => $ganador->id_usuario,
                        "monto"      => $ganador->monto
                    ]);
                }
            }
        }

        // Sin pujas → estado 5
        $vSql2 = "UPDATE subastas
            SET id_estado = 5
            WHERE id = $id
            AND fecha_cierre <= NOW()
            AND id_estado = 1
            AND (SELECT COUNT(*) FROM pujas WHERE id_subasta = $id) = 0";
        $this->enlace->executeSQL_DML($vSql2);
    }
    public function cerrar($id_subasta)
    {
        try {
            // 1. Buscamos al ganador real (la puja más alta)
            $vSql = "SELECT 
                    s.id, 
                    p.id_usuario as ganador_id, 
                    u.nombre_completo as ganador_nombre, 
                    p.monto as monto_final
                FROM subastas s
                JOIN pujas p ON s.id = p.id_subasta
                JOIN usuarios u ON p.id_usuario = u.id
                WHERE s.id = " . intval($id_subasta) . "
                ORDER BY p.monto DESC, p.fecha_hora ASC 
                LIMIT 1";

            $resultado = $this->enlace->executeSQL($vSql);

            // 2. Actualizamos el estado de la subasta (ID 2 = Cerrada)
            $idEstadoCerrada = 2;
            $updateSql = "UPDATE subastas SET id_estado = $idEstadoCerrada WHERE id = " . intval($id_subasta);
            $this->enlace->executeSQL_DML($updateSql);

            // 3. Si hubo pujas, registramos la compra en la tabla pagos
            $ganadorInfo = null;
            if (is_array($resultado) && !empty($resultado)) {
                $ganador = $resultado[0];
                $ganadorInfo = $ganador; // Guardamos para el retorno

                $pagoM = new PagoModel();

                // Evitamos duplicados antes de insertar
                if (!$pagoM->existePagoParaSubasta($id_subasta)) {
                    $pagoM->crear((object)[
                        "id_subasta"     => $id_subasta,
                        "id_usuario"     => $ganador->ganador_id,
                        "nombre_usuario" => $ganador->ganador_nombre,
                        "monto"          => $ganador->monto_final
                    ]);
                }
            }

            // 4. Retornamos éxito con los datos del ganador para el Frontend
            return [
                "success" => true,
                "message" => "Subasta finalizada con éxito",
                "ganador_nombre" => $ganadorInfo ? $ganadorInfo->ganador_nombre : null,
                "monto_final" => $ganadorInfo ? $ganadorInfo->monto_final : null
            ];
        } catch (Exception $e) {
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
}
