// Types pour les trajets
export interface Trajet {
    id: number;
    itineraire: string;
    conducteur: string;
    depart: string;
    nombrePlace: number;
    prix: string;
    passagers: string;
    date: string;
    status: string;
  }
  
  export interface Vehicule {
    id: number;
    autoMotoName: string;
    autoMotoImmatriculation: string;
    nombreSieges: number;
  }
  
  export interface User {
    id: number;
    firstname: string;
    lastname: string;
    vehicules?: Vehicule[];
  }
  
  export interface PaginationState {
    startValue: number;
    endValue: number;
    totalItems: number;
    itemsPerPage: number;
  }