import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubastaService from "../../services/SubastaService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Badge } from "@/components/ui/badge"; // Si usas shadcn/ui
import { Gavel, Calendar,ArrowRight  } from "lucide-react";

export function ListSubastasActi() {
    const [subastas, setSubastas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchSubasta = async () => {
            setLoading(true);
            try {
                const response = await SubastaService.getSubastaActiva();
                // Tu SQL devuelve directamente un array de objetos planos
                const data = response.data?.data || response.data || [];
                setSubastas(data);
            } catch (err) {
                console.error("Error al cargar Subasta:", err);
                setError("No se pudo conectar con el servicio de Subasta.");
            } finally {
                setLoading(false);
            }
        };
        fetchSubasta();
    }, []);

    if (loading) return <LoadingGrid type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar" message={error} />;
    if (subastas.length === 0) return <EmptyState message="No hay subastas activas en este momento." />;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h2 className="text-3xl font-extrabold mb-8 text-white flex items-center gap-3">
                <Gavel className="text-blue-500" /> Catálogo de Subastas Activas
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subastas.map((item, index) => {
                    // item.imagen viene directamente del SELECT (ej: "public/img/lego1.jpg")
                    const fullUrl = item.imagen ? `${BASE_URL}${item.imagen}` : null;

                    return (
                        <div 
                            key={index} 
                            onClick={() => navigate(`/lego/detail/${item.id}`)}
                            className="bg-zinc-900 border border-zinc-800 p-0 rounded-2xl shadow-xl hover:shadow-blue-900/20 transition-all cursor-pointer hover:scale-[1.03] group overflow-hidden"
                        >
                            {/* CONTENEDOR DE IMAGEN */}
                            <div className="aspect-[4/3] bg-white flex items-center justify-center overflow-hidden relative">
                                {fullUrl ? (
                                    <img src={fullUrl} alt={item.Lego} className="object-contain w-full h-full p-4" />
                                ) : (
                                    <span className="text-xs text-gray-400">Sin Imagen</span>
                                )}
                                <Badge className="absolute top-3 right-3 bg-green-600">Activa</Badge>
                            </div>

                            {/* CUERPO DE LA TARJETA */}
                            <div className="p-5 space-y-3">
                                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 h-14">
                                    {item.Lego}
                                </h3>

                                <div className="space-y-2 text-zinc-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>Cierra: {item.fecha_cierre}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Gavel className="w-4 h-4 text-blue-500" />
                                        <span className="font-medium text-zinc-300">
                                            {item.cantidad_pujas} pujas recibidas
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Precio Base</span>
                                        <span className="text-2xl font-black text-blue-400">
                                            ${item.Precio}
                                        </span>
                                    </div>
                                    <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                                        <ArrowRight className="w-5 h-5 text-blue-500 group-hover:text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}