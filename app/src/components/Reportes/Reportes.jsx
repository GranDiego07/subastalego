import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import SubastaService from '@/services/SubastaService';
import UsuariosService from '@/services/UsuariosService';
import PujasService from '@/services/PujasService';
import {
    BarChart2, Users, Gavel, Trophy,
    TrendingUp, Award, ShieldAlert, ArrowLeft
} from 'lucide-react';

function formatMonto(n) {
    return Number(n || 0).toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
}

function StatCard({ icon, label, value, sub, color = 'blue' }) {
    const colors = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        red: 'text-red-400 bg-red-500/10 border-red-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    };
    return (
        <div className={`rounded-2xl border p-5 ${colors[color]}`}>
            <div className="flex items-center gap-2 mb-3 opacity-80">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-3xl font-black">{value}</p>
            {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
        </div>
    );
}

export default function Reportes() {
    const navigate = useNavigate();
    const { authorize } = useUser();

    const [subastas, setSubastas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [pujas, setPujas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authorize(['administrador'])) {
            navigate('/');
            return;
        }

        Promise.all([
            SubastaService.getAll().catch(() => ({ data: [] })),
            UsuariosService.getUsuarioDetalle().catch(() => ({ data: [] })),
            PujasService.getPujasDetalle().catch(() => ({ data: [] })),
        ]).then(([sRes, uRes, pRes]) => {
            const s = sRes.data?.data ?? sRes.data ?? [];
            const u = uRes.data?.data ?? uRes.data ?? [];
            const p = pRes.data?.data ?? pRes.data ?? [];
            setSubastas(Array.isArray(s) ? s : []);
            setUsuarios(Array.isArray(u) ? u : []);
            setPujas(Array.isArray(p) ? p : []);
        }).finally(() => setLoading(false));
    }, []);

    // Estadísticas calculadas
    const totalSubastas = subastas.length;
    const activas = subastas.filter(s => s.id_estado === 1 || s.estado === 'activa' || s.estado_nombre === 'activa').length;
    const finalizadas = subastas.filter(s => s.id_estado === 2 || s.estado_nombre === 'finalizada' || s.nombre === 'finalizada').length;
    const canceladas = subastas.filter(s => s.id_estado === 3 || s.estado_nombre === 'cancelada').length;

    const totalUsuarios = usuarios.length;
    const compradores = usuarios.filter(u => u.rol_nombre?.toLowerCase() === 'comprador').length;
    const vendedores = usuarios.filter(u => u.rol_nombre?.toLowerCase() === 'vendedor').length;
    const bloqueados = usuarios.filter(u => u.estado_nombre?.toLowerCase() === 'bloqueado' || u.estado_nombre?.toLowerCase() === 'inactivo').length;

    const totalPujas = pujas.length;
    const montoTotal = pujas.reduce((acc, p) => acc + Number(p.monto || 0), 0);
    const montoPromedio = totalPujas > 0 ? montoTotal / totalPujas : 0;

    // Ranking de compradores por cantidad de pujas
    const rankingPujadores = Object.values(
        pujas.reduce((acc, p) => {
            const nombre = p.NombreUsuario || p.usuario_pujador || 'Desconocido';
            if (!acc[nombre]) acc[nombre] = { nombre, pujas: 0, monto: 0 };
            acc[nombre].pujas += 1;
            acc[nombre].monto += Number(p.monto || 0);
            return acc;
        }, {})
    ).sort((a, b) => b.pujas - a.pujas).slice(0, 5);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-16 text-white">
            <div className="max-w-5xl mx-auto px-4 pt-10 space-y-8">

                {/* Encabezado */}
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <BarChart2 className="w-6 h-6 text-blue-400" /> Reportes del Sistema
                        </h1>
                        <p className="text-zinc-500 text-sm mt-0.5">Resumen general de actividad de la plataforma</p>
                    </div>
                </div>

                {/* Subastas */}
                <section>
                    <h2 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-3 flex items-center gap-2">
                        <Gavel className="w-4 h-4" /> Subastas
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatCard icon={<Gavel className="w-4 h-4" />} label="Total" value={totalSubastas} color="blue" />
                        <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Activas" value={activas} color="green" />
                        <StatCard icon={<Award className="w-4 h-4" />} label="Finalizadas" value={finalizadas} color="amber" />
                        <StatCard icon={<ShieldAlert className="w-4 h-4" />} label="Canceladas" value={canceladas} color="red" />
                    </div>
                </section>

                {/* Usuarios */}
                <section>
                    <h2 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Usuarios
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatCard icon={<Users className="w-4 h-4" />} label="Total" value={totalUsuarios} color="blue" />
                        <StatCard icon={<Users className="w-4 h-4" />} label="Compradores" value={compradores} color="green" />
                        <StatCard icon={<Users className="w-4 h-4" />} label="Vendedores" value={vendedores} color="amber" />
                        <StatCard icon={<ShieldAlert className="w-4 h-4" />} label="Bloqueados" value={bloqueados} color="red" />
                    </div>
                </section>

                {/* Pujas */}
                <section>
                    <h2 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4" /> Pujas
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard icon={<Gavel className="w-4 h-4" />} label="Total de pujas" value={totalPujas} color="blue" />
                        <StatCard
                            icon={<TrendingUp className="w-4 h-4" />}
                            label="Monto total ofertado"
                            value={formatMonto(montoTotal)}
                            color="green"
                        />
                        <StatCard
                            icon={<BarChart2 className="w-4 h-4" />}
                            label="Promedio por puja"
                            value={formatMonto(montoPromedio)}
                            color="purple"
                        />
                    </div>
                </section>

                {/* Ranking de pujadores */}
                {rankingPujadores.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-3 flex items-center gap-2">
                            <Trophy className="w-4 h-4" /> Top pujadores
                        </h2>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            {rankingPujadores.map((p, i) => (
                                <div
                                    key={p.nombre}
                                    className={`flex items-center justify-between px-5 py-4 ${i < rankingPujadores.length - 1 ? 'border-b border-zinc-800' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${i === 0
                                            ? 'bg-amber-500/30 text-amber-400'
                                            : i === 1
                                                ? 'bg-zinc-600/50 text-zinc-300'
                                                : 'bg-zinc-800 text-zinc-500'
                                            }`}>
                                            {i + 1}
                                        </span>
                                        <span className="font-medium">{p.nombre}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-blue-400 font-bold">{p.pujas} {p.pujas === 1 ? 'puja' : 'pujas'}</p>
                                        <p className="text-zinc-500 text-xs">{formatMonto(p.monto)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tabla últimas subastas */}
                <section>
                    <h2 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-3 flex items-center gap-2">
                        <Gavel className="w-4 h-4" /> Últimas subastas registradas
                    </h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase">
                                        <th className="text-left px-5 py-3">ID</th>
                                        <th className="text-left px-5 py-3">Lego</th>
                                        <th className="text-left px-5 py-3">Precio base</th>
                                        <th className="text-left px-5 py-3">Estado</th>
                                        <th className="text-left px-5 py-3">Pujas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subastas.slice(0, 10).map((s, i) => {
                                        const estado = (s.estado_nombre || s.nombre || '—').toLowerCase();
                                        const estadoColor = estado === 'activa'
                                            ? 'text-green-400'
                                            : estado === 'finalizada'
                                                ? 'text-blue-400'
                                                : estado === 'cancelada'
                                                    ? 'text-red-400'
                                                    : 'text-zinc-500';
                                        return (
                                            <tr key={s.id ?? i} className={`${i < subastas.length - 1 ? 'border-b border-zinc-800/50' : ''} hover:bg-zinc-800/40 transition-colors`}>
                                                <td className="px-5 py-3 font-mono text-zinc-500">#{s.id}</td>
                                                <td className="px-5 py-3 font-medium">{s.lego_nombre || '—'}</td>
                                                <td className="px-5 py-3 text-amber-400">{formatMonto(s.precio_base)}</td>
                                                <td className={`px-5 py-3 font-semibold capitalize ${estadoColor}`}>{s.estado_nombre || '—'}</td>
                                                <td className="px-5 py-3 text-zinc-300">{s.cantidad_pujas ?? 0}</td>
                                            </tr>
                                        );
                                    })}
                                    {subastas.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-zinc-600">No hay subastas registradas.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}