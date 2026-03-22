import { useEffect, useState } from "react"; // ❌ Eliminar dataForm del import
import { useForm, Controller, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import SubastaService from "../../services/SubastaService";
import EstadoSubastaServicio from "../../services/EstadoSubastaService";
import LegoService from "@/services/LegoService";
import UsuariosService from "@/services/UsuariosService";
import { CustomSelect } from "../ui/custom/custom-select";

export function CreateSubasta() {
  const navigate = useNavigate();

  const [dataEstado, setDataEstado] = useState([]);
  const [dataLego, setDataLego] = useState([]);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [loadingLegos, setLoadingLegos] = useState(false);
  const [error, setError] = useState("");

  const subastaSchema = yup.object({
    id_usuario: yup.number().typeError("Seleccione un usuario").required("El usuario es requerido"),
    id_lego: yup.number().typeError("Seleccione un lego").required("El lego es requerido"),
    id_estado: yup.number().typeError("Seleccione un estado").required("El estado es requerido"),
    precio_inicial: yup
      .number()
      .typeError("Ingrese un precio válido")
      .required("El precio inicial es requerido")
      .moreThan(0, "El precio inicial debe ser mayor a 0"),
    incremento_minimo: yup
      .number()
      .typeError("Ingrese un incremento válido")
      .required("El incremento mínimo es requerido")
      .moreThan(0, "El incremento mínimo debe ser mayor a 0"),
    fecha_inicio: yup.string().required("La fecha de inicio es requerida"),
    fecha_fin: yup.string().required("La fecha de fin es requerida"),
  });

  // ✅ defaultValues correctos — valores vacíos iniciales, NO el payload
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      id_usuario: "",
      id_lego: "",
      id_estado: "",
      precio_inicial: "",
      incremento_minimo: "",
      fecha_inicio: "",
      fecha_fin: "",
    },
    resolver: yupResolver(subastaSchema),
  });

  const selectedUsuario = useWatch({ control, name: "id_usuario" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estadoRes, usuarioRes] = await Promise.all([
          EstadoSubastaServicio.getAll(),
          UsuariosService.getByRol(),
        ]);
        setDataEstado(estadoRes.data?.data ?? []);
        setDataUsuario(usuarioRes.data?.data ?? []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedUsuario) {
      setDataLego([]);
      setValue("id_lego", "");
      return;
    }

    const fetchLegos = async () => {
      setLoadingLegos(true);
      try {
        const res = await LegoService.getByVendedor(selectedUsuario);
        const data = res.data?.data ?? [];
        const unicos = [...new Map(data.map((item) => [item.id, item])).values()];
        setDataLego(unicos);
        setValue("id_lego", "");
      } catch (err) {
        console.error("Error cargando legos:", err);
        setDataLego([]);
        toast.error("Error al cargar los legos del vendedor");
      } finally {
        setLoadingLegos(false);
      }
    };

    fetchLegos();
  }, [selectedUsuario, setValue]);

  // ✅ onSubmit correcto — el payload se construye aquí con dataForm
  const onSubmit = async (dataForm) => {
    try {
      const payload = {
        id_lego: dataForm.id_lego,
        id_creador: dataForm.id_usuario,
        fecha_inicio: dataForm.fecha_inicio.replace("T", " ") + ":00",
        fecha_cierre: dataForm.fecha_fin.replace("T", " ") + ":00",
        precio_base: dataForm.precio_inicial,
        incremento_minimo: dataForm.incremento_minimo,
        id_estado: dataForm.id_estado,
      };

      console.log("📦 Payload enviado:", JSON.stringify(payload, null, 2));

      const response = await SubastaService.create(payload);
      if (response.data) {
        toast.success("Subasta creada exitosamente", { duration: 5000 });
        navigate("/lego/subasta");
      }
    } catch (err) {
      console.error("❌ Error completo:", JSON.stringify(err.response?.data));
      toast.error(err.response?.data?.message || "Error al crear la subasta");
    }
  };

  const onError = (errs) => console.log("Errores de validación:", errs);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Crear Subasta</h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">

        {/* Usuario */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Usuario</Label>
          <Controller name="id_usuario" control={control} render={({ field }) => (
            <CustomSelect field={field} data={dataUsuario} label="Seleccione un usuario"
              getOptionLabel={(item) => item.nombre_completo}
              getOptionValue={(item) => item.id}
              error={errors.id_usuario?.message} />
          )} />
          {errors.id_usuario && <p className="text-sm text-red-500">{errors.id_usuario.message}</p>}
        </div>

        {/* Lego */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Lego</Label>
          <Controller name="id_lego" control={control} render={({ field }) => (
            <CustomSelect
              field={field}
              data={dataLego}
              label={
                !selectedUsuario ? "Primero seleccione un usuario"
                  : loadingLegos ? "Cargando legos..."
                    : dataLego.length === 0 ? "Sin legos disponibles"
                      : "Seleccione un lego"
              }
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              error={errors.id_lego?.message}
              disabled={!selectedUsuario || loadingLegos}
            />
          )} />
          {errors.id_lego && <p className="text-sm text-red-500">{errors.id_lego.message}</p>}
        </div>

        {/* Estado */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Estado</Label>
          <Controller name="id_estado" control={control} render={({ field }) => (
            <CustomSelect field={field} data={dataEstado} label="Seleccione un estado"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              error={errors.id_estado?.message} />
          )} />
          {errors.id_estado && <p className="text-sm text-red-500">{errors.id_estado.message}</p>}
        </div>

        {/* Precio Inicial */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="precio_inicial">Precio Inicial</Label>
          <Controller name="precio_inicial" control={control} render={({ field }) => (
            <Input {...field} id="precio_inicial" type="number" min="1" placeholder="Ingrese el precio inicial" />
          )} />
          {errors.precio_inicial && <p className="text-sm text-red-500">{errors.precio_inicial.message}</p>}
        </div>

        {/* Incremento Mínimo */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="incremento_minimo">Incremento Mínimo</Label>
          <Controller name="incremento_minimo" control={control} render={({ field }) => (
            <Input {...field} id="incremento_minimo" type="number" min="1" placeholder="Ingrese el incremento mínimo" />
          )} />
          {errors.incremento_minimo && <p className="text-sm text-red-500">{errors.incremento_minimo.message}</p>}
        </div>

        {/* Fecha Inicio */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="fecha_inicio">Fecha de Inicio</Label>
          <Controller name="fecha_inicio" control={control} render={({ field }) => (
            <Input {...field} id="fecha_inicio" type="datetime-local" />
          )} />
          {errors.fecha_inicio && <p className="text-sm text-red-500">{errors.fecha_inicio.message}</p>}
        </div>

        {/* Fecha Fin */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="fecha_fin">Fecha de Fin</Label>
          <Controller name="fecha_fin" control={control} render={({ field }) => (
            <Input {...field} id="fecha_fin" type="datetime-local" />
          )} />
          {errors.fecha_fin && <p className="text-sm text-red-500">{errors.fecha_fin.message}</p>}
        </div>

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