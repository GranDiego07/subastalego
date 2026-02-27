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
import { Edit, Plus, Trash2 } from "lucide-react";
import PujasService from "@/services/PujasService";

// 1. Columnas alineadas con tu SQL
const pujaColumns = [
    { key: "id", label: "ID" },
    { key: "NombreUsuario", label: "Usuario" },
    { key: "NombreLego", label: "Lego" }, // Nueva columna
    { key: "monto", label: "Monto Ofertado" },
    { key: "fecha_hora", label: "Fecha y Hora" },
    { key: "acciones", label: "Acciones" },
];

export default function TablePujas() {
    const [pujas, setPujas] = useState([]); // Cambiado 'users' a 'pujas' por claridad
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PujasService.getPujasDetalle();
                let data = response.data;

                // Manejo de la respuesta del backend
                let dataArray = [];
                if (Array.isArray(data)) {
                    dataArray = data;
                } else if (data && Array.isArray(data.data)) {
                    dataArray = data.data;
                }

                setPujas(dataArray);
            } catch (err) {
                console.error("Error al cargar pujas:", err);
                setError("Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center text-white mt-16">⏳ Cargando pujas...</div>;
    if (error) return <div className="p-10 text-center text-red-600 mt-16">⚠️ {error}</div>;

    return (
        <div className="container mx-auto py-8 mt-12">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-white">Lista de Pujas</h1>
                <Link to="/lego/pujas/create">
                    <Button variant="outline" size="icon" className="text-primary">
                        <Plus className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-gray-700 bg-gray-900 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-800">
                        <TableRow>
                            {pujaColumns.map((col) => (
                                <TableHead key={col.key} className="text-gray-200">{col.label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pujas.length > 0 ? (
                            pujas.map((puja, index) => (
                                <TableRow key={index} className="border-gray-700 hover:bg-gray-800">
                                    {/* ID */}
                                    <TableCell className="font-medium text-white">
                                        {puja.id}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {puja.NombreUsuario}
                                    </TableCell>
                                    {/* Nueva celda para el nombre del Lego */}
                                    <TableCell className="text-yellow-400">
                                        {puja.NombreLego}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        ${puja.monto}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {puja.fecha_hora}
                                    </TableCell>
                                    {/* Acciones */}
                                    <TableCell className="flex gap-2">
                                        <Link to={`/lego/pujas/edit/${puja.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4 text-blue-400" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                    📭 No hay pujas registradas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}