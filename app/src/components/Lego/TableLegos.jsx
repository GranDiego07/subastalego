import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Plus, Trash2, ArrowLeft } from "lucide-react";
import LegoService from "@/services/LegoService";

// Columnas ajustadas a los campos reales de la API
const legoColumns = [
    { key: "nombre", label: "Nombre del Set" },
    { key: "categoria", label: "Categoría" },
    { key: "condicion", label: "Condición" },
    { key: "estado", label: "Estado" },
    { key: "acciones", label: "Acciones" },
];

export default function TableLegos() {
    const [legos, setLegos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await LegoService.getAll();
                console.log("Respuesta completa getAll:", response);

                const result = response.data;

                let dataArray = [];
                if (result?.success) {
                    dataArray = result.data || [];
                } else if (Array.isArray(result)) {
                    dataArray = result;
                }

                console.log("Legos recibidos:", dataArray.length, "items");
                if (dataArray.length > 0) {
                    console.log("Primer lego:", dataArray[0]);
                }

                setLegos(dataArray);
            } catch (err) {
                console.error("Error al cargar legos:", err);
                setError(err.message || "Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center">Cargando inventario...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Inventario de Legos</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="icon" className="text-primary">
                                <Link to="/lego/create">
                                    <Plus className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Agregar nuevo set</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-slate-100">
                        <TableRow>
                            {legoColumns.map((col) => (
                                <TableHead key={col.key} className="font-semibold text-black">
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {legos.length > 0 ? (
                            legos.map((lego) => (
                                <TableRow key={lego.nombre}>
                                    <TableCell className="font-medium">{lego.nombre}</TableCell>

                                    {/* Categoría - ahora muestra el nombre */}
                                    <TableCell>
                                        {lego.categoria_nombre || lego.id_categoria || "—"}
                                    </TableCell>

                                    {/* Condición */}
                                    <TableCell>
                                        {lego.condicion_nombre || lego.id_condicion || "—"}
                                    </TableCell>

                                    {/* Estado */}
                                    <TableCell>
                                        {lego.estado_nombre || lego.id_estado || "—"}
                                    </TableCell>

                                    <TableCell className="flex justify-start items-center gap-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link to={`/lego/edit/${lego.id}`}>
                                                            <Edit className="h-4 w-4 text-primary" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Actualizar</TooltipContent>
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
                                <TableCell colSpan={legoColumns.length} className="text-center py-10 text-gray-500">
                                    No hay legos registrados.
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
                <Link to="/lego">
                    <ArrowLeft className="w-4 h-4" />
                    Regresar al catálogo
                </Link>
            </Button>
        </div>
    );
}