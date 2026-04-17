
export interface GrupoResponse{
    id: string;
    nombre: string;
    cantidadCorredor: number;
    estado: boolean;
    fechaCreacion: string;
    fechaModificacion: string;
}
export interface CreateGrupoRequest{
    nombre: string;
    cantidadCorredor: number;
    corredorCreador:string;
    fechaCreacion: Date;
}