import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import PujasService from '@/services/PujasService';
import { Gavel, ChevronLeft, Trophy, Clock, TrendingUp } from 'lucide-react';

function formatMonto(n) {
    return Number(n || 0).toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
}

function formatFecha(f) {
    if (!f) return '—';
    return new Date(f).toLocaleString('es-CR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

export default function MisPujas() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [pujas, setPujas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.id) return;
        PujasService.getPujasPorUsuario(user.id)
            .then(res => {
                const data = res.data?.data ?? res.data ?? [];
                setPujas(Array.isArray(data) ? data : []);
            })
            .catch(err => setError(err.response?.data?.error || 'Error al cargar el historial'))
            .finally(() => setLoading(false));
    }, [user?.id]);

    const totalPujado = pujas.reduce((acc, p) => acc + Number(p.monto || 0), 0);
    const montoMaximo = pujas.length > 0 ? Math.max(...pujas.map(p => Number(p.monto || 0))) : 0;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p className="text-zinc-400">Debes iniciar sesión.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-16 text-white">
            <div className="max-w-3xl mx-auto px-4 pt-10 space-y-6">

                {/* Encabezado */}
                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Gavel className="w-6 h-6 text-blue-400" /> Mis Pujas
                    </h1>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
                        <Gavel className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-2xl font-black">{pujas.length}</p>
                        <p className="text-zinc-500 text-xs mt-1">Pujas realizadas</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
                        <TrendingUp className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                        <p className="text-lg font-black text-amber-400">{formatMonto(montoMaximo)}</p>
                        <p className="text-zinc-500 text-xs mt-1">Mayor puja</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
                        <Trophy className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-lg font-black text-green-400">{formatMonto(totalPujado)}</p>
                        <p className="text-zinc-500 text-xs mt-1">Total ofertado</p>
                    </div>
                </div>

                {/* Lista */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm">
                        {error}
                    </div>
                ) : pujas.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                        <Gavel className="w-14 h-14 text-zinc-700 mx-auto" />
                        <p className="text-zinc-400 font-medium">Todavía no has realizado ninguna puja.</p>
                        <Link
                            to="/subasta/activas"
                            className="inline-block mt-2 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                        >
                            Ver subastas activas
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pujas.map((p, i) => (
                            <div
                                key={p.puja_id ?? i}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                            >
                                <div className="space-y-1">
                                    <p className="font-semibold text-white">
                                        {p.lego_nombre || p.NombreLego || `Subasta #${p.id_subasta}`}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatFecha(p.fecha_hora)}
                                        </span>
                                        {p.estado_subasta && (
                                            <span className={`px-2 py-0.5 rounded-full border font-semibold ${p.estado_subasta?.toLowerCase() === 'activa'
                                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                : 'bg-zinc-700 text-zinc-400 border-zinc-600'
                                                }`}>
                                                {p.estado_subasta}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-blue-400 font-black text-lg">{formatMonto(p.monto)}</p>
                                    {p.id_subasta && (
                                        <Link
                                            to={`/subasta/detalle/${p.id_subasta}`}
                                            className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-xl transition-all"
                                        >
                                            Ver subasta
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}