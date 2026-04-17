import { CorredorResponse } from "./corredor";
import { EstadoSolicitud } from "./estadoSolicitud";
import { GrupoResponse } from "./grupo";

export interface SolicitudGrupo{
    id: string,
    corredor: CorredorResponse,
    grupo:GrupoResponse,
    estadoSolicitud: EstadoSolicitud,
    fechaCreacion: string,
    fechaModificacion: string
}

export interface CreateSolicitudGrupo{
    corredorId:string,
    grupoId:string
}