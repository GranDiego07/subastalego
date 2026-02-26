import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubastaService from "../../services/SubastaService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Badge } from "@/components/ui/badge";
import { Gavel, Calendar, ArrowRight } from "lucide-react";

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

                    // 🔍 LOG CLAVE (AQUÍ)
                    console.log("ITEM SUBASTA:", item);

                    const fullUrl = item.imagen ? `${BASE_URL}${item.imagen}` : null;

                    return (
                        <div
                            key={index}
                            onClick={() => navigate(`/lego/subasta/detalle/${item.subasta_id}`)}
                            className="bg-zinc-900 border border-zinc-800 p-0 rounded-2xl shadow-xl cursor-pointer"
                        >
                            <div className="aspect-[4/3] bg-white flex items-center justify-center overflow-hidden relative">
                                {fullUrl ? (
                                    <img src={fullUrl} alt={item.Lego} className="object-contain w-full h-full p-4" />
                                ) : (
                                    <span className="text-xs text-gray-400">Sin Imagen</span>
                                )}
                                <Badge className="absolute top-3 right-3 bg-green-600">Activa</Badge>
                            </div>

                            <div className="p-5 space-y-3">
                                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 h-14">
                                    {item.Lego}
                                </h3>

                                <div className="space-y-2 text-zinc-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>Cierra: {item.fecha_cierre}</span>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-between items-end">
                                    <span className="text-2xl font-black text-blue-400">
                                        ${item.Precio}
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-blue-500" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}