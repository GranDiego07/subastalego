import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import UsuariosService from '@/services/UsuariosService';
import { Calendar, Shield, Activity, Gavel, LayoutList, LogOut, Mail, Pencil, X, Check, Loader2 } from 'lucide-react';

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
    const { user, clearUser, updateUser } = useUser();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit state
    const [editando, setEditando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(false);
    const [form, setForm] = useState({ nombre_completo: '', correo: '' });

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

    const handleEditClick = () => {
        const datos = perfil || {};
        setForm({
            nombre_completo: datos.nombre_completo || user?.nombre_completo || '',
            correo: datos.correo || user?.email || '',
        });
        setError(null);
        setExito(false);
        setEditando(true);
    };

    const handleCancelar = () => {
        setEditando(false);
        setError(null);
    };

    const handleGuardar = async () => {
        const nombre = form.nombre_completo.trim();
        const correo = form.correo.trim();

        if (!nombre) {
            setError('El nombre no puede estar vacío.');
            return;
        }
        if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            setError('Por favor ingresa un correo válido.');
            return;
        }

        setGuardando(true);
        setError(null);

        try {
            await UsuariosService.actualizarUsuario(user.id, {
                nombre_completo: nombre,
                correo,
            });

            // Update local perfil state
            setPerfil(prev => ({ ...prev, nombre_completo: nombre, correo }));

            // Update user context if hook supports it
            if (typeof updateUser === 'function') {
                updateUser({ nombre_completo: nombre, email: correo });
            }

            setExito(true);
            setEditando(false);
            setTimeout(() => setExito(false), 3000);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                'Ocurrió un error al guardar los cambios.';
            setError(msg);
        } finally {
            setGuardando(false);
        }
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
    const nombreMostrado = datos.nombre_completo || user?.nombre_completo || '—';
    const correoMostrado = datos.correo || user?.email || '—';

    return (
        <div className="min-h-screen pb-16 text-white">
            <div className="max-w-3xl mx-auto px-4 pt-10 space-y-6">

                {/* Toast de éxito */}
                {exito && (
                    <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
                        <Check className="w-4 h-4" />
                        Perfil actualizado correctamente.
                    </div>
                )}

                {/* Cabecera */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-black">
                        {nombreMostrado.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                        <h1 className="text-2xl font-bold">{nombreMostrado}</h1>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <Mail className="w-3.5 h-3.5" />
                            {correoMostrado}
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
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-blue-400">
                            <Shield className="w-4 h-4" />
                            <h2 className="text-sm font-bold uppercase tracking-wide">Información de cuenta</h2>
                        </div>
                        {!editando && (
                            <button
                                onClick={handleEditClick}
                                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-all"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                Editar
                            </button>
                        )}
                    </div>

                    {editando ? (
                        /* Formulario de edición */
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-zinc-500 text-xs uppercase font-bold block">Nombre completo</label>
                                <input
                                    type="text"
                                    value={form.nombre_completo}
                                    onChange={e => setForm(f => ({ ...f, nombre_completo: e.target.value }))}
                                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-2.5 text-sm transition-colors"
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-zinc-500 text-xs uppercase font-bold block">Correo electrónico</label>
                                <input
                                    type="email"
                                    value={form.correo}
                                    onChange={e => setForm(f => ({ ...f, correo: e.target.value }))}
                                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-2.5 text-sm transition-colors"
                                    placeholder="tu@correo.com"
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={handleGuardar}
                                    disabled={guardando}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                                >
                                    {guardando
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                                        : <><Check className="w-4 h-4" /> Guardar cambios</>
                                    }
                                </button>
                                <button
                                    onClick={handleCancelar}
                                    disabled={guardando}
                                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Vista normal */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-zinc-500 text-xs uppercase font-bold block mb-1">ID de usuario</span>
                                <span className="text-white font-mono">#{datos.id || user?.id}</span>
                            </div>
                            <div>
                                <span className="text-zinc-500 text-xs uppercase font-bold block mb-1">Correo</span>
                                <span className="text-white">{correoMostrado}</span>
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
                    )}
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