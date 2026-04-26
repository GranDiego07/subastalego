import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '@/hooks/useUser';
import SubastaService from '@/services/SubastaService';
import UsuariosService from '@/services/UsuariosService';
import PujasService from '@/services/PujasService';
import {
    BarChart2, Users, Gavel, Trophy,
    TrendingUp, Award, ShieldAlert, ArrowLeft,
    Calendar, Filter, X, ChevronDown
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';

// ─── helpers ────────────────────────────────────────────────────────────────
function formatMonto(n) {
    return Number(n || 0).toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
}
function formatFecha(f) {
    if (!f) return '—';
    return new Date(f).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── sub-components ─────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = 'blue' }) {
    const colors = {
        blue: 'text-blue-400   bg-blue-500/10   border-blue-500/20',
        amber: 'text-amber-400  bg-amber-500/10  border-amber-500/20',
        green: 'text-green-400  bg-green-500/10  border-green-500/20',
        red: 'text-red-400    bg-red-500/10    border-red-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        cyan: 'text-cyan-400   bg-cyan-500/10   border-cyan-500/20',
    };
    return (
        <div className={`rounded-2xl border p-5 ${colors[color]}`}>
            <div className="flex items-center gap-2 mb-3 opacity-80">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-3xl font-black truncate">{value}</p>
            {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
        </div>
    );
}

StatCard.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sub: PropTypes.string,
    color: PropTypes.oneOf(['blue', 'amber', 'green', 'red', 'purple', 'cyan']),
};

const TAB_SUBASTAS = 'subastas';
const TAB_USUARIOS = 'usuarios';
const TAB_PUJAS = 'pujas';

const PIE_COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b'];

