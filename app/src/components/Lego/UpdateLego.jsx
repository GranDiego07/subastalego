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
import LegoService from "@/services/LegoService";
import CategoriaService from "@/services/CategoriaLegoService";
import CondicionService from "@/services/CondicionLegoService";
import EstadoService from "@/services/EstadoLegoService";
import { CustomSelect } from "../ui/custom/custom-select";

export function UpdateLego() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lego, setLego] = useState(null);
  const [dataCategorias, setDataCategorias] = useState([]);
  const [dataCondiciones, setDataCondiciones] = useState([]);
  const [dataEstados, setDataEstados] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const legoSchema = yup.object({
    nombre: yup.string().required("El nombre es requerido").min(2, "Mínimo 2 caracteres"),
    descripcion: yup.string().required("La descripción es requerida").min(20, "La descripción debe tener mínimo 20 caracteres"),
    id_condicion: yup.number().typeError("Seleccione una condición").required("La condición es requerida"),
    id_estado: yup.number().typeError("Seleccione un estado").required("El estado es requerido"),
    id_categoria: yup.number().typeError("Seleccione una categoría").required("La categoría es requerida"),
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      id_condicion: "",
      id_estado: "",
      id_categoria: "",
    },
    resolver: yupResolver(legoSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [legoRes, catRes, condRes, estadoRes] = await Promise.all([
          LegoService.getByDetalle(id),
          CategoriaService.getAll(),
          CondicionService.getAll(),
          EstadoService.getAll(),
        ]);

        const data = legoRes.data?.data?.[0] ?? legoRes.data?.[0] ?? legoRes.data;

        if (data.en_subasta_activa) {
          toast.error("No se puede editar un lego que está en subasta activa");
          navigate("/lego/table");
          return;
        }

        setLego(data);
        setDataCategorias(catRes.data?.data ?? []);
        setDataCondiciones(condRes.data?.data ?? []);
        setDataEstados(estadoRes.data?.data ?? []);

        reset({
          nombre: data.nombre,
          descripcion: data.descripcion,
          id_condicion: data.id_condicion,
          id_estado: data.id_estado,
          id_categoria: data.id_categoria,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, reset]);

  const onSubmit = async (dataForm) => {
    try {
      const payload = { id, ...dataForm };
      const response = await LegoService.update(payload);
      if (response.data) {
        toast.success("¡Lego actualizado correctamente!", { duration: 2000 });
        setTimeout(() => navigate("/lego/table"), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el lego");
    }
  };

  if (loading) return <p className="p-10 text-center">Cargando lego...</p>;
  if (error) return <p className="text-red-600 p-4">{error}</p>;

  const nombreVendedor =
    lego?.vendedor ?? `Usuario #${lego?.id_vendedor}`
    lego?.nombre_vendedor ??
    lego?.vendedor?.nombre ??
    lego?.usuario?.nombre ??
    `Usuario #${lego?.id_vendedor}`;

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editar Lego</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="nombre">Nombre</Label>
          <Controller name="nombre" control={control} render={({ field }) => (
            <Input {...field} id="nombre" placeholder="Nombre del set" />
          )} />
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
        </div>

        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="descripcion">Descripción</Label>
          <Controller name="descripcion" control={control} render={({ field }) => (
            <textarea
              {...field}
              id="descripcion"
              placeholder="Descripción (mínimo 20 caracteres)"
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          )} />
          {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion.message}</p>}
        </div>

        <div>
          <Label className="block mb-1 text-sm font-medium">Condición</Label>
          <Controller name="id_condicion" control={control} render={({ field }) => (
            <CustomSelect
              field={field}
              data={dataCondiciones}
              label="Seleccione una condición"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              error={errors.id_condicion?.message}
            />
          )} />
          {errors.id_condicion && <p className="text-sm text-red-500">{errors.id_condicion.message}</p>}
        </div>

        <div>
          <Label className="block mb-1 text-sm font-medium">Estado</Label>
          <Controller name="id_estado" control={control} render={({ field }) => (
            <CustomSelect
              field={field}
              data={dataEstados}
              label="Seleccione un estado"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              error={errors.id_estado?.message}
            />
          )} />
          {errors.id_estado && <p className="text-sm text-red-500">{errors.id_estado.message}</p>}
        </div>

        <div>
          <Label className="block mb-1 text-sm font-medium">Categoría</Label>
          <Controller name="id_categoria" control={control} render={({ field }) => (
            <CustomSelect
              field={field}
              data={dataCategorias}
              label="Seleccione una categoría"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              error={errors.id_categoria?.message}
            />
          )} />
          {errors.id_categoria && <p className="text-sm text-red-500">{errors.id_categoria.message}</p>}
        </div>

        {lego && (
          <div>
            <Label className="block mb-1 text-sm font-medium">Vendedor</Label>
            <Input value={nombreVendedor} disabled className="bg-muted text-muted-foreground" />
          </div>
        )}

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