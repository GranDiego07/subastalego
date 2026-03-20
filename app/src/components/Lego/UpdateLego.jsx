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
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";
import LegoService from "@/services/LegoService";
import CategoriaService from "@/services/CategoriaService";
import CondicionService from "@/services/CondicionService";
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";

export function EditLego() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lego, setLego] = useState(null);
  const [dataCategorias, setDataCategorias] = useState([]);
  const [dataCondiciones, setDataCondiciones] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const legoSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre es requerido")
      .min(2, "Mínimo 2 caracteres"),
    descripcion: yup
      .string()
      .required("La descripción es requerida")
      .min(20, "La descripción debe tener mínimo 20 caracteres"),
    id_condicion: yup
      .number()
      .typeError("Seleccione una condición")
      .required("La condición es requerida"),
    categorias: yup
      .array()
      .of(yup.number())
      .min(1, "Seleccione al menos una categoría"),
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      id_condicion: "",
      categorias: [],
    },
    resolver: yupResolver(legoSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [legoRes, catRes, condRes] = await Promise.all([
          LegoService.getById(id),
          CategoriaService.getAll(),
          CondicionService.getAll(),
        ]);

        const data = legoRes.data?.data ?? legoRes.data;

        // Validar que no esté en subasta activa
        if (data.en_subasta_activa) {
          toast.error("No se puede editar un lego en subasta activa");
          navigate("/lego/table");
          return;
        }

        setLego(data);
        setDataCategorias(catRes.data?.data ?? []);
        setDataCondiciones(condRes.data?.data ?? []);

        reset({
          nombre: data.nombre,
          descripcion: data.descripcion,
          id_condicion: data.id_condicion,
          // Ajusta según cómo te devuelve las categorías tu API
          categorias: data.categorias?.map((c) => c.id) ?? [],
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
        toast.success("Lego actualizado correctamente", { duration: 4000 });
        navigate("/lego/table");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el lego");
    }
  };

  if (loading) return <p className="p-10 text-center">Cargando lego...</p>;
  if (error) return <p className="text-red-600 p-4">{error}</p>;

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editar Lego</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Nombre */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="nombre">Nombre</Label>
          <Controller name="nombre" control={control} render={({ field }) => (
            <Input {...field} id="nombre" placeholder="Nombre del set" />
          )} />
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
        </div>

        {/* Descripción */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="descripcion">Descripción</Label>
          <Controller name="descripcion" control={control} render={({ field }) => (
            <Textarea {...field} id="descripcion" placeholder="Descripción (mínimo 20 caracteres)" rows={4} />
          )} />
          {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion.message}</p>}
        </div>

        {/* Condición */}
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

        {/* Categorías */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Categorías</Label>
          <Controller name="categorias" control={control} render={({ field }) => (
            <CustomMultiSelect
              field={field}
              data={dataCategorias}
              label="Categorías"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              placeholder="Seleccione categorías"
              error={errors.categorias?.message}
            />
          )} />
          {errors.categorias && <p className="text-sm text-red-500">{errors.categorias.message}</p>}
        </div>

        {/* Usuario vendedor (no editable) */}
        {lego && (
          <div>
            <Label className="block mb-1 text-sm font-medium">Vendedor</Label>
            <Input
              value={lego.vendedor_nombre ?? lego.nombre_vendedor ?? `Usuario #${lego.id_vendedor}`}
              disabled
              className="bg-muted text-muted-foreground"
            />
          </div>
        )}

        {/* Botones */}
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