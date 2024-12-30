import { useAuthStore } from '@/stores/auth';

export const Api = {
    get: (uri: string, p0?: { params?: { page: number; limit: number } }) => request(uri, 'GET'),
    post: (uri: string, body?: any, options?: { headers?: { 'Content-Type'?: string } }) => request(uri, 'POST', body, options),
    put: (uri: string, body?: any) => request(uri, 'PUT', body),
    delete: (uri: string, body?: any) => request(uri, 'DELETE', body)
};

async function request(uri: string, method: string, body?: any, options?: { headers?: { 'Content-Type'?: string } }) {
    const url = `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/${uri.replace(/^\/+/, '')}`;
    const authHeaders = authHeader();

    const headers = new Headers({
        ...authHeaders,
        ...(options?.headers || {})
    });

    if (body && !(body instanceof FormData) && !options?.headers?.['Content-Type']) {
        headers.append('Content-Type', 'application/json');
    }

    const requestOptions: RequestInit = {
        method,
        headers,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    };

    try {
        const response = await fetch(url, requestOptions);
        return await handleResponse(response);
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        return Promise.reject(error);
    }
}

function authHeader() {
    const { user } = useAuthStore();
    const headers: Record<string, string> = {};

    if (user?.myToken) {
        // Vérifiez que le token existe
        headers['Authorization'] = `Bearer ${user.myToken}`;
    }
    return headers;
}

async function handleResponse(response: Response) {
    const text = await response.text();
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
        try {
            const data = text ? JSON.parse(text) : null;

            if (!response.ok) {
                const { user, logout } = useAuthStore();
                if ([401, 403].includes(response.status) && user) {
                    logout();
                }
                const error = (data && data.message) || response.statusText;
                return Promise.reject({ status: response.status, error });
            }

            return { status: response.status, data };
        } catch (error) {
            console.error('Erreur lors du parsing JSON:', error);
            return Promise.reject({ status: response.status, error: 'Erreur lors du parsing de la réponse' });
        }
    } else {
        console.error('Réponse non JSON reçue:', text);
        return Promise.reject({ status: response.status, error: text });
    }
}
