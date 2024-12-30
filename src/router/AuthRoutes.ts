const AuthRoutes = {
    path: '/auth',
    component: () => import('@/layouts/blank/BlankLayout.vue'),
    meta: {
        requiresAuth: false
    },
    children: [
        // {
        //   name: 'Landing Page',
        // path: '/7',
        //component: () => import('@/views/pages/landingpage/index.vue')
        //},

        {
            name: 'allProductPage',
            path: '/',
            component: () => import('@/views/productsPage/ProductPage.vue')
        },

        {
            name: 'cartPage',
            path: '/panier',
            component: () => import('@/views/productsPage/Cart.vue')
        },

        {
            name: 'historyOrderPage',
            path: '/historique/commande',
            component: () => import('@/views/productsPage/Historique.vue')
        },

        {
            name: 'Side Login',
            path: '/auth/login',
            //path: '/',
            component: () => import('@/views/authentication/SideLogin.vue')
        },

        {
            name: 'Side Register',
            path: '/auth/register',
            component: () => import('@/views/authentication/SideRegister.vue')
        }
    ]
};

export default AuthRoutes;
