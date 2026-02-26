import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubastaService from "../../services/SubastaService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";

export function DetailSubasta() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subasta, setSubasta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("ID recibido en DetailSubasta:", id);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await SubastaService.getDetalleSubasta(id);

                // backend puede devolver data o directo el objeto
                const data = response.data?.data ?? response.data;

                setSubasta(data);
            } catch (err) {
                console.error("Error al cargar subasta:", err);
                setError("No se pudo cargar la información de la subasta");
            } finally {
                setLoading(false); // 🔥 CLAVE
            }
        };

        if (id) {
            fetchDetalle();
        } else {
            setError("ID inválido");
            setLoading(false);
        }
    }, [id]);

    if (loading) return <LoadingGrid />;
    if (error) return <ErrorAlert title="Error" message={error} />;
    if (!subasta) return <div className="text-white p-10">No existe la subasta</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">
                {subasta.nombre_lego || subasta.Lego}
            </h1>

            <p>Precio base: ${subasta.precio_base || subasta.Precio}</p>
            <p>Fecha cierre: {subasta.fecha_cierre}</p>

            <button
                onClick={() => navigate(-1)}
                className="mt-6 px-4 py-2 bg-zinc-800 rounded"
            >
                Volver
            </button>
        </div>
    );
}