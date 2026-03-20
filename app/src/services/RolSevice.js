import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'rol';
class RolService {
    /**
     * Obtener listado de todas los rol 
     * GET /categorialego
     */
    getAll() {
        return axios.get(BASE_URL);
    }
    /**
     * Obtener Rol por el id
     * GET /rol/getById/1
     */
    getById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }

    /**
     * Obtener rol de un Usuario específico
     * GET /rollego/getLegoUsuariorol/5
     */
    getRolUsuarioId(usuarioId) {
        return axios.get(`${BASE_URL}/getRolUsuarioId/${usuarioId}`);
    }

    
    getRolUsuario(usuarioId) {
        return axios.get(`${BASE_URL}/getRolUsuario/${usuarioId}`);
    }
}

export default new RolService();