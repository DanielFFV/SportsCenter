import { PersonaResponse } from "./persona";

export interface CorredorResponse{
    id: string;
    persona: PersonaResponse;
    dorsal: number;
    estado: boolean;
    fechaCreacion: string;
    fechaModificacion: string;
}

export interface CorredorRequest{
    personaId: string;
    corredorResponsableId: string;    
}