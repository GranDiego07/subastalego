import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'lego';

class LegoService {
    /**
     * Obtener listado de todos los Legos
     * GET /lego
     */
    getAll() {
        return axios.get(BASE_URL);
    }
    sinSubasta() {
        return axios.get(`${BASE_URL}/sinSubasta/`);
    }
    /**
     * Obtener un Lego específico por ID
     * GET /lego/5
     */
    getById(legoId) {
        return axios.get(`${BASE_URL}/${legoId}`);
    }


    /**
     * Obtener Legos con su detalle
     * Get/ lego/legosByDetalle/2
     */
    getByDetalle(vendedorId) {
        return axios.get(`${BASE_URL}/legosByDetalle/${vendedorId}`);
    }


    /**
     * Obtener Legos por Estado
     * GET /lego/legosByEstado/1
     */
    getByEstado(estadoId) {
        return axios.get(`${BASE_URL}/legosByEstado/${estadoId}`);
    }

    /**
     * Obtener cantidad de Legos por Categoría
     * GET /lego/getCountByGenre
     */
    getCountByGenre() {
        return axios.get(`${BASE_URL}/getCountByGenre`);
    }

    /**
     * Crear nuevo Lego
     * POST /lego
     */
    create(lego) {
        return axios.post(BASE_URL, JSON.stringify(lego));
    }

    /**
     * Actualizar un Lego
     * PUT /lego
     */
    update(lego) {
        return axios({
            method: 'put',
            url: BASE_URL, // sin /${id}
            data: lego,
        });
    }

    delete(legoId) {
        return axios.delete(`${BASE_URL}/${legoId}`); 
    }
}

export default new LegoService();