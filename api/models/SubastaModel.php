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
    public function getDetalleSubasta($id)
    {
        $vSql = "SELECT 
        s.id AS subasta_id,
        l.id AS lego_id,
        l.nombre AS nombre_lego,
        (SELECT url FROM imagenes WHERE id_lego = l.id LIMIT 1) AS imagen,
        GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ', ') AS categorias,
        cl.nombre AS condicion,
        
        s.fecha_inicio,
        s.fecha_cierre,
        s.precio_base,
        s.incremento_minimo,
        es.nombre AS estado_actual,
        (SELECT COUNT(*) FROM pujas WHERE id_subasta = s.id) AS cantidad_pujas,
        
        l.descripcion,
        u.nombre AS usuario_propietario,
        (SELECT MAX(monto) FROM pujas WHERE id_subasta = s.id) AS puja_maxima,
        (SELECT u2.nombre FROM pujas p 
        INNER JOIN usuarios u2 ON p.id_usuario = u2.id 
        WHERE p.id_subasta = s.id 
        ORDER BY p.monto DESC LIMIT 1) AS usuario_puja_maxima
        
        FROM subastas s
        INNER JOIN lego l ON s.id_lego = l.id
        INNER JOIN categorias_lego cl ON l.id_condicion = cl.id
        LEFT JOIN lego_categorias lc ON l.id = lc.id_lego
        LEFT JOIN categorias c ON lc.id_categoria = c.id
        INNER JOIN estados_subasta es ON s.id_estado = es.id
        INNER JOIN usuarios u ON l.id_usuario = u.id
        WHERE s.id = $id
        GROUP BY s.id";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado[0] ?? null;
    }
}
