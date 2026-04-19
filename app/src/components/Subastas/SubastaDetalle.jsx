import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Ably from "ably";
import {
    Gavel, Clock, ChevronLeft, AlertTriangle,
    History, CheckCircle, ChevronRight, Trophy
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";
const ABLY_KEY = import.meta.env.VITE_ABLY_KEY ?? "";

function formatMonto(n) {
    return Number(n || 0).toLocaleString("es-CR", { style: "currency", currency: "CRC" });
}

function useCountdown(fechaCierre, onFinalizado) {
    const [texto, setTexto] = useState("--:--:--");
    const [finalizada, setFinalizada] = useState(false);

    useEffect(() => {
        if (!fechaCierre) return;

        const tick = () => {
            const ms = new Date(fechaCierre) - Date.now();

            if (ms <= 0) {
                setTexto("Finalizada");
                setFinalizada(true);
                if (onFinalizado) onFinalizado();
                return;
            }

            const s = Math.floor(ms / 1000);
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = s % 60;
            setTexto(
                `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
            );
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [fechaCierre, onFinalizado]);

    return { texto, finalizada };
}

function ImageCarousel({ imagenes, nombre }) {
    const [idx, setIdx] = useState(0);

    if (!imagenes || imagenes.length === 0) {
        return (
            <div className="rounded-2xl overflow-hidden bg-zinc-900 aspect-video border border-zinc-800 flex items-center justify-center">
                <span className="text-zinc-600">Sin imagen disponible</span>
            </div>
        );
    }

    const toSrc = (img) => img.startsWith("http") ? img : `${BASE_URL}/${img}`;
    const prev = () => setIdx(i => (i - 1 + imagenes.length) % imagenes.length);
    const next = () => setIdx(i => (i + 1) % imagenes.length);

    return (
        <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 aspect-video border border-zinc-800 flex items-center justify-center group">
                <img
                    src={toSrc(imagenes[idx])}
                    alt={`${nombre} - ${idx + 1}`}
                    className="max-h-full max-w-full object-contain p-4"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400?text=Sin+imagen";
                    }}
                />
                {imagenes.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                            {idx + 1} / {imagenes.length}
                        </div>
                    </>
                )}
            </div>

            {imagenes.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {imagenes.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setIdx(i)}
                            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === idx ? "border-blue-500" : "border-zinc-700 hover:border-zinc-500"}`}
                        >
                            <img
                                src={toSrc(img)}
                                alt={`miniatura ${i + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=?"; }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function GanadorAnnouncement({ ganador, monto }) {
    return (
        <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3">
                <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-yellow-400 mb-1">¡Subasta Finalizada!</h3>
            <p className="text-zinc-400 text-sm mb-3">Ganador:</p>
            <p className="text-2xl font-black text-yellow-300 mb-1">{ganador}</p>
            <p className="text-sm text-zinc-500">
                Monto final: <span className="text-yellow-400 font-bold">{formatMonto(monto)}</span>
            </p>
        </div>
    );
}
function SinPujasAnnouncement() {
    return (
        <div className="bg-zinc-800/60 border border-zinc-700 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3">
                <Gavel className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-300 mb-1">Subasta Finalizada</h3>
            <p className="text-zinc-500 text-sm">Esta subasta cerró sin recibir ninguna oferta.</p>
        </div>
    );
}

export default function SubastaDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Leer uid y nombre directo de la URL (para pruebas de dos usuarios)
    const urlParams = new URLSearchParams(window.location.search);
    const testUserId = urlParams.get("uid") ? parseInt(urlParams.get("uid")) : 1;
    const testNombre = urlParams.get("nombre") || "Diego";

    const [subasta, setSubasta] = useState(null);
    const [pujas, setPujas] = useState([]);
    const [pujaMax, setPujaMax] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorPage, setErrorPage] = useState("");

    const [monto, setMonto] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [msgError, setMsgError] = useState("");
    const [msgOk, setMsgOk] = useState("");
    const [nombreUsuarioSesion, setNombreUsuarioSesion] = useState("");
    const [usuarioActual, setUsuarioActual] = useState({ id: null, rol: null });

    // *** REF clave: siempre tiene el id actualizado dentro de callbacks de Ably ***
    const usuarioActualRef = useRef({ id: null });

    const [superado, setSuperado] = useState(false);
    const superadoTimer = useRef(null);

    const [subastaCerrada, setSubastaCerrada] = useState(false);
    const [ganador, setGanador] = useState(null);

    const countdownData = useCountdown(subasta?.fecha_cierre, () => {
        cerrarSubastaAutomaticamente();
    });

    const { texto: countdown, finalizada: tiempoFinalizado } = countdownData;

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setErrorPage("");

            const response = await axios.get(`${BASE_URL}/subasta/getParaInterfaz`, { params: { id } });

            const res = response.data;
            const item = res?.data?.subasta;
            const listaPujas = Array.isArray(res?.data?.pujas) ? res.data.pujas : [];
            const pujaMaxAPI = res?.data?.puja_maxima || null;

            if (!item) throw new Error("No se encontraron datos de la subasta");

            // Priorizar uid de la URL, si no usar el del backend
            const userId = testUserId ?? res?.data?.usuario_actual_id ?? null;
            const userName = testNombre ?? res?.data?.usuario_actual_nombre ?? "Usuario";

            setNombreUsuarioSesion(userName);
            setUsuarioActual({ id: userId, rol: res?.data?.usuario_actual_rol });

            // Actualizar el ref también
            usuarioActualRef.current = { id: userId };

            console.log("✅ Usuario cargado:", { id: userId, nombre: userName });

            const ahora = Date.now();
            const fechaCierre = new Date(item.fecha_cierre).getTime();
            const debeCerrada = ahora > fechaCierre;

            const subastaNormalizada = {
                id: item.id,
                id_creador: item.id_creador,
                lego_nombre: item.lego_nombre || "Sin nombre",
                lego_descripcion: item.lego_descripcion || "Sin descripción",
                precio_base: parseFloat(item.precio_base) || 0,
                incremento_minimo: parseFloat(item.incremento_minimo) || 0,
                fecha_cierre: item.fecha_cierre,
                fecha_inicio: item.fecha_inicio,
                estado: debeCerrada ? "Finalizada" : item.estado,
                vendedor_nombre: item.vendedor_nombre,
                imagenes: Array.isArray(item.imagenes) ? item.imagenes : [],
                ganador_id: item.ganador_id || null,
                ganador_nombre: item.ganador_nombre || null,
                monto_final: item.monto_final || null
            };

            setSubasta(subastaNormalizada);
            setPujas(listaPujas);

            if (pujaMaxAPI) {
                setPujaMax({
                    monto: parseFloat(pujaMaxAPI.monto),
                    usuario_nombre: pujaMaxAPI.usuario_nombre,
                    id_usuario: pujaMaxAPI.id_usuario
                });
            } else if (listaPujas.length > 0) {
                setPujaMax({
                    monto: parseFloat(listaPujas[0].monto),
                    usuario_nombre: listaPujas[0].usuario_pujador,
                    id_usuario: listaPujas[0].id_usuario
                });
            }

            if (item.ganador_nombre) {
                setGanador({ nombre: item.ganador_nombre, monto: item.monto_final });
            }

            if (debeCerrada) setSubastaCerrada(true);

        } catch (err) {
            console.error("Error al cargar:", err);
            setErrorPage(err.message || "Error al cargar la subasta");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) cargarDatos();
    }, [id]);

    useEffect(() => {
        if (!id || !ABLY_KEY || !subasta) return;

        const client = new Ably.Realtime({ key: ABLY_KEY });
        const channel = client.channels.get(`auction-${id}`);

        channel.subscribe("new-bid", (msg) => {
            const d = msg.data;

            // Usar el REF en lugar del state para evitar closure stale
            const miId = usuarioActualRef.current.id;

            console.log("📨 Nueva puja recibida:", d);
            console.log("👤 Mi ID (ref):", miId);

            setPujaMax((prev) => {
                if (
                    prev &&
                    parseInt(prev.id_usuario) === miId &&
                    parseInt(d.id_usuario) !== miId
                ) {
                    console.log("🔔 ¡Superado!");
                    setSuperado(true);
                    if (superadoTimer.current) clearTimeout(superadoTimer.current);
                    superadoTimer.current = setTimeout(() => setSuperado(false), 5000);
                }
                return { monto: d.monto, usuario_nombre: d.usuario_nombre, id_usuario: d.id_usuario };
            });

            setPujas((prev) => [
                {
                    puja_id: Date.now(),
                    monto: d.monto,
                    usuario_pujador: d.usuario_nombre,
                    fecha_hora: d.fecha_hora,
                    id_usuario: d.id_usuario
                },
                ...prev
            ]);
        });

        channel.subscribe("auction-closed", (msg) => {
            const d = msg.data;
            setSubastaCerrada(true);
            if (d.ganador_nombre) {
                setGanador({ nombre: d.ganador_nombre, monto: d.monto_final });
            }
            // Si no hay ganador_nombre, ganador queda null
            setSubasta((prev) => ({
                ...prev,
                estado: "Finalizada",
                ganador_id: d.ganador_id || null,
                ganador_nombre: d.ganador_nombre || null,
                monto_final: d.monto_final || null
            }));
        });
        return () => { channel.unsubscribe(); client.close(); };
    }, [id, ABLY_KEY, !!subasta]);

    const cerrarSubastaAutomaticamente = async () => {
        if (subastaCerrada || !subasta) return;
        try {
            const response = await axios.post(`${BASE_URL}/subasta/cerrar`, { id_subasta: parseInt(id) });
            const resultado = response.data;
            setSubastaCerrada(true);
            if (resultado.ganador_nombre) {
                setGanador({ nombre: resultado.ganador_nombre, monto: resultado.monto_final });
            }
            // Si no hay ganador, subastaCerrada=true y ganador=null → renderiza SinPujasAnnouncement
        } catch (err) { console.error(err); }
    };

    const handlePujar = async () => {
        setMsgError("");
        setMsgOk("");

        if (subastaCerrada || tiempoFinalizado) {
            setMsgError("Esta subasta ya ha sido finalizada");
            return;
        }

        const montoNum = parseFloat(monto);
        const montoActual = pujaMax ? parseFloat(pujaMax.monto) : parseFloat(subasta.precio_base);
        const incremento = parseFloat(subasta.incremento_minimo);
        const montoMinimoRequerido = montoActual + incremento;

        if (!monto || isNaN(montoNum)) {
            setMsgError("Ingresa un monto válido");
            return;
        }

        if (montoNum < montoMinimoRequerido) {
            setMsgError(`La puja mínima es ${formatMonto(montoMinimoRequerido)}`);
            return;
        }

        setEnviando(true);
        try {
            const res = await axios.post(`${BASE_URL}/subasta/pujar`, {
                id_subasta: parseInt(id),
                monto: montoNum,
                id_usuario: usuarioActualRef.current.id
            });

            if (res.data.success) {
                setMsgOk("¡Puja enviada correctamente!");
                setMonto("");

                const client = new Ably.Realtime({ key: ABLY_KEY });
                client.channels.get(`auction-${id}`).publish("new-bid", {
                    monto: montoNum,
                    usuario_nombre: nombreUsuarioSesion,
                    id_usuario: usuarioActualRef.current.id,
                    fecha_hora: new Date().toISOString()
                });
            }
        } catch (err) {
            setMsgError(err.response?.data?.error || "Error al procesar puja");
        } finally {
            setEnviando(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
    );

    if (errorPage || !subasta) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-center p-6">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-zinc-400 mb-6">{errorPage || "No se pudo cargar la subasta"}</p>
            <button onClick={() => navigate(-1)} className="bg-zinc-800 px-6 py-2 rounded-xl text-white hover:bg-zinc-700 transition-colors">Volver</button>
        </div>
    );

    const estaActiva = !subastaCerrada && subasta.estado?.toLowerCase() === "activa";
    const esVendedor = subasta && parseInt(subasta.id_creador) === usuarioActualRef.current.id;
    const precioReferencia = pujaMax ? parseFloat(pujaMax.monto) : parseFloat(subasta.precio_base);
    const montoMinimo = precioReferencia + parseFloat(subasta.incremento_minimo);

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-10">
            {superado && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">¡Tu puja ha sido superada!</span>
                </div>
            )}

            <div className="border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white transition-colors"><ChevronLeft /></button>
                <h1 className="text-lg font-bold flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-blue-500" /> {subasta.lego_nombre}
                </h1>
                <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${estaActiva ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {subasta.estado}
                </span>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <ImageCarousel imagenes={subasta.imagenes} nombre={subasta.lego_nombre} />
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                        <h2 className="text-xl font-bold mb-2">{subasta.lego_nombre}</h2>
                        <p className="text-zinc-400 text-sm">{subasta.lego_descripcion}</p>
                        {subasta.vendedor_nombre && (
                            <p className="text-zinc-500 text-xs mt-3">Vendedor: <span className="text-zinc-300">{subasta.vendedor_nombre}</span></p>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {subastaCerrada ? ( ganador
                        ? <GanadorAnnouncement ganador={ganador.nombre} monto={ganador.monto} />
                        : <SinPujasAnnouncement />
                    ) : (
                        <div className="bg-zinc-900 border border-blue-500/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <div className="text-xs text-blue-400 uppercase mb-1 tracking-widest font-bold">Precio Actual</div>
                            <p className="text-5xl font-black text-blue-400">{formatMonto(precioReferencia)}</p>
                            {pujaMax && (
                                <p className="text-zinc-500 text-xs mt-2">Mejor oferta de <span className="text-zinc-300">{pujaMax.usuario_nombre}</span></p>
                            )}
                        </div>
                    )}

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <Clock className="w-4 h-4" /> Termina en:
                                <span className={`font-mono font-bold ${tiempoFinalizado ? "text-red-400" : "text-white"}`}>{countdown}</span>
                            </div>
                            <div className="text-sm text-zinc-500">Incremento: <span className="text-white font-bold">{formatMonto(subasta.incremento_minimo)}</span></div>
                        </div>

                        {estaActiva && !esVendedor && (
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    placeholder={`Mínimo ${formatMonto(montoMinimo)}`}
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"
                                />
                                <button
                                    onClick={handlePujar}
                                    disabled={enviando}
                                    className="bg-blue-600 hover:bg-blue-500 px-6 rounded-xl font-bold transition-all disabled:opacity-50"
                                >
                                    {enviando ? "..." : "Pujar"}
                                </button>
                            </div>
                        )}
                        {msgError && <p className="text-red-400 text-xs font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {msgError}</p>}
                        {msgOk && <p className="text-green-400 text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {msgOk}</p>}
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2">
                            <History className="w-3 h-3" /> Historial de Pujas
                        </h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {pujas.length > 0 ? pujas.map((p, i) => (
                                <div key={p.puja_id || i} className={`flex justify-between items-center text-sm p-3 rounded-xl ${i === 0 ? "bg-blue-500/10 border border-blue-500/20" : "bg-zinc-800/30"}`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-blue-500 animate-pulse" : "bg-zinc-600"}`} />
                                        <span>{p.usuario_pujador}</span>
                                    </div>
                                    <span className={`font-bold ${i === 0 ? "text-blue-400" : "text-white"}`}>{formatMonto(p.monto)}</span>
                                </div>
                            )) : <p className="text-center text-zinc-600 text-sm py-4">No hay pujas todavía.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}