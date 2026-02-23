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

    /**
     * Obtener un Lego específico por ID
     * GET /lego/5
     */
    getById(legoId) {
        return axios.get(`${BASE_URL}/${legoId}`);
    }

    /**
     * Obtener Legos por Vendedor
     * GET /lego/legosByVendedor/2
     */
    getByVendedor(vendedorId) {
        return axios.get(`${BASE_URL}/legosByVendedor/${vendedorId}`);
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
    create(legoData) {
        return axios.post(BASE_URL, legoData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Actualizar un Lego
     * PUT /lego
     */
    update(legoData) {
        return axios.put(BASE_URL, legoData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Eliminar un Lego
     * DELETE /lego/5
     */
    delete(legoId) {
        return axios.delete(`${BASE_URL}/${legoId}`);
    }
}

export default new LegoService();