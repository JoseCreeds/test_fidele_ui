import { useAuthStore } from '@/stores/auth';

// Wrapper pour les appels API HTTP
export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

// Fonction générique pour créer une requête HTTP avec la méthode spécifiée (GET, POST, PUT, DELETE)
function request(method: string) {
    return async (url: string, body?: any) => {
        const requestOptions: RequestInit = {
            method, // Définition de la méthode HTTP (GET, POST, etc.)
            headers: authHeader(url) // Ajout des en-têtes d'authentification si nécessaire
        };

        // Ajoute le body de la requête si fourni (POST, PUT, DELETE)
        if (body) {
            requestOptions.headers = {
                ...requestOptions.headers,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
            };
            requestOptions.body = JSON.stringify(body); // Corps de la requête au format JSON
        }

        try {
            const response = await fetch(url, requestOptions); // Envoi de la requête
            return await handleResponse(response); // Gestion de la réponse
        } catch (error) {
            return Promise.reject(error); // Gère les erreurs de la requête
        }
    };
}

// Fonction pour obtenir les en-têtes d'authentification
function authHeader(url: string): Record<string, string> {
    const authStore = useAuthStore(); // Accès au store d'authentification
    const isLoggedIn = !!authStore.user?.myToken; // Vérifie si l'utilisateur est connecté
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL); // Vérifie si l'URL cible est l'API

    // Crée un objet vide pour les en-têtes
    const headers: Record<string, string> = {};

    // Si l'utilisateur est connecté et qu'il s'agit d'une URL d'API, on ajoute le token dans l'en-tête
    if (isLoggedIn && isApiUrl) {
        headers.Authorization = `Bearer ${authStore.user?.myToken}`;
    }

    return headers; // Retourne uniquement les en-têtes valides
}

// Fonction pour gérer les réponses des requêtes
async function handleResponse(response: Response) {
    const text = await response.text(); // Récupère la réponse sous forme de texte
    const data = text && JSON.parse(text); // Tente de parser la réponse en JSON

    if (!response.ok) {
        // Si la réponse n'est pas 'ok' (code HTTP >= 400)
        const authStore = useAuthStore();
        if ([401, 403].includes(response.status) && authStore.user) {
            // Si l'API retourne 401 ou 403, l'utilisateur est déconnecté automatiquement
            authStore.logout(); // Déconnexion automatique
        }

        // Récupère le message d'erreur s'il existe, sinon utilise le statut de la réponse
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error); // Rejette la promesse avec l'erreur
    }

    // Retourne les données JSON parsées si tout va bien
    return data;
}
