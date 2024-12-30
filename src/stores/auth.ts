import { defineStore } from 'pinia';
import { useRouter } from 'vue-router'; // Composition API for router
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import { ref, computed } from 'vue'; // Import Composition API utilities
import { useToast } from 'vue-toastification';
import { customToastSuccess, customToastInfo, customToastError } from '@/utils/customToast';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter(); // Utilisation de useRouter pour la navigation
    const user = ref(JSON.parse(localStorage.getItem('user') as string) || null); // État utilisateur
    const token = ref<string | null>(null); // Jeton d'authentification
    const isAuthenticated = ref(false); // État d'authentification
    const returnUrl = ref<string | null>(null); // URL de redirection après authentification

    const login = async (email: string, password: string) => {
        try {
            const responseUser = await fetchWrapper.post(`${baseUrl}/login`, { email, password });
            setUserAndToken(responseUser);
        } catch (error) {
            console.log(error);
            throw new Error('Erreur de connexion');
        }
    };

    const register = async (data: any) => {
        try {
            const responseUser = await fetchWrapper.post(`${baseUrl}/register`, data);
            customToastSuccess('Compte créé avec succès');
        } catch (error) {
            console.log(error);
            throw new Error('Une erreur est survenue');
        }
    };

    // Action pour gérer la déconnexion de l'utilisateur
    const logout = () => {
        user.value = null;
        token.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('user');
        sessionStorage.removeItem('sharedAuthToken');
        router.push('/'); // Redirection vers la page d'accueil
    };

    // Vérifie si l'utilisateur est authentifié
    const checkAuth = () => {
        const sharedToken = sessionStorage.getItem('sharedAuthToken');
        if (sharedToken) {
            setUserAndToken({ tokenSalt: sharedToken });
        } else if (token.value && !isTokenExpired(token.value)) {
            isAuthenticated.value = true;
        } else {
            logout();
        }
    };

    // Fonction utilitaire pour définir l'utilisateur et son jeton d'authentification
    const setUserAndToken = (userResponse: any) => {
        user.value = userResponse;
        token.value = userResponse.tokenSalt;
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(userResponse));
        // console.log('UserInfos',localStorage.getItem('user'))
        if (JSON.parse(localStorage.getItem('user') || '[]').user?.role === 'client') {
            //logout()
            router.push(returnUrl.value || '/');
        }

        if (JSON.parse(localStorage.getItem('user') || '[]').user?.role === 'vendor') {
            //logout()
            router.push(returnUrl.value || '/admin/product'); // Redirection vers la page de destination
        }
    };

    // Placeholder pour vérifier l'expiration du token
    const isTokenExpired = (token: string): boolean => {
        // Implémente ici la logique pour vérifier si le token est expiré
        return false; // Placeholder
    };

    // Rendre les propriétés accessibles depuis d'autres composants
    return {
        user: computed(() => user.value), // Accès à l'utilisateur
        token: computed(() => token.value), // Accès au jeton
        isAuthenticated: computed(() => isAuthenticated.value), // État d'authentification
        login,
        register,
        logout,
        checkAuth
    };
});
