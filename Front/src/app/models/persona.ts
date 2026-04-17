import { TipoDocumentoResponse } from "./TipoDocumento";

export interface PersonaResponse{
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    tipoDocumento: TipoDocumentoResponse;
    email: string;
    estado: boolean;
    fechaNacimiento: string;
    celular: string;
    direccion: string;
    genero: string;
    tallaCamiseta: string;
    eps: string;
    rh: string;
    fechaCreacion: string;
    fechaModificacion: string;
}
export interface CreatePersonaRequest{
    nombre: string;
    apellido: string;
    documento: string;
    tipoDocumento: TipoDocumentoResponse;
    email: string;
    fechaNacimiento: Date;
    celular: string;
    direccion: string;
    genero: string;
    tallaCamiseta: string;
    eps: string;
    rh: string;
}
