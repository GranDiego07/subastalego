import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Plus, Trash2, ArrowLeft } from "lucide-react";
import SubastaService from "@/services/SubastaService";

const subastaColumns = [
    { key: "nombre", label: "Objeto Subastado" },
    { key: "fecha_inicio", label: "Fecha de Inicio" },
    { key: "fecha_cierre", label: "Fecha Est. de Cierre" },
    { key: "precio_base", label: "Precio Base" },
    { key: "incremento", label: "Incremento Mínimo" },
    { key: "cantidad_pujas", label: "Cantidad de Pujas" },
    { key: "acciones", label: "Acciones" },
];

// Formatea fechas: "2026-12-29 12:00:00" → "29/12/2026 12:00"
const formatFecha = (fecha) => {
    if (!fecha) return "—";
    const d = new Date(fecha.replace(" ", "T"));
    return d.toLocaleString("es-CR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
};

// Formatea moneda
const formatMoneda = (valor) => {
    if (valor == null) return "—";
    return `₡${Number(valor).toLocaleString("es-CR")}`;
};

export default function TableSubastas() {
    const [subastas, setSubastas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await SubastaService.allConDetalle();
                const result = response.data;

                let dataArray = [];
                if (result?.success) {
                    dataArray = result.data || [];
                } else if (Array.isArray(result)) {
                    dataArray = result;
                }

                setSubastas(dataArray);
            } catch (err) {
                console.error("Error al cargar subastas:", err);
                setError(err.message || "Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center">Cargando subastas...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Subastas</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="icon" className="text-primary">
                                <Link to="/lego/subasta/create">
                                    <Plus className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Nueva subasta</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-slate-100">
                        <TableRow>
                            {subastaColumns.map((col) => (
                                <TableHead key={col.key} className="font-semibold text-black">
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subastas.length > 0 ? (
                            subastas.map((subasta) => (
                                <TableRow key={subasta.id}>

                                    {/* Objeto subastado */}
                                    <TableCell className="font-medium">
                                        {subasta.lego_nombre || subasta.nombre || "—"}
                                    </TableCell>

                                    {/* Fecha de inicio */}
                                    <TableCell>{formatFecha(subasta.fecha_inicio)}</TableCell>

                                    {/* Fecha estimada de cierre */}
                                    <TableCell>{formatFecha(subasta.fecha_cierre)}</TableCell>

                                    {/* Precio base */}
                                    <TableCell>{formatMoneda(subasta.precio_base)}</TableCell>

                                    {/* Incremento mínimo */}
                                    <TableCell>{formatMoneda(subasta.incremento_minimo)}</TableCell>

                                    {/* Cantidad de pujas */}
                                    <TableCell>
                                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            {subasta.cantidad_pujas ?? subasta.pujas ?? 0}
                                        </span>
                                    </TableCell>

                                    {/* Acciones */}
                                    <TableCell className="flex justify-start items-center gap-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link to={`/subasta/edit/${subasta.id}`}>
                                                            <Edit className="h-4 w-4 text-primary" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Editar</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Eliminar</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={subastaColumns.length} className="text-center py-10 text-gray-500">
                                    No hay subastas registradas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Button
                asChild
                className="flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-700 mt-6"
            >
                <Link to="/">
                    <ArrowLeft className="w-4 h-4" />
                    Regresar
                </Link>
            </Button>
        </div>
    );
}