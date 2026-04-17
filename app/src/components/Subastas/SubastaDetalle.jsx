// pages/SubastaDetalle.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Ably from "ably";
import {
    Gavel, Clock, ChevronLeft, Trophy, AlertTriangle,
    User, Tag, TrendingUp, History, CheckCircle
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// VARIABLE LÓGICA DEL USUARIO ACTUAL
// Cambiar manualmente para simular distintos usuarios en pruebas.
// NO mostrar ni editar desde la interfaz.
// ─────────────────────────────────────────────────────────────────────────────
const USUARIO_ACTUAL_ID = 1;

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";
const ABLY_KEY = import.meta.env.VITE_ABLY_KEY ?? "";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatMonto(n) {
    return Number(n).toLocaleString("es-CR", { style: "currency", currency: "CRC" });
}
function formatFecha(str) {
    if (!str) return "—";
    return new Date(str).toLocaleString("es-CR", { dateStyle: "short", timeStyle: "short" });
}

// ── Contador regresivo ────────────────────────────────────────────────────────
function useCountdown(fechaCierre) {
    const [texto, setTexto] = useState("--:--:--");

    useEffect(() => {
        if (!fechaCierre) return;
        const tick = () => {
            const ms = new Date(fechaCierre) - Date.now();
            if (ms <= 0) { setTexto("Finalizada"); return; }
            const s = Math.floor(ms / 1000);
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = s % 60;
            setTexto(
                `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
            );
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [fechaCierre]);

    return texto;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SubastaDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subasta, setSubasta] = useState(null);
    const [pujas, setPujas] = useState([]);
    const [pujaMax, setPujaMax] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorPage, setErrorPage] = useState("");

    const [monto, setMonto] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [msgError, setMsgError] = useState("");
    const [msgOk, setMsgOk] = useState("");

    const [superado, setSuperado] = useState(false);
    const [imgIdx, setImgIdx] = useState(0);

    const superadoTimer = useRef(null);
    const ablyRef = useRef(null);
    const channelRef = useRef(null);

    const countdown = useCountdown(subasta?.fecha_cierre);

    // ── Cargar datos desde el backend ─────────────────────────────────────────
    const cargar = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/subasta/getParaInterfaz`, {
                params: { id }
            });
            setSubasta(data.subasta);
            setPujas(data.pujas ?? []);
            setPujaMax(data.puja_maxima ?? null);
        } catch {
            setErrorPage("No se pudo cargar la subasta.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, [id]);

    // ── Suscripción a Ably ────────────────────────────────────────────────────
    useEffect(() => {
        if (!id || !ABLY_KEY) return;

        const client = new Ably.Realtime({ key: ABLY_KEY });
        const channel = client.channels.get(`auction-${id}`);
        ablyRef.current = client;
        channelRef.current = channel;

        // Evento: nueva puja
        channel.subscribe("new-bid", (msg) => {
            const d = msg.data;

            // ¿El usuario actual fue superado?
            setPujaMax(prev => {
                if (prev && parseInt(prev.id_usuario) === USUARIO_ACTUAL_ID
                    && parseInt(d.id_usuario) !== USUARIO_ACTUAL_ID) {
                    setSuperado(true);
                    clearTimeout(superadoTimer.current);
                    superadoTimer.current = setTimeout(() => setSuperado(false), 5000);
                }
                return {
                    monto: d.monto,
                    usuario_nombre: d.usuario_nombre,
                    id_usuario: d.id_usuario,
                };
            });

            // Agregar al historial
            setPujas(prev => [{
                puja_id: Date.now(),
                monto: d.monto,
                usuario_pujador: d.usuario_nombre,
                fecha_hora: d.fecha_hora,
                id_usuario: d.id_usuario,
            }, ...prev]);
        });

        // Evento: subasta cerrada
        channel.subscribe("auction-closed", () => {
            setSubasta(prev => prev ? { ...prev, estado: "Finalizada" } : prev);
        });

        return () => {
            channel.unsubscribe();
            client.close();
        };
    }, [id]);

    // ── Enviar puja ───────────────────────────────────────────────────────────
    const handlePujar = async () => {
        setMsgError("");
        setMsgOk("");
        const montoNum = parseFloat(monto);
        if (!monto || isNaN(montoNum) || montoNum <= 0) {
            setMsgError("Ingresa un monto válido.");
            return;
        }
        setEnviando(true);
        try {
            await axios.post(`${BASE_URL}/subasta/pujar`, {
                id_subasta: parseInt(id),
                monto: montoNum,
            });
            setMsgOk("¡Puja registrada con éxito!");
            setMonto("");
        } catch (err) {
            setMsgError(err.response?.data?.error ?? "Error al registrar la puja.");
        } finally {
            setEnviando(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
    );

    if (errorPage) return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-red-400 text-center p-8">
            {errorPage}
        </div>
    );

    if (!subasta) return null;

    const estaActiva = subasta.estado?.toLowerCase() === "activa";
    const esVendedor = parseInt(subasta.id_creador) === USUARIO_ACTUAL_ID;
    const montoActual = pujaMax ? parseFloat(pujaMax.monto) : parseFloat(subasta.precio_base);
    const montoMinimo = montoActual + parseFloat(subasta.incremento_minimo);
    const imagenes = subasta.imagenes ?? [];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            {/* ── Notificación: puja superada ───────────────────────────── */}
            {superado && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50
                                bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl
                                flex items-center gap-3 animate-bounce">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">¡Tu puja ha sido superada!</span>
                </div>
            )}

            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-sm"
                >
                    <ChevronLeft className="w-4 h-4" /> Volver
                </button>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-blue-500" />
                    {subasta.lego_nombre}
                </h1>
                <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${estaActiva
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-zinc-700 text-zinc-400"
                    }`}>
                    {subasta.estado}
                </span>
            </div>

            {/* ── Contenido principal ───────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ══ COLUMNA IZQUIERDA ══════════════════════════════════ */}
                <div className="space-y-4">

                    {/* Galería */}
                    <div className="rounded-2xl overflow-hidden bg-zinc-900 aspect-video relative">
                        {imagenes.length > 0 ? (
                            <>
                                <img
                                    src={`${BASE_URL}${imagenes[imgIdx]}`}
                                    alt={subasta.lego_nombre}
                                    className="w-full h-full object-contain p-4 transition-all duration-300"
                                />
                                {imagenes.length > 1 && (
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                        {imagenes.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setImgIdx(i)}
                                                className={`w-2.5 h-2.5 rounded-full transition-all ${i === imgIdx ? "bg-blue-400 scale-125" : "bg-zinc-600"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
                                Sin imagen
                            </div>
                        )}
                    </div>

                    {/* Info del objeto */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                        <h2 className="text-xl font-bold text-white">{subasta.lego_nombre}</h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">{subasta.lego_descripcion}</p>
                        <div className="flex items-center gap-2 text-sm pt-1">
                            <User className="w-4 h-4 text-zinc-500" />
                            <span className="text-zinc-500">Vendedor:</span>
                            <span className="text-zinc-200 font-medium">{subasta.vendedor_nombre}</span>
                        </div>
                    </div>

                    {/* Info de la subasta */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center gap-1 text-xs text-zinc-500 uppercase tracking-wider mb-1">
                                <Tag className="w-3 h-3" /> Precio base
                            </div>
                            <p className="text-lg font-semibold text-zinc-200">
                                {formatMonto(subasta.precio_base)}
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-xs text-zinc-500 uppercase tracking-wider mb-1">
                                <TrendingUp className="w-3 h-3" /> Incremento mínimo
                            </div>
                            <p className="text-lg font-semibold text-zinc-200">
                                {formatMonto(subasta.incremento_minimo)}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <div className="flex items-center gap-1 text-xs text-zinc-500 uppercase tracking-wider mb-1">
                                <Clock className="w-3 h-3" /> Tiempo restante
                            </div>
                            <p className={`text-3xl font-mono font-bold tabular-nums ${estaActiva ? "text-blue-400" : "text-zinc-500"
                                }`}>
                                {countdown}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══ COLUMNA DERECHA ════════════════════════════════════ */}
                <div className="space-y-4">

                    {/* Puja líder */}
                    <div className="bg-zinc-900 border border-blue-500/30 rounded-2xl p-5">
                        <div className="flex items-center gap-2 text-xs text-blue-400/70 uppercase tracking-wider mb-3">
                            <Trophy className="w-3.5 h-3.5" /> Puja más alta
                        </div>
                        {pujaMax ? (
                            <>
                                <p className="text-4xl font-black text-blue-400 tabular-nums">
                                    {formatMonto(pujaMax.monto)}
                                </p>
                                <p className="text-sm text-zinc-400 mt-2 flex items-center gap-2">
                                    por
                                    <span className="text-zinc-200 font-medium">{pujaMax.usuario_nombre}</span>
                                    {parseInt(pujaMax.id_usuario) === USUARIO_ACTUAL_ID && (
                                        <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                                            Tú lideras 🏆
                                        </span>
                                    )}
                                </p>
                            </>
                        ) : (
                            <p className="text-zinc-500 text-sm">Sin pujas aún. ¡Sé el primero!</p>
                        )}
                    </div>

                    {/* Formulario de puja */}
                    {estaActiva && !esVendedor && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">
                                Mínimo a ofrecer:{" "}
                                <span className="text-blue-400 font-semibold">
                                    {formatMonto(montoMinimo)}
                                </span>
                            </p>

                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={monto}
                                    onChange={e => setMonto(e.target.value)}
                                    placeholder={`Mínimo ${montoMinimo}`}
                                    min={montoMinimo}
                                    step={parseFloat(subasta.incremento_minimo)}
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5
                                               text-white placeholder-zinc-600
                                               focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <button
                                    onClick={handlePujar}
                                    disabled={enviando}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                                               text-white font-bold px-5 py-2.5 rounded-xl
                                               transition-colors flex items-center gap-2"
                                >
                                    <Gavel className="w-4 h-4" />
                                    {enviando ? "..." : "Pujar"}
                                </button>
                            </div>

                            {msgError && (
                                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    {msgError}
                                </div>
                            )}
                            {msgOk && (
                                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    {msgOk}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mensaje si es vendedor */}
                    {esVendedor && estaActiva && (
                        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 text-zinc-400 text-sm text-center">
                            Eres el vendedor de esta subasta — no puedes pujar.
                        </div>
                    )}

                    {/* Mensaje si está finalizada */}
                    {!estaActiva && (
                        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 text-center space-y-1">
                            <p className="text-zinc-400 text-sm">Esta subasta ha finalizado.</p>
                            {pujaMax && (
                                <p className="text-green-400 font-semibold text-sm flex items-center justify-center gap-2">
                                    <Trophy className="w-4 h-4" />
                                    Ganador: {pujaMax.usuario_nombre} — {formatMonto(pujaMax.monto)}
                                </p>
                            )}
                            {!pujaMax && (
                                <p className="text-zinc-500 text-sm">Finalizada sin ofertas.</p>
                            )}
                        </div>
                    )}

                    {/* Historial de pujas */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                            <History className="w-4 h-4" /> Historial de pujas
                        </h3>

                        {pujas.length === 0 ? (
                            <p className="text-zinc-600 text-sm text-center py-4">
                                Sin pujas registradas
                            </p>
                        ) : (
                            <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {pujas.map((p, i) => (
                                    <li
                                        key={p.puja_id ?? i}
                                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${i === 0
                                                ? "bg-blue-500/10 border border-blue-500/20"
                                                : "bg-zinc-800/60"
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-zinc-200">
                                                {p.usuario_pujador}
                                                {i === 0 && (
                                                    <span className="ml-1 text-xs text-blue-400">👑</span>
                                                )}
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                {formatFecha(p.fecha_hora)}
                                            </span>
                                        </div>
                                        <span className={`font-bold tabular-nums text-sm ${i === 0 ? "text-blue-400" : "text-zinc-300"
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
