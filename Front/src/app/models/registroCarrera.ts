import { CarreraResponse } from "./carrera";
import { CorredorResponse } from "./corredor";
import { GrupoResponse } from "./grupo";

export interface RegistroCarreraRequest{
    carreraId: string;
    corredorId: string;
    grupoId?: string;
}
export interface RegistroCarreraResponseCreateGrupo {
    listadoRegistros: RegistroCarreraResponse[];
  }
  
export interface RegistroCarreraResponse{
    id: string;
    carrera: CarreraResponse;
    identificacion: string;
    numeroRegistro: number;
    fechaRegistro: string;
    corredor: CorredorResponse;
    grupo: GrupoResponse;
    estado: boolean;
    fechaCreacion: string;
    fechaModificacion: string;
}
