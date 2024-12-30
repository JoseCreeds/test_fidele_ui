// Interface pour représenter une course
export interface StatscoursesType {
    id: number;
    type_course: string;
    passenger: string;
    passengerPhone: string;
    email: string;
    lieuDepart: string;
    lieuArrive: string;
    distance: number;
    requestDate: string;
    statut: string;
    conducteur: string;
    date_depart: string;
    date_arrivee: string;
    prix_asso : number;
    prix_client: number;
    commission: number;
    assurance: number;
    planifier?: string;
    whatsappLink?: string;
  }