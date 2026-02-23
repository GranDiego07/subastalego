import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'condicionlego';

class CondicionLegoService {
    /**
     * Obtener listado de todas las condiciones de Lego
     * GET /condicionlego
     */
    getAll() {
        return axios.get(BASE_URL);
    }

    /**
     * Obtener condiciones de un usuario específico
     * GET /condicionlego/getLegoUsuarioCondicion/5
     */
    getByUsuario(usuarioId) {
        return axios.get(`${BASE_URL}/getLegoUsuarioCondicion/${usuarioId}`);
    }
}

export default new CondicionLegoService();