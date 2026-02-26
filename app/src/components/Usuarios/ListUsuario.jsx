import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuariosService from "../../services/UsuariosService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";

export function ListUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            try {
                // Asumo que el servicio correcto es getAll o similar, 
                // ya que getByVendedor era específico de Legos.
                const response = await UsuariosService.getAll(); 
                const data = response.data?.data || response.data || [];
                setUsuarios(data);
            } catch (err) {
                console.error("Error al cargar Usuarios:", err);
                setError("No se pudo conectar con el servicio de Usuarios.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, []);

    if (loading) return <LoadingGrid type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar" message={error} />;
    if (usuarios.length === 0) return <EmptyState message="No hay usuarios registrados." />;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Listado de Usuarios</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {usuarios.map((usuario) => (
                    <div 
                        key={usuario.id} 
                        onClick={() => navigate(`/usuarios/detail/${usuario.id}`)}
                        className="bg-white border p-5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01]"
                    >
                        {/* 1. Nombre Completo */}
                        <div className="mb-4">
                            <label className="text-xs text-gray-400 uppercase font-bold">Nombre Completo</label>
                            <p className="text-lg font-semibold text-gray-900">
                                {usuario.nombre_completo || `${usuario.nombre} ${usuario.apellido}`}
                            </p>
                        </div>

                        <div className="flex justify-between items-end">
                            {/* 2. Rol */}
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold block">Rol</label>
                                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium capitalize">
                                    {usuario.rol || 'Sin rol'}
                                </span>
                            </div>

                            {/* 3. Estado */}
                            <div className="text-right">
                                <label className="text-xs text-gray-400 uppercase font-bold block">Estado</label>
                                <span className={`inline-block mt-1 font-bold text-sm ${
                                    usuario.estado === 'activo' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {usuario.estado ? usuario.estado.toUpperCase() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}