export interface CreateCarreraRequest{
    nombre: string;
    ubicacion: string;
    responsable: string;
    identificacion: string;
    fechaCarrera: Date;
    distancia: string;
    fechaCierreInscripciones: Date;
    cupoMaximo: number;
}

export interface CarreraResponse{
    id: string;
    nombre: string;
    ubicacion: string;
    responsable: string;
    identificacion: string;
    estado: boolean;
    estadoGrupos: boolean;
    fechaCarrera: Date;
    fechaCreacion: Date;
    fechaModificacion: Date;
    colorDeFondo?: string;
    distancia: string;
    cupoMaximo: number;
    carreraPadreId: string;
    edadMinima: string;
    fechaCierreInscripciones: Date;
    edadMaxima: string;
    identificacionCorta: string;
    numeroParticipantes: number;
    precio: number;
}
