import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeft } from "lucide-react";
import SubastaService from "@/services/SubastaService";

export function PublicarSubasta() {
    const { id }                  = useParams();
    const navigate                = useNavigate();
    const [subasta, setSubasta]   = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [confirm, setConfirm]   = useState(false);

    useEffect(() => {
        const fetchSubasta = async () => {
            try {
                const res  = await SubastaService.getConDetalle(id);
                const data = res.data?.data ?? res.data;

                const ahora      = new Date();
                const fechaInicio = new Date(data.fecha_inicio.replace(" ", "T"));

                if (data.id_estado === 1) {
                    toast.error("Esta subasta ya está activa");
                    navigate("/lego/subasta");
                    return;
                }
                if (data.id_estado === 3) {
                    toast.error("No se puede publicar una subasta cancelada");
                    navigate("/lego/subasta");
                    return;
                }
                if (fechaInicio <= ahora) {
                    toast.error("La fecha de inicio debe ser mayor a la fecha actual");
                    navigate("/lego/subasta");
                    return;
                }

                setSubasta(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSubasta();
    }, [id, navigate]);

    const handlePublicar = async () => {
        try {
            const res    = await SubastaService.publicar(id);
            const result = res.data;

            if (result?.success === false) {
                toast.error(result.message);
                return;
            }

            toast.success("¡Subasta publicada correctamente!", { duration: 2000 });
            setTimeout(() => navigate("/lego/subasta"), 2000);
        } catch {
            toast.error("Error al publicar la subasta");
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando subasta...</div>;
    if (error)   return <div className="p-10 text-center text-red-600">{error}</div>;

    return (
        <Card className="p-6 max-w-xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6">Publicar Subasta</h2>

            <div className="space-y-3 mb-8 text-sm text-gray-700">
                <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Lego:</span>
                    <span>{subasta?.lego_nombre ?? "—"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Precio Base:</span>
                    <span>₡{Number(subasta?.precio_base).toLocaleString("es-CR")}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Incremento Mínimo:</span>
                    <span>₡{Number(subasta?.incremento_minimo).toLocaleString("es-CR")}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Fecha de Inicio:</span>
                    <span>{subasta?.fecha_inicio}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Fecha de Cierre:</span>
                    <span>{subasta?.fecha_cierre}</span>
                </div>
            </div>

            {!confirm ? (
                <div className="flex justify-between gap-4">
                    <Button type="button" variant="default"
                        className="flex items-center gap-2 bg-accent text-white"
                        onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4" /> Regresar
                    </Button>
                    <Button
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setConfirm(true)}>
                        <Send className="w-4 h-4" /> Publicar Subasta
                    </Button>
                </div>
            ) : (
                <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-300">
                    <p className="text-sm font-medium text-yellow-800 mb-4">
                        ¿Estás seguro? Una vez publicada, la subasta será visible para todos los usuarios.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setConfirm(false)}>
                            Volver
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handlePublicar}>
                            Confirmar publicación
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}