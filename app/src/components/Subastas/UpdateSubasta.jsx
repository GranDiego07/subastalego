import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import SubastaService from "@/services/SubastaService";

export function UpdateSubasta() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const subastaSchema = yup.object({
        precio_base: yup
            .number()
            .typeError("Ingrese un precio válido")
            .required("El precio base es requerido")
            .moreThan(0, "El precio base debe ser mayor a 0"),
        incremento_minimo: yup
            .number()
            .typeError("Ingrese un incremento válido")
            .required("El incremento mínimo es requerido")
            .moreThan(0, "El incremento mínimo debe ser mayor a 0"),
        fecha_inicio: yup.string().required("La fecha de inicio es requerida"),
        fecha_cierre: yup
            .string()
            .required("La fecha de cierre es requerida")
            .test(
                "fecha-cierre-mayor",
                "La fecha de cierre debe ser mayor a la fecha de inicio",
                function (value) {
                    const { fecha_inicio } = this.parent;
                    if (!fecha_inicio || !value) return true;
                    return new Date(value) > new Date(fecha_inicio);
                }
            ),
    });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            precio_base: "",
            incremento_minimo: "",
            fecha_inicio: "",
            fecha_cierre: "",
        },
        resolver: yupResolver(subastaSchema),
    });

    useEffect(() => {
        const fetchSubasta = async () => {
            try {
                const res = await SubastaService.getById(id);
                const subasta = res.data?.data ?? res.data;

                const ahora = new Date();
                const fechaInicio = new Date(subasta.fecha_inicio);

                if (fechaInicio <= ahora) {
                    toast.error("No se puede editar una subasta que ya inició");
                    navigate("/lego/subasta");
                    return;
                }

                if (subasta.cantidad_pujas > 0) {
                    toast.error("No se puede editar una subasta que tiene pujas");
                    navigate("/lego/subasta");
                    return;
                }

                reset({
                    precio_base:       subasta.precio_base,
                    incremento_minimo: subasta.incremento_minimo,
                    fecha_inicio:      subasta.fecha_inicio?.replace(" ", "T").slice(0, 16),
                    fecha_cierre:      subasta.fecha_cierre?.replace(" ", "T").slice(0, 16),
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSubasta();
    }, [id, navigate, reset]);

    const onSubmit = async (dataForm) => {
        try {
            const payload = {
                id,
                precio_base:       dataForm.precio_base,
                incremento_minimo: dataForm.incremento_minimo,
                fecha_inicio:      dataForm.fecha_inicio.replace("T", " "),
                fecha_cierre:      dataForm.fecha_cierre.replace("T", " "),
            };

            const response = await SubastaService.update(payload);

            if (response.data) {
                toast.success("¡Subasta actualizada correctamente!", { duration: 2000 });
                setTimeout(() => navigate("/lego/subasta"), 2000);
            }
        } catch (err) {
            toast.error("Error al actualizar la subasta");
        }
    };

    if (loading) return <p className="p-10 text-center">Cargando subasta...</p>;
    if (error)   return <p className="text-red-600 p-4">{error}</p>;

    return (
        <Card className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Editar Subasta</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div>
                    <Label className="block mb-1 text-sm font-medium" htmlFor="precio_base">Precio Base</Label>
                    <Controller name="precio_base" control={control} render={({ field }) => (
                        <Input {...field} id="precio_base" type="number" min="1" placeholder="Precio base" />
                    )} />
                    {errors.precio_base && <p className="text-sm text-red-500">{errors.precio_base.message}</p>}
                </div>

                <div>
                    <Label className="block mb-1 text-sm font-medium" htmlFor="incremento_minimo">Incremento Mínimo</Label>
                    <Controller name="incremento_minimo" control={control} render={({ field }) => (
                        <Input {...field} id="incremento_minimo" type="number" min="1" placeholder="Incremento mínimo" />
                    )} />
                    {errors.incremento_minimo && <p className="text-sm text-red-500">{errors.incremento_minimo.message}</p>}
                </div>

                <div>
                    <Label className="block mb-1 text-sm font-medium" htmlFor="fecha_inicio">Fecha de Inicio</Label>
                    <Controller name="fecha_inicio" control={control} render={({ field }) => (
                        <Input {...field} id="fecha_inicio" type="datetime-local" />
                    )} />
                    {errors.fecha_inicio && <p className="text-sm text-red-500">{errors.fecha_inicio.message}</p>}
                </div>

                <div>
                    <Label className="block mb-1 text-sm font-medium" htmlFor="fecha_cierre">Fecha de Cierre</Label>
                    <Controller name="fecha_cierre" control={control} render={({ field }) => (
                        <Input {...field} id="fecha_cierre" type="datetime-local" />
                    )} />
                    {errors.fecha_cierre && <p className="text-sm text-red-500">{errors.fecha_cierre.message}</p>}
                </div>

                <div className="flex justify-between gap-4 mt-6">
                    <Button type="button" variant="default" className="flex items-center gap-2 bg-accent text-white" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4" /> Regresar
                    </Button>
                    <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Guardar
                    </Button>
                </div>

            </form>
        </Card>
    );
}