// Custom tooltip para recharts
function CustomTooltip({ active, payload, label, monto }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm shadow-xl">
            <p className="text-zinc-400 mb-1 font-medium">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-bold">
                    {monto ? formatMonto(p.value) : p.value} {p.name && <span className="text-zinc-500 font-normal">({p.name})</span>}
                </p>
            ))}
        </div>
    );
}

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        value: PropTypes.number,
        name: PropTypes.string,
    })),
    label: PropTypes.string,
    monto: PropTypes.bool,
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function Reportes() {
    const navigate = useNavigate();
    const { authorize } = useUser();

    const [subastas, setSubastas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [pujas, setPujas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(TAB_SUBASTAS);

    // Filtros
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('todos');

    useEffect(() => {
        if (!authorize(['administrador'])) { navigate('/'); return; }
        Promise.all([
            SubastaService.getAll().catch(() => ({ data: [] })),
            UsuariosService.getUsuarioDetalle().catch(() => ({ data: [] })),
            PujasService.getPujasDetalle().catch(() => ({ data: [] })),
        ]).then(([sRes, uRes, pRes]) => {
            const norm = r => { const d = r.data?.data ?? r.data ?? []; return Array.isArray(d) ? d : []; };
            setSubastas(norm(sRes));
            setUsuarios(norm(uRes));
            setPujas(norm(pRes));
        }).finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── helpers de estado ────────────────────────────────────────────────────
    // La API devuelve id_estado numérico: 1=activa, 2=finalizada, 3=cancelada
    const ESTADO_MAP = { '1': 'activa', '2': 'finalizada', '3': 'cancelada', '5': 'finalizada sin ofertas' };
    const estadoStr = s =>
        s.estado_nombre?.toLowerCase() ||
        ESTADO_MAP[String(s.id_estado)] ||
        (s.estado || '').toLowerCase() ||
        '—';

    const inRango = useCallback((fechaStr) => {
        if (!fechaStr) return true;
        const d = new Date(fechaStr);
        if (isNaN(d)) return true;
        if (fechaDesde && d < new Date(fechaDesde)) return false;
        if (fechaHasta && d > new Date(fechaHasta + 'T23:59:59')) return false;
        return true;
    }, [fechaDesde, fechaHasta]);

    // ── subastas filtradas ───────────────────────────────────────────────────
    const subastasFiltradas = useMemo(() => subastas.filter(s => {
        if (estadoFiltro !== 'todos' && estadoStr(s) !== estadoFiltro) return false;
        return inRango(s.fecha_inicio || s.fecha_creacion || s.created_at);
    }), [subastas, estadoFiltro, inRango]);

    // ── pujas filtradas ──────────────────────────────────────────────────────
    const pujasFiltradas = useMemo(() => pujas.filter(p =>
        inRango(p.fecha_hora || p.fecha_puja || p.fecha || p.created_at)
    ), [pujas, inRango]);

    // ── stats subastas ───────────────────────────────────────────────────────
    const totalSubastas = subastasFiltradas.length;
    const activas = subastasFiltradas.filter(s => estadoStr(s) === 'activa').length;
    const finalizadas = subastasFiltradas.filter(s => estadoStr(s) === 'finalizada').length;
    const canceladas = subastasFiltradas.filter(s => estadoStr(s) === 'cancelada').length;
    const finalizadassinofertas = subastasFiltradas.filter(s => estadoStr(s) === 'finalizada sin ofertas').length;

    // ── stats usuarios (sin filtro de fecha, siempre todos) ──────────────────
    const totalUsuarios = usuarios.length;
    const compradores = usuarios.filter(u => u.rol_nombre?.toLowerCase() === 'comprador').length;
    const vendedores = usuarios.filter(u => u.rol_nombre?.toLowerCase() === 'vendedor').length;
    const bloqueados = usuarios.filter(u => ['bloqueado', 'inactivo'].includes(u.estado_nombre?.toLowerCase())).length;

    // ── stats pujas ──────────────────────────────────────────────────────────
    const totalPujas = pujasFiltradas.length;
    const montoTotal = pujasFiltradas.reduce((a, p) => a + Number(p.monto || 0), 0);
    const montoPromedio = totalPujas > 0 ? montoTotal / totalPujas : 0;
    const montoMax = Math.max(0, ...pujasFiltradas.map(p => Number(p.monto || 0)));

    // ── gráfico: subastas por estado (pie) ───────────────────────────────────
    const pieData = [
        { name: 'Activas', value: activas },
        { name: 'Finalizadas', value: finalizadas },
        { name: 'Canceladas', value: canceladas },
        { name: 'Sin Ofertas', value: finalizadassinofertas },
    ].filter(d => d.value > 0);

    // ── gráfico: pujas por día (line) ────────────────────────────────────────
    const pujasXDia = useMemo(() => {
        const map = {};
        pujasFiltradas.forEach(p => {
            const fechaRaw = p.fecha_hora || p.fecha_puja || p.fecha || p.created_at || '';
            const fecha = fechaRaw.split('T')[0].split(' ')[0]; // soporta "2026-02-11 15:30:00" y ISO
            if (!fecha) return;
            if (!map[fecha]) map[fecha] = { fecha, pujas: 0, monto: 0 };
            map[fecha].pujas += 1;
            map[fecha].monto += Number(p.monto || 0);
        });
        return Object.values(map).sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(-14);
    }, [pujasFiltradas]);

    // ── gráfico: usuarios por rol (bar) ──────────────────────────────────────
    const usuariosXRol = [
        { rol: 'Compradores', cantidad: compradores },
        { rol: 'Vendedores', cantidad: vendedores },
        { rol: 'Bloqueados', cantidad: bloqueados },
    ];

    // ── ranking pujadores ────────────────────────────────────────────────────
    const rankingPujadores = Object.values(
        pujasFiltradas.reduce((acc, p) => {
            const nombre = p.NombreUsuario || p.usuario_pujador || 'Desconocido';
            if (!acc[nombre]) acc[nombre] = { nombre, pujas: 0, monto: 0 };
            acc[nombre].pujas += 1;
            acc[nombre].monto += Number(p.monto || 0);
            return acc;
        }, {})
    ).sort((a, b) => b.pujas - a.pujas).slice(0, 5);

    const clearFiltros = () => { setFechaDesde(''); setFechaHasta(''); setEstadoFiltro('todos'); };
    const hayFiltros = fechaDesde || fechaHasta || estadoFiltro !== 'todos';

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
    );

    const TABS = [
        { id: TAB_SUBASTAS, label: 'Subastas', icon: <Gavel className="w-4 h-4" /> },
        { id: TAB_USUARIOS, label: 'Usuarios', icon: <Users className="w-4 h-4" /> },
        { id: TAB_PUJAS, label: 'Pujas', icon: <Trophy className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen pb-20 text-white">
            <div className="max-w-5xl mx-auto px-4 pt-10 space-y-6">

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

                {/* ── FILTROS ── */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wide">Filtros</span>
                        </div>
                        {hayFiltros && (
                            <button
                                onClick={clearFiltros}
                                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 px-3 py-1.5 rounded-lg transition-all"
                            >
                                <X className="w-3.5 h-3.5" /> Limpiar filtros
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-zinc-500 text-xs uppercase font-bold flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Desde
                            </label>
                            <input
                                type="date"
                                value={fechaDesde}
                                onChange={e => setFechaDesde(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-2.5 text-sm transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-zinc-500 text-xs uppercase font-bold flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Hasta
                            </label>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={e => setFechaHasta(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-2.5 text-sm transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-zinc-500 text-xs uppercase font-bold flex items-center gap-1.5">
                                <ChevronDown className="w-3.5 h-3.5" /> Estado subasta
                            </label>
                            <select
                                value={estadoFiltro}
                                onChange={e => setEstadoFiltro(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-2.5 text-sm transition-colors appearance-none cursor-pointer"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="activa">Activa</option>
                                <option value="finalizada">Finalizada</option>
                                <option value="sinOferta">Sin Oferta</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>
                    </div>
                    {hayFiltros && (
                        <p className="text-xs text-blue-400 font-medium">
                            Mostrando resultados filtrados · {subastasFiltradas.length} subastas · {pujasFiltradas.length} pujas
                        </p>
                    )}
                </div>

                {/* ── TABS ── */}
                <div className="flex gap-2 border-b border-zinc-800 pb-0">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all border-b-2 -mb-px ${tab === t.id
                                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                                }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* ══════════════ TAB: SUBASTAS ══════════════ */}
                {tab === TAB_SUBASTAS && (
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard icon={<Gavel className="w-4 h-4" />} label="Total" value={totalSubastas} color="blue" />
                            <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Activas" value={activas} color="green" />
                            <StatCard icon={<Award className="w-4 h-4" />} label="Finalizadas" value={finalizadas} color="amber" />
                            <StatCard icon={<ShieldAlert className="w-4 h-4" />} label="Canceladas" value={canceladas} color="red" />
                        </div>

                        {/* Gráfico: Distribución de estados (PIE) */}
                        {pieData.length > 0 && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-400 mb-4 flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4 text-blue-400" /> Distribución por estado
                                </h3>
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={90}
                                                paddingAngle={3}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {pieData.map((_, i) => (
                                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex flex-col gap-3 min-w-35">
                                        {pieData.map((d, i) => (
                                            <div key={d.name} className="flex items-center gap-2 text-sm">
                                                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                <span className="text-zinc-300">{d.name}</span>
                                                <span className="ml-auto font-bold text-white">{d.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tabla últimas subastas */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-zinc-800">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-400 flex items-center gap-2">
                                    <Gavel className="w-4 h-4 text-blue-400" /> Detalle de subastas
                                </h3>
                            </div>
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
                                        {subastasFiltradas.slice(0, 15).map((s, i) => {
                                            const est = estadoStr(s);
                                            const estLabel = est === '—' ? '—' : est.charAt(0).toUpperCase() + est.slice(1);
                                            const c = est === 'activa' ? 'text-green-400' : est === 'finalizada' ? 'text-blue-400' : est === 'finalizada sin ofertas' ? 'text-yellow-400' : est === 'cancelada' ? 'text-red-400' : 'text-zinc-500';
                                            // Contar pujas de esta subasta usando los datos de pujas
                                            const cantPujas = s.total_pujas;
                                            // Obtener nombre del lego desde pujas (la API de subastas no lo trae)
                                            const pujaDeSub = pujas.find(p => String(p.id_subasta) === String(s.id));
                                            const legoNombre = s.lego_nombre || pujaDeSub?.NombreLego || `ID ${s.id_lego}`;
                                            return (
                                                <tr key={s.id ?? i} className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                                                    <td className="px-5 py-3 font-mono text-zinc-500">#{s.id}</td>
                                                    <td className="px-5 py-3 font-medium">{legoNombre}</td>
                                                    <td className="px-5 py-3 text-amber-400">{formatMonto(s.precio_base)}</td>
                                                    <td className={`px-5 py-3 font-semibold capitalize ${c}`}>{estLabel}</td>
                                                    <td className="px-5 py-3 text-zinc-300">{cantPujas}</td>
                                                </tr>
                                            );
                                        })}
                                        {subastasFiltradas.length === 0 && (
                                            <tr><td colSpan={5} className="text-center py-10 text-zinc-600">No hay subastas con los filtros aplicados.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════ TAB: USUARIOS ══════════════ */}
                {tab === TAB_USUARIOS && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard icon={<Users className="w-4 h-4" />} label="Total" value={totalUsuarios} color="blue" />
                            <StatCard icon={<Users className="w-4 h-4" />} label="Compradores" value={compradores} color="green" />
                            <StatCard icon={<Users className="w-4 h-4" />} label="Vendedores" value={vendedores} color="amber" />
                            <StatCard icon={<ShieldAlert className="w-4 h-4" />} label="Bloqueados" value={bloqueados} color="red" />
                        </div>

                        {/* Gráfico: usuarios por rol (BAR) */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-400 mb-4 flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-blue-400" /> Distribución de usuarios por rol
                            </h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={usuariosXRol} barSize={48}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                    <XAxis dataKey="rol" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                    <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                                        {usuariosXRol.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Tabla usuarios */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-zinc-800">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-400 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-400" /> Detalle de usuarios
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase">
                                            <th className="text-left px-5 py-3">ID</th>
                                            <th className="text-left px-5 py-3">Nombre</th>
                                            <th className="text-left px-5 py-3">Correo</th>
                                            <th className="text-left px-5 py-3">Rol</th>
                                            <th className="text-left px-5 py-3">Estado</th>
                                            <th className="text-left px-5 py-3">Registro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.slice(0, 15).map((u, i) => {
                                            const est = u.estado_nombre?.toLowerCase();
                                            const estC = est === 'activo' ? 'text-green-400' : 'text-red-400';
                                            return (
                                                <tr key={u.id ?? i} className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                                                    <td className="px-5 py-3 font-mono text-zinc-500">#{u.id}</td>
                                                    <td className="px-5 py-3 font-medium">{u.nombre_completo || '—'}</td>
                                                    <td className="px-5 py-3 text-zinc-400">{u.correo || '—'}</td>
                                                    <td className="px-5 py-3 capitalize text-zinc-300">{u.rol_nombre || '—'}</td>
                                                    <td className={`px-5 py-3 font-semibold capitalize ${estC}`}>{u.estado_nombre || '—'}</td>
                                                    <td className="px-5 py-3 text-zinc-500">{formatFecha(u.fecha_registro)}</td>
                                                </tr>
                                            );
                                        })}
                                        {usuarios.length === 0 && (
                                            <tr><td colSpan={6} className="text-center py-10 text-zinc-600">Sin usuarios registrados.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════ TAB: PUJAS ══════════════ */}
                {tab === TAB_PUJAS && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard icon={<Gavel className="w-4 h-4" />} label="Total pujas" value={totalPujas} color="blue" />
                            <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Monto total" value={formatMonto(montoTotal)} color="green" sub="suma de todas las pujas" />
                            <StatCard icon={<BarChart2 className="w-4 h-4" />} label="Promedio" value={formatMonto(montoPromedio)} color="purple" sub="por puja" />
                            <StatCard icon={<Award className="w-4 h-4" />} label="Puja máxima" value={formatMonto(montoMax)} color="amber" />
                        </div>

                        {/* Gráfico: pujas por día (LINE) */}
                        {pujasXDia.length > 0 && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-400 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-blue-400" /> Pujas por día (últimos 14 días)
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={pujasXDia}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                        <XAxis dataKey="fecha" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="pujas"
                                            stroke="#3b82f6"
                                            strokeWidth={2.5}
                                            dot={{ fill: '#3b82f6', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Ranking pujadores */}
                        {rankingPujadores.length > 0 && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-zinc-800">
                                    <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-400 flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-amber-400" /> Top 5 pujadores
                                    </h3>
                                </div>
                                {rankingPujadores.map((p, i) => (
                                    <div key={p.nombre} className={`flex items-center justify-between px-5 py-4 ${i < rankingPujadores.length - 1 ? 'border-b border-zinc-800' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${i === 0 ? 'bg-amber-500/30 text-amber-400' :
                                                i === 1 ? 'bg-zinc-600/50 text-zinc-300' :
                                                    'bg-zinc-800 text-zinc-500'
                                                }`}>{i + 1}</span>
                                            <span className="font-medium">{p.nombre}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-blue-400 font-bold">{p.pujas} {p.pujas === 1 ? 'puja' : 'pujas'}</p>
                                            <p className="text-zinc-500 text-xs">{formatMonto(p.monto)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tabla detalle pujas */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-zinc-800">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-400 flex items-center gap-2">
                                    <Gavel className="w-4 h-4 text-blue-400" /> Detalle de pujas
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase">
                                            <th className="text-left px-5 py-3">ID</th>
                                            <th className="text-left px-5 py-3">Usuario</th>
                                            <th className="text-left px-5 py-3">Lego</th>
                                            <th className="text-left px-5 py-3">Monto</th>
                                            <th className="text-left px-5 py-3">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pujasFiltradas.slice(0, 15).map((p, i) => (
                                            <tr key={p.id ?? i} className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                                                <td className="px-5 py-3 font-mono text-zinc-500">#{p.id}</td>
                                                <td className="px-5 py-3 font-medium">{p.NombreUsuario || '—'}</td>
                                                <td className="px-5 py-3 text-zinc-400">{p.NombreLego || `#${p.id_subasta || '—'}`}</td>
                                                <td className="px-5 py-3 text-amber-400 font-bold">{formatMonto(p.monto)}</td>
                                                <td className="px-5 py-3 text-zinc-500">{formatFecha(p.fecha_hora || p.fecha_puja || p.fecha || p.created_at)}</td>
                                            </tr>
                                        ))}
                                        {pujasFiltradas.length === 0 && (
                                            <tr><td colSpan={5} className="text-center py-10 text-zinc-600">No hay pujas con los filtros aplicados.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}