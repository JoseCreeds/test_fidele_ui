const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'productAdmin',
            path: '/admin/product',
            component: () => import('@/views/admin/product/Product.vue')
        },
        {
            name: 'ordersAdmin',
            path: '/admin/orders',
            component: () => import('@/views/admin/order/Order.vue')
        }
        /* location routes start
        {
            name: 'historiqueLocation',
            path: '/location/historique',
            component: () => import('@/views/location/historique/historique.vue')
        },
        {
            name: 'annonceLocation',
            path: '/location/annonces',
            component: () => import('@/views/location/annonces/annonces.vue')
        },
        {
            name: 'autopartageLocation',
            path: '/location/autopartage',
            component: () => import('@/views/location/autopartage/autopartage.vue')
        },
        {
            name: 'demandeReservationLocation',
            path: '/location/demande-reservation',
            component: () => import('@/views/location/demande-reservation/demande-reservation.vue')
        },
        {
            name: 'paiementLocation',
            path: '/location/paiement',
            component: () => import('@/views/location/paiement/paiement.vue')
        },
        {
            name: 'virementLocation',
            path: '/location/virement',
            component: () => import('@/views/location/virement/virement.vue')
        },
        {
            name: 'remboursementLocation',
            path: '/location/remboursement',
            component: () => import('@/views/location/remboursement/remboursement.vue')
        },*/
        /* location routes end */
    ]
};

export default MainRoutes;
