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
        $vSql = "SELECT l.nombre AS Lego,(SELECT url FROM imagenes WHERE id_lego = l.id limit 1) AS imagen,
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
        $vSql = "SELECT l.nombre AS Lego,(SELECT url FROM imagenes WHERE id_lego = l.id limit 1) AS imagen,
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

    public function getDetalleSubasta()
    {
        $vSql = "
        SELECT 
            s.id AS subasta_id,
            l.nombre AS Lego,
            s.precio_base AS Precio,
            s.fecha_cierre,
            s.incremento_minimo,
            es.nombre AS estado_final,
            COUNT(p.id) AS cantidad_pujas,
            MIN(i.url) AS imagen

        FROM subastas s
        INNER JOIN lego l ON s.id_lego = l.id
        INNER JOIN estados_subasta es ON s.id_estado = es.id
        LEFT JOIN pujas p ON p.id_subasta = s.id
        LEFT JOIN imagenes i ON i.id_lego = l.id

        WHERE es.nombre = 'activa'
        GROUP BY s.id
    ";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /*Obtener historial de pujas de una subasta */
    public function getHistorialPujas($id)
    {
        $vSql = "SELECT 
            p.id AS puja_id,
            p.monto,
            p.fecha_hora,
            u.nombre_completo AS usuario_pujador
        FROM pujas p
        INNER JOIN usuarios u ON p.id_usuario = u.id
        WHERE p.id_subasta = $id
        ORDER BY p.monto DESC, p.fecha_hora DESC";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }
}
