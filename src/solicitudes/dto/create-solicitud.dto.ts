export class CreateSolicitudDto {
  descripcion: string;
  personaId: number;
  detalles: {
    materialId: number;
    cantidad: number;
  }[];
}
