import { CorredorResponse } from "./corredor";

export interface CorredorGrupoResponse{
    id: string;
    corredor: CorredorResponse;
    grupo: string;
    capitan: boolean;
    estado: boolean;
    fechaCreacion: string;
    fechaModificacion: string;
}
