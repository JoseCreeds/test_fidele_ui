import { defineStore } from 'pinia';
import { Api } from '@/composables/Api';
import { useToast } from 'vue-toastification';
import { customToastSuccess, customToastInfo, customToastError } from '@/utils/customToast';

export const useAdminStore = defineStore('adminStore', {
    state: () => ({
        isLoading: false,
        confirmOrder: false,
        productList: [],
        orderList: [] as any[],
        clientOrderHistory: [] as any[],
        allProductList: [] as any[],
        baseUrl: `${import.meta.env.VITE_API_URL}`
    }),
    actions: {
        async getProductList() {
            try {
                this.isLoading = true;
                this.productList = [];
                const response = await Api.get('/products');

                if (response?.status === 200) {
                    this.productList = response.data;
                    console.log('Produits récupérés:', this.productList);
                } else {
                    useToast().error('Erreur lors du chargement');
                    console.error("Réponse de l'API avec erreur:", response);
                }

                this.isLoading = false;
            } catch (error: any) {
                this.isLoading = false;
                console.error('Erreur lors du chargement:', error);
                if (error.response) {
                    console.error("Réponse de l'API dans l'erreur:", error.response);
                }
            }
        },

        async addOrUpdateProduct(data: any, isPost: boolean) {
            try {
                const formData = new FormData();

                // Ajout conditionnel des champs uniquement s'ils sont définis
                if (data.libelle) formData.append('libelle', data.libelle);
                if (data.description) formData.append('description', data.description);
                if (data.price) formData.append('price', data.price);
                if (data.stock) formData.append('stock', data.stock);
                if (data.picture !== null && data.picture !== '') formData.append('picture', data.picture);

                if (isPost) {
                    //console.log('Ajout du produit:', data);
                    const response = await Api.post('/product', formData);
                    if (response?.status === 201) {
                        customToastSuccess('Produit ajouté avec succès');
                    }
                } else {
                    console.log('Modification du produit:', data);
                    const response = await Api.put(`/product/${data.id}`, formData);
                    console.log('responseresponse', response);
                    if (response?.status === 200) {
                        customToastSuccess('Produit modifié avec succès');
                    }
                }
            } catch (error: any) {
                // Gestion des erreurs avec messages adaptés
                const errorMessage = error?.response?.data?.message || 'Une erreur est survenue, veuillez réessayer.';
                console.error("Erreur lors de l'opération:", error);
                customToastError(errorMessage);
            }
        },

        async deleteProduct(id: number) {
            try {
                const response = await Api.delete(`/product/${id}`);
                if (response?.status === 200) {
                    customToastSuccess('Produit supprimé avec succès !');
                } else {
                    customToastError('Produit non supprimé !');
                }
            } catch (error: any) {
                customToastError('Une erreur est survenu, Oupss');
            }
        },

        async getOrdersList() {
            try {
                this.isLoading = true;
                this.orderList = [];
                const response = await Api.get('/vendor-orders');

                if (response?.status === 200) {
                    this.orderList = response.data.map((el: any) => ({
                        order_id: el.order_id,
                        client: el.client?.lastname + ' ' + el.client?.firstname,
                        status: el.status,
                        total_price: el.total_price,
                        products: el.products,
                        email: el.client?.email
                    }));
                    //console.log('orders récupérés:', this.orderList);
                }

                this.isLoading = false;
            } catch (error: any) {
                this.isLoading = false;
                console.error('Erreur lors du chargement:', error);
                if (error.response) {
                    console.error("Réponse de l'API dans l'erreur:", error.response);
                }
            }
        },

        async getAllProducts() {
            try {
                this.isLoading = true;
                this.allProductList = [];

                const response = await fetch(`${this.baseUrl}/products/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                //const response = await Api.get('/products/all');

                if (response.ok) {
                    const data = await response.json();
                    this.allProductList = data;
                    //console.log('all récupérés:', this.allProductList);
                }

                this.isLoading = false;
            } catch (error: any) {
                this.isLoading = false;
                console.error('Erreur lors du chargement:', error);
                if (error.response) {
                    console.error("Réponse de l'API dans l'erreur:", error.response);
                }
            }
        },

        async getClientOrdersList() {
            try {
                this.isLoading = true;
                this.clientOrderHistory = [];
                const response = await Api.get('/orders/history');

                if (response?.status === 200) {
                    this.clientOrderHistory = response.data.map((el: any) => ({
                        order_id: el.order_id,
                        total_price: el.total_price,
                        date: el.created_at.split('T')[0],
                        products: el.products
                    }));
                    //console.log('orders récupérés:', this.orderList);
                }

                this.isLoading = false;
            } catch (error: any) {
                this.isLoading = false;
                //console.error('Erreur lors du chargement:', error);
                if (error.response) {
                    console.error("Réponse de l'API dans l'erreur:", error.response);
                }
            }
        },

        async submitClientCart(data: any) {
            try {
                this.isLoading = true;

                //console.log('Ajout du produit:', data);
                const response = await Api.post('/orders', data);
                this.isLoading = false;

                if (response?.status === 201) {
                    customToastSuccess('Panier commandé avec succès');
                }
                this.confirmOrder = true;
            } catch (error: any) {
                this.isLoading = false;

                // Gestion des erreurs avec messages adaptés
                const errorMessage = error?.response?.data?.message || 'Une erreur est survenue, veuillez réessayer.';
                console.error("Erreur lors de l'opération:", error);
                customToastError(errorMessage);
            }
        }
    }
});
