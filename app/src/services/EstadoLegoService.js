import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'estadolego';

class EstadoLegoService {
    /**
     * Obtener listado de todos los estados de Lego
     * GET /estadolego
     */
    getAll() {
        return axios.get(BASE_URL);
    }

    /**
     * Obtener Legos por estado específico
     * GET /estadolego/getLegoEstado/1
     */
    getByEstado(estadoId) {
        return axios.get(`${BASE_URL}/getLegoEstado/${estadoId}`);
    }
}

export default new EstadoLegoService();