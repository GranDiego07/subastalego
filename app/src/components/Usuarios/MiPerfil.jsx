import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import UsuariosService from '@/services/UsuariosService';
import { Calendar, Shield, Activity, Gavel, LayoutList, LogOut, Mail } from 'lucide-react';

const rolLabel = { 1: 'comprador', 2: 'vendedor', 3: 'administrador' };
const rolColor = {
    1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    2: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    3: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

function formatFecha(f) {
    if (!f) return '—';
    return new Date(f).toLocaleDateString('es-CR', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

export default function MiPerfil() {
    const navigate = useNavigate();
    const { user, clearUser } = useUser();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        UsuariosService.getUsuarioDetalleId(user.id)
            .then(res => {
                const item = res.data?.data || res.data;
                setPerfil(item);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user?.id]);

    const handleLogout = () => {
        clearUser();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="text-center space-y-4">
                    <p className="text-zinc-400">Debes iniciar sesión para ver tu perfil.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl font-semibold transition-all"
                    >
                        Ir al Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    const datos = perfil || {};
    const rolId = user?.rol ?? datos.id_rol;
    const estadoActivo = datos.estado_nombre?.toLowerCase() === 'activo' || datos.id_estado === 1;

    return (
        <div className="min-h-screen pb-16 text-white">
            <div className="max-w-3xl mx-auto px-4 pt-10 space-y-6">

                {/* Cabecera */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-black">
                        {(datos.nombre_completo || user?.nombre_completo || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                        <h1 className="text-2xl font-bold">
                            {datos.nombre_completo || user?.nombre_completo || '—'}
                        </h1>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <Mail className="w-3.5 h-3.5" />
                            {datos.correo || user?.email || '—'}
                        </div>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${rolColor[rolId] ?? 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>
                                {rolLabel[rolId] ?? 'Sin rol'}
                            </span>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${estadoActivo
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                                }`}>
                                {datos.estado_nombre ?? (estadoActivo ? 'Activo' : 'Bloqueado')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info básica */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <Shield className="w-4 h-4" />
                        <h2 className="text-sm font-bold uppercase tracking-wide">Información de cuenta</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <span className="text-zinc-500 text-xs uppercase font-bold block mb-1">ID de usuario</span>
                            <span className="text-white font-mono">#{datos.id || user?.id}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 text-xs uppercase font-bold block mb-1">Correo</span>
                            <span className="text-white">{datos.correo || user?.email || '—'}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 text-xs uppercase font-bold block mb-1">Rol</span>
                            <span className="text-white capitalize">{rolLabel[rolId] ?? '—'}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 text-xs uppercase font-bold block mb-1">Fecha de registro</span>
                            <div className="flex items-center gap-1.5 text-zinc-300 text-sm">
                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                {formatFecha(datos.fecha_registro)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actividad */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-amber-400 mb-4">
                        <Activity className="w-4 h-4" />
                        <h2 className="text-sm font-bold uppercase tracking-wide">Historial de actividad</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <LayoutList className="w-5 h-5 text-zinc-400" />
                                <span className="text-sm text-zinc-300">Subastas</span>
                            </div>
                            <span className="text-2xl font-black text-white">{datos.cantidad_subastas ?? 0}</span>
                        </div>
                        <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Gavel className="w-5 h-5 text-zinc-400" />
                                <span className="text-sm text-zinc-300">Pujas</span>
                            </div>
                            <span className="text-2xl font-black text-white">{datos.cantidad_pujas ?? 0}</span>
                        </div>
                    </div>
                </div>

                {/* Cerrar sesión */}
                <div className="flex justify-end">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}