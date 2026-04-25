import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Save, ArrowLeft, Plus, X } from "lucide-react";

import LegoService from "../../services/LegoService";
import ImageService from "../../services/ImageService";
import CategoriaLegoService from "@/services/CategoriaLegoService";
import CondicionLegoService from "@/services/CondicionLegoService";
import EstadoLegoService from "@/services/EstadoLegoService";

import { CustomSelect } from "../ui/custom/custom-select";
import { useUser } from "@/hooks/useUser";

export function CreateLego() {
  const navigate   = useNavigate();
  const { user }   = useUser();

  const [dataCategioria, setDataCategoria] = useState([]);
  const [dataCondicion,  setDataCondicion]  = useState([]);
  const [dataEstado,     setDataEstado]     = useState([]);
  const [files,          setFiles]          = useState([]);
  const [fileURLs,       setFileURLs]       = useState([]);
  const [error,          setError]          = useState("");

  const legoSchema = yup.object({
    nombre:       yup.string().required("El nombre es requerido").min(2, "Mínimo 2 caracteres"),
    descripcion:  yup.string().required("La descripción es requerida"),
    id_vendedor:  yup.number().typeError("Vendedor requerido").required("El vendedor es requerido"),
    id_condicion: yup.number().typeError("Seleccione una condición").required("La condición es requerida"),
    id_estado:    yup.number().typeError("Seleccione un estado").required("El estado es requerido"),
    id_categoria: yup.number().typeError("Seleccione una categoría").required("La categoría es requerida"),
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre:       "",
      descripcion:  "",
      id_vendedor:  user?.id ? Number(user.id) : "",
      id_condicion: "",
      id_estado:    "",
      id_categoria: "",
    },
    resolver: yupResolver(legoSchema),
  });

  const handleChangeImage = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    setFiles(prev    => [...prev,    ...selectedFiles]);
    setFileURLs(prev => [...prev,    ...selectedFiles.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setFiles(prev    => prev.filter((_, i) => i !== index));
    setFileURLs(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [CategoriaRes, CondicionRes, EstadoRes] = await Promise.all([
          CategoriaLegoService.getAll(),
          CondicionLegoService.getAll(),
          EstadoLegoService.getAll(),
        ]);
        setDataCategoria(CategoriaRes.data?.data ?? []);
        setDataCondicion(CondicionRes.data?.data ?? []);
        setDataEstado(EstadoRes.data?.data     ?? []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (dataForm) => {
    if (files.length === 0) {
      toast.error("Debes seleccionar al menos una imagen");
      return;
    }
    try {
      const response = await LegoService.create({ ...dataForm, imagenes: [] });
      const legoId   = response.data?.data?.id;
      if (!legoId) throw new Error("No se obtuvo el ID del lego creado");

      for (const file of files) {
        const formData = new FormData();
        formData.append("file",    file);
        formData.append("lego_id", legoId);
        formData.append("nombre",  dataForm.nombre);
        await ImageService.createImage(formData);
      }

      toast.success("Lego creado exitosamente", { duration: 5000 });
      reset();
      setFiles([]);
      setFileURLs([]);
      navigate("/table");
    } catch (err) {
      console.error(err);
      toast.error("Error al crear lego");
    }
  };

  const onError = (errs) => console.log("Errores de validación:", errs);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Crear Lego</h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">

        {/* Nombre */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="nombre">Nombre</Label>
          <Controller name="nombre" control={control} render={({ field }) =>
            <Input {...field} id="nombre" placeholder="Ingrese el Nombre" />
          } />
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
        </div>

        {/* Descripción */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="descripcion">Descripción</Label>
          <Controller name="descripcion" control={control} render={({ field }) =>
            <Input {...field} id="descripcion" placeholder="Ingrese la Descripción" />
          } />
          {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion.message}</p>}
        </div>

        {/* Vendedor — nombre fijo del usuario logueado, sin combobox */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Vendedor</Label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-muted text-sm">
            <span className="font-medium text-foreground">
              {user?.nombre_completo ?? user?.email ?? "Usuario actual"}
            </span>
            <span className="text-xs text-muted-foreground ml-1">(tú)</span>
          </div>
          {/* Campo oculto para que react-hook-form tenga el valor */}
          <Controller
            name="id_vendedor"
            control={control}
            render={({ field }) => (
              <input type="hidden" {...field} value={user?.id ?? ""} />
            )}
          />
          {errors.id_vendedor && <p className="text-sm text-red-500">{errors.id_vendedor.message}</p>}
        </div>

        {/* Categoría */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Categoría</Label>
          <Controller name="id_categoria" control={control} render={({ field }) =>
            <CustomSelect field={field} data={dataCategioria} label="Categoría"
              getOptionLabel={(item) => item.nombre} getOptionValue={(item) => item.id}
              error={errors.id_categoria?.message} />
          } />
        </div>

        {/* Estado */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Estado</Label>
          <Controller name="id_estado" control={control} render={({ field }) =>
            <CustomSelect field={field} data={dataEstado} label="Estado"
              getOptionLabel={(item) => item.nombre} getOptionValue={(item) => item.id}
              error={errors.id_estado?.message} />
          } />
        </div>

        {/* Condición */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Condición</Label>
          <Controller name="id_condicion" control={control} render={({ field }) =>
            <CustomSelect field={field} data={dataCondicion} label="Condición"
              getOptionLabel={(item) => item.nombre} getOptionValue={(item) => item.id}
              error={errors.id_condicion?.message} />
          } />
        </div>

        {/* Imágenes */}
        <div className="mb-6">
          <Label className="block mb-1 text-sm font-medium">Imágenes</Label>
          <div className="flex flex-wrap gap-3 mb-3">
            {fileURLs.map((url, index) => (
              <div key={index} className="relative w-28 h-28">
                <img src={url} alt={`preview-${index}`} className="w-full h-full object-cover rounded-lg border border-muted" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div
              className="w-28 h-28 border-2 border-dashed border-muted/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => document.getElementById("image").click()}
            >
              <Plus className="w-6 h-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mt-1">Agregar</p>
            </div>
          </div>
          <input type="file" id="image" className="hidden" accept="image/*" multiple onChange={handleChangeImage} />
        </div>

        {/* Botones */}
        <div className="flex justify-between gap-4 mt-6">
          <Button type="button" variant="default" className="flex items-center gap-2 bg-accent text-white" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Regresar
          </Button>
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4" /> Guardar
          </Button>
        </div>

      </form>
    </Card>
  );
}