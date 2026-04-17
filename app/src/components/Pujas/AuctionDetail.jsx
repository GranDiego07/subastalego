// components/AuctionDetail.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuctionChannel } from '../hooks/useAuctionChannel';

// ─── Variable lógica del usuario actual ──────────────────────────────────────
// Cambiar manualmente para simular distintos usuarios en pruebas.
// NO mostrar ni editar desde la interfaz.
const USUARIO_ACTUAL_ID = 1;
// ─────────────────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

function formatMonto(n) {
    return Number(n).toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
}

function formatFecha(str) {
    return new Date(str).toLocaleString('es-CR', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
}

// ── Contador regresivo ────────────────────────────────────────────────────────
function useCountdown(fechaCierre) {
    const [diff, setDiff] = useState(null);

    useEffect(() => {
        if (!fechaCierre) return;

        const tick = () => {
            const ms = new Date(fechaCierre) - Date.now();
            setDiff(ms > 0 ? ms : 0);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [fechaCierre]);

    if (diff === null) return '--:--:--';
    if (diff === 0)    return 'Finalizada';

    const s = Math.floor(diff / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AuctionDetail({ auctionId }) {
    const [subasta,       setSubasta]       = useState(null);
    const [pujas,         setPujas]         = useState([]);
    const [pujaMaxima,    setPujaMaxima]     = useState(null);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState('');
    const [monto,         setMonto]         = useState('');
    const [enviando,      setEnviando]      = useState(false);
    const [msgError,      setMsgError]      = useState('');
    const [msgExito,      setMsgExito]      = useState('');
    const [superado,      setSuperado]      = useState(false);
    const [imgIndex,      setImgIndex]      = useState(0);
    const notifTimer = useRef(null);

    const countdown = useCountdown(subasta?.fecha_cierre);

    // ── Cargar datos iniciales ─────────────────────────────────────────────
    const cargarSubasta = async () => {
        try {
            const { data } = await axios.get(`${API}/subastas/detalle`, {
                params: { id: auctionId }
            });
            setSubasta(data.subasta);
            setPujas(data.pujas ?? []);
            setPujaMaxima(data.puja_maxima ?? null);
        } catch {
            setError('No se pudo cargar la subasta.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarSubasta(); }, [auctionId]);

    // ── Ably: escuchar eventos en tiempo real ──────────────────────────────
    useAuctionChannel(auctionId, {
        onNewBid: (data) => {
            // Actualizar puja máxima
            setPujaMaxima({ monto: data.monto, usuario_nombre: data.usuario_nombre, id_usuario: data.id_usuario });

            // Agregar al historial
            setPujas(prev => [
                { id: Date.now(), monto: data.monto, usuario_nombre: data.usuario_nombre, fecha_hora: data.fecha_hora },
                ...prev,
            ]);

            // Notificar si el usuario actual fue superado
            if (data.id_usuario !== USUARIO_ACTUAL_ID) {
                // Verificar si el usuario actual tenía la puja más alta antes
                setPujaMaxima(prev => {
                    if (prev && prev.id_usuario === USUARIO_ACTUAL_ID) {
                        setSuperado(true);
                        clearTimeout(notifTimer.current);
                        notifTimer.current = setTimeout(() => setSuperado(false), 5000);
                    }
                    return { monto: data.monto, usuario_nombre: data.usuario_nombre, id_usuario: data.id_usuario };
                });
            }
        },
        onAuctionClosed: (data) => {
            setSubasta(prev => prev ? { ...prev, estado: 'Finalizada', id_estado: data.id_estado } : prev);
        },
    });

    // ── Enviar puja ────────────────────────────────────────────────────────
    const handlePujar = async () => {
        setMsgError('');
        setMsgExito('');
        const montoNum = parseFloat(monto);

        if (!monto || isNaN(montoNum) || montoNum <= 0) {
            setMsgError('Ingresa un monto válido.');
            return;
        }

        setEnviando(true);
        try {
            await axios.post(`${API}/subastas/pujar`, {
                id_subasta: auctionId,
                monto:      montoNum,
            });
            setMsgExito('¡Puja registrada con éxito!');
            setMonto('');
        } catch (err) {
            setMsgError(err.response?.data?.error ?? 'Error al registrar la puja.');
        } finally {
            setEnviando(false);
        }
    };

    // ── Estados de carga ───────────────────────────────────────────────────
    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent" />
        </div>
    );

    if (error) return (
        <div className="text-red-500 text-center p-8 font-medium">{error}</div>
    );

    if (!subasta) return null;

    const estaActiva   = subasta.estado?.toLowerCase() === 'activa';
    const esVendedor   = parseInt(subasta.id_creador) === USUARIO_ACTUAL_ID;
    const montoMinimo  = pujaMaxima
        ? parseFloat(pujaMaxima.monto) + parseFloat(subasta.incremento_minimo)
        : parseFloat(subasta.precio_base);

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">

            {/* ── Notificación: puja superada ── */}
            {superado && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
                    <span className="text-xl">⚡</span>
                    <span className="font-semibold">¡Tu puja ha sido superada!</span>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ══ COLUMNA IZQUIERDA: objeto ══════════════════════════════ */}
                <div className="space-y-4">

                    {/* Galería de imágenes */}
                    <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-video">
                        {subasta.imagenes?.length > 0 ? (
                            <>
                                <img
                                    src={subasta.imagenes[imgIndex]}
                                    alt={subasta.lego_nombre}
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                                {subasta.imagenes.length > 1 && (
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                        {subasta.imagenes.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setImgIndex(i)}
                                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                    i === imgIndex ? 'bg-amber-400 scale-125' : 'bg-stone-500'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-stone-600">
                                Sin imagen
                            </div>
                        )}

                        {/* Badge de estado */}
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            estaActiva
                                ? 'bg-emerald-500/90 text-white'
                                : 'bg-stone-700 text-stone-300'
                        }`}>
                            {subasta.estado}
                        </span>
                    </div>

                    {/* Info del objeto */}
                    <div className="bg-stone-900 rounded-2xl p-5 space-y-3">
                        <h1 className="text-2xl font-bold text-amber-400 leading-tight">
                            {subasta.lego_nombre}
                        </h1>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            {subasta.lego_descripcion}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-stone-500 uppercase tracking-wider">Vendedor</span>
                            <span className="text-sm font-medium text-stone-300">
                                {subasta.vendedor_nombre}
                            </span>
                        </div>
                    </div>

                    {/* Info de la subasta */}
                    <div className="bg-stone-900 rounded-2xl p-5 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Precio base</p>
                            <p className="text-lg font-semibold text-stone-200">{formatMonto(subasta.precio_base)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Incremento mínimo</p>
                            <p className="text-lg font-semibold text-stone-200">{formatMonto(subasta.incremento_minimo)}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Tiempo restante</p>
                            <p className={`text-3xl font-mono font-bold tabular-nums ${
                                estaActiva ? 'text-amber-400' : 'text-stone-500'
                            }`}>
                                {countdown}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══ COLUMNA DERECHA: pujas ════════════════════════════════ */}
                <div className="space-y-4">

                    {/* Puja líder */}
                    <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 rounded-2xl p-5">
                        <p className="text-xs text-amber-400/70 uppercase tracking-wider mb-2">Puja más alta</p>
                        {pujaMaxima ? (
                            <>
                                <p className="text-4xl font-bold text-amber-400 tabular-nums">
                                    {formatMonto(pujaMaxima.monto)}
                                </p>
                                <p className="text-sm text-stone-400 mt-1">
                                    por <span className="text-stone-200 font-medium">{pujaMaxima.usuario_nombre}</span>
                                    {parseInt(pujaMaxima.id_usuario) === USUARIO_ACTUAL_ID && (
                                        <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                                            Tú lideras
                                        </span>
                                    )}
                                </p>
                            </>
                        ) : (
                            <p className="text-stone-500 text-sm">Sin pujas aún. ¡Sé el primero!</p>
                        )}
                    </div>

                    {/* Formulario de puja */}
                    {estaActiva && !esVendedor && (
                        <div className="bg-stone-900 rounded-2xl p-5 space-y-3">
                            <p className="text-xs text-stone-500 uppercase tracking-wider">
                                Mínimo a ofrecer: <span className="text-amber-400 font-semibold">{formatMonto(montoMinimo)}</span>
                            </p>

                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={monto}
                                    onChange={e => setMonto(e.target.value)}
                                    placeholder={`Mínimo ${montoMinimo}`}
                                    min={montoMinimo}
                                    step={parseFloat(subasta.incremento_minimo)}
                                    className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                                <button
                                    onClick={handlePujar}
                                    disabled={enviando}
                                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    {enviando ? '...' : 'Pujar'}
                                </button>
                            </div>

                            {msgError && (
                                <p className="text-red-400 text-sm">{msgError}</p>
                            )}
                            {msgExito && (
                                <p className="text-emerald-400 text-sm">{msgExito}</p>
                            )}
                        </div>
                    )}

                    {esVendedor && estaActiva && (
                        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-4 text-stone-400 text-sm text-center">
                            Eres el vendedor de esta subasta — no puedes pujar.
                        </div>
                    )}

                    {!estaActiva && (
                        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-4 text-stone-400 text-sm text-center">
                            Esta subasta ha finalizado.
                            {pujaMaxima && (
                                <span className="block mt-1 text-emerald-400 font-medium">
                                    Ganador: {pujaMaxima.usuario_nombre} — {formatMonto(pujaMaxima.monto)}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Historial de pujas */}
                    <div className="bg-stone-900 rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider mb-3">
                            Historial de pujas
                        </h2>

                        {pujas.length === 0 ? (
                            <p className="text-stone-600 text-sm text-center py-4">Sin pujas registradas</p>
                        ) : (
                            <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {pujas.map((p, i) => (
                                    <li key={p.id ?? i}
                                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
                                            i === 0
                                                ? 'bg-amber-500/10 border border-amber-500/20'
                                                : 'bg-stone-800/60'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-stone-200">
                                                {p.usuario_nombre}
                                                {i === 0 && (
                                                    <span className="ml-2 text-xs text-amber-400">👑</span>
                                                )}
                                            </span>
                                            <span className="text-xs text-stone-500">{formatFecha(p.fecha_hora)}</span>
                                        </div>
                                        <span className={`font-semibold tabular-nums text-sm ${
                                            i === 0 ? 'text-amber-400' : 'text-stone-300'
                                        }`}>
                                            {formatMonto(p.monto)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
