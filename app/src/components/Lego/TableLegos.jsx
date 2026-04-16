import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Plus, Trash2, ArrowLeft } from "lucide-react";
import LegoService from "@/services/LegoService";
import toast from "react-hot-toast";

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

    useEffect(() => { fetchLegos(); }, []);

    const fetchLegos = async () => {
        try {
            const response = await LegoService.sinSubasta();
            const result = response.data;
            let dataArray = [];
            if (result?.success) {
                dataArray = result.data || [];
            } else if (Array.isArray(result)) {
                dataArray = result;
            }
            setLegos(dataArray);
        } catch (err) {
            setError(err.message || "Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (lego) => {
        try {
            const res = await LegoService.delete(lego.id);
            const result = res.data;

            if (result?.success === false) {
                toast.error(result.message || "No se puede eliminar este lego");
                return;
            }

            setLegos(prev => prev.filter(l => l.id !== lego.id));
            toast.success("Lego eliminado correctamente");
        } catch (err) {
            const msg = err.response?.data?.message || "Error al eliminar el lego";
            toast.error(msg);
        }
    };


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
                                <TableRow key={lego.id}>

                                    <TableCell className="font-medium">{lego.nombre}</TableCell>

                                    <TableCell>{lego.categoria_nombre || lego.id_categoria || "—"}</TableCell>

                                    <TableCell>{lego.condicion_nombre || lego.id_condicion || "—"}</TableCell>

                                    {/* Badge de estado */}
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${lego.id_estado === 1
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {lego.estado_nombre ?? (lego.id_estado === 1 ? "Activo" : "Inactivo")}
                                        </span>
                                    </TableCell>

                                    <TableCell className="flex justify-start items-center gap-1">

                                        {/* Editar */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link to={`/lego/update/${lego.id}`}>
                                                            <Edit className="h-4 w-4 text-primary" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Actualizar</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {/* Eliminar lógico */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(lego)}
                                                        className="hover:bg-red-100"
                                                    >
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

            <Button asChild className="flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-700 mt-6">
                <Link to="/lego">
                    <ArrowLeft className="w-4 h-4" />
                    Regresar al catálogo
                </Link>
            </Button>
        </div>
    );
}