import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'categorialego';

class CategoriaLegoService {
    /**
     * Obtener listado de todas las categorías de Lego
     * GET /categorialego
     */
    getAll() {
        return axios.get(BASE_URL);
    }

    /**
     * Obtener categorías de un Lego específico
     * GET /categorialego/getLegoUsuarioCategoria/5
     */
    getByUsuario(usuarioId) {
        return axios.get(`${BASE_URL}/getLegoUsuarioCategoria/${usuarioId}`);
    }
}

export default new CategoriaLegoService();