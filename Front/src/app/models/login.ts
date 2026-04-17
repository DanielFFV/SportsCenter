import { CorredorResponse } from "./corredor";
import { GrupoResponse } from "./grupo";
import { PersonaResponse } from "./persona";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    persona: PersonaResponse;
    corredor: CorredorResponse;
    grupo: GrupoResponse;
}
