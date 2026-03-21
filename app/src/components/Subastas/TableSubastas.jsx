import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Plus, Trash2, ArrowLeft, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import SubastaService from "@/services/SubastaService";

const subastaColumns = [
    { key: "nombre",         label: "Objeto Subastado"     },
    { key: "fecha_inicio",   label: "Fecha de Inicio"      },
    { key: "fecha_cierre",   label: "Fecha Est. de Cierre" },
    { key: "precio_base",    label: "Precio Base"          },
    { key: "incremento",     label: "Incremento Mínimo"    },
    { key: "cantidad_pujas", label: "Cantidad de Pujas"    },
    { key: "acciones",       label: "Acciones"             },
];

const formatFecha = (fecha) => {
    if (!fecha) return "—";
    const d = new Date(fecha.replace(" ", "T"));
    return d.toLocaleString("es-CR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
};

const formatMoneda = (valor) => {
    if (valor == null) return "—";
    return `₡${Number(valor).toLocaleString("es-CR")}`;
};


export default function TableSubastas() {
    const navigate                          = useNavigate();
    const [subastas, setSubastas]           = useState([]);
    const [error, setError]                 = useState(null);
    const [loading, setLoading]             = useState(true);
    const [modalCancelar, setModalCancelar] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await SubastaService.allConDetalle();
                const result   = response.data;
                let dataArray  = [];
                if (result?.success) {
                    dataArray = result.data || [];
                } else if (Array.isArray(result)) {
                    dataArray = result;
                }
                setSubastas(dataArray);
            } catch (err) {
                setError(err.message || "Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCancelar = async () => {
        try {
            const res    = await SubastaService.cancelar(modalCancelar.id);
            const result = res.data;
            if (result?.success === false) {
                toast.error(result.message);
                return;
            }
            setSubastas(prev => prev.map(s => s.id === modalCancelar.id
                ? { ...s, id_estado: 3, estado_nombre: "cancelada" } : s
            ));
            toast.success("Subasta cancelada correctamente");
        } catch {
            toast.error("Error al cancelar la subasta");
        } finally {
            setModalCancelar(null);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando subastas...</div>;
    if (error)   return <div className="p-10 text-center text-red-600">{error}</div>;

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

                                    <TableCell className="font-medium">
                                        {subasta.lego_nombre || subasta.nombre || "—"}
                                    </TableCell>
                                    <TableCell>{formatFecha(subasta.fecha_inicio)}</TableCell>
                                    <TableCell>{formatFecha(subasta.fecha_cierre)}</TableCell>
                                    <TableCell>{formatMoneda(subasta.precio_base)}</TableCell>
                                    <TableCell>{formatMoneda(subasta.incremento_minimo)}</TableCell>

                                    <TableCell>
                                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            {subasta.cantidad_pujas ?? subasta.pujas ?? 0}
                                        </span>
                                    </TableCell>

                                    <TableCell className="flex justify-start items-center gap-1">

                                        {/* Publicar - solo en borrador (4) */}
                                        {subasta.id_estado == 4 && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon"
                                                            onClick={() => navigate(`/lego/subasta/publicar/${subasta.id}`)}
                                                            className="hover:bg-green-100">
                                                            <Send className="h-4 w-4 text-green-600" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Publicar</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}

                                        {/* Editar - siempre visible */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link to={`/lego/subasta/update/${subasta.id}`}>
                                                            <Edit className="h-4 w-4 text-primary" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Editar</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {/* Cancelar - solo si está activa (1) */}
                                        {subasta.id_estado == 1 && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon"
                                                            onClick={() => setModalCancelar(subasta)}
                                                            className="hover:bg-red-100">
                                                            <X className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Cancelar subasta</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}

                                        {/* Eliminar - siempre visible */}
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

            <Button asChild className="flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-700 mt-6">
                <Link to="/"><ArrowLeft className="w-4 h-4" /> Regresar</Link>
            </Button>

            {/* Modal Cancelar */}
            {modalCancelar && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-lg font-bold mb-2">Cancelar Subasta</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro que deseas cancelar la subasta de <strong>{modalCancelar.lego_nombre}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setModalCancelar(null)}>Cerrar</Button>
                            <Button variant="destructive" onClick={handleCancelar}>Cancelar subasta</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}