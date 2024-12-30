

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import MyPromiseIcon from '@/components/Icons/MyPromiseIcon.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import * as TablerIcons from 'vue-tabler-icons'
import { useAdminStore } from '@/stores/adminStore';
import { Form } from 'vee-validate';
import Header from './Header.vue';



const page = ref({ title: 'Historique des commandes' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'Historique',
        disabled: true,
        href: '#'
    }
])


const searchValue = ref('');
const searchValueP = ref('');
const adminStore = useAdminStore();

onMounted(async () => {
    await adminStore.getClientOrdersList();
    FinalInvoice.value = [...getHistorique.value];

});

const getHistorique = computed(() => adminStore.clientOrderHistory);
let FinalInvoice = ref<any>([...getHistorique.value]);

const headers = ref([
    { key: 'order_id', title: '#', sortable: true, },
    { key: 'total_price',  title: 'Prix total' },
    { key: 'date',  title: 'Date' },
    { key: 'products',  title: 'Products' },
])

const headersProduct = ref([
    { key: 'product_id', title: '#', sortable: true, },
    { key: 'libelle', title: 'Libellé' },
    { key: 'price', title: 'Prix' },
    { key: 'quantity',  title: 'Quantité' },
    { key: 'subtotal',  title: 'Prix total' },
])

const isProductDialogVisible = ref(false)

const produtsList = ref<any>()
const onpenProductsListDialog = (item: any) => {
    console.log('itemitemitem', item)
    produtsList.value = item
    isProductDialogVisible.value = true
}

const closeDialog = () => {

    isProductDialogVisible.value = false

}


</script>

<template>

    <main >
        <h2 style="text-align: center; margin-bottom: 20px; ">Historique des commandes</h2>

        <v-card elevation="10">
        <v-card-item>
            <div v-if="adminStore.isLoading" class="loader">
                <MyPromiseIcon />
            </div>

            <div v-else-if="!FinalInvoice || FinalInvoice.length === 0" class="no-data-message ">
                <UiParentCard :title="'Historique'" >
                   <p style="text-align: center;" >Aucune donnée disponible.</p> 
                </UiParentCard>
            </div>

            <div v-else>
                <v-row>
                    <v-col cols="12">
                        <UiParentCard :title="'Historique'">
                                <div class="d-sm-flex justify-space-between align-center my-7">
                                    <v-sheet width="100%" class="mt-lg-0 mt-4">
                                        <v-text-field v-model="searchValue" prepend-inner-icon="mdi-keyboard-settings-outline"
                                            append-inner-icon="mdi-magnify" label="Rechercher..." single-line hide-details
                                            class="mb-4" @click:append-inner="" @click:prepend-inner="" />
                                    </v-sheet>

                                   

                                </div>

                                <v-data-table :headers="headers" :items="FinalInvoice" v-model:search="searchValue"
                                items-per-page="25" class="rounded-md datatable">

                                <template v-slot:item.products="{ item }">
                                    <span class="d-flex gap-2" @click="onpenProductsListDialog((item as any).products)">

                                        <!--  <i class="mdi mdi-pencil font-size-18" style="font-size: 20px;"></i> -->

                                            <EyeIcon color="#14b8a6" />
                                            <v-tooltip activator="parent" location="bottom">Voir produit</v-tooltip>

                                        </span>
                                </template>

                                <template v-slot:item.actions="{ item }">
                                   
                                </template>

                                </v-data-table>
                        </UiParentCard>
                    </v-col>
                </v-row>
            </div>

        </v-card-item>
    </v-card>
    </main>

    <v-dialog v-model="isProductDialogVisible" max-width="100%">
        <v-card>
            <v-card-title class="pa-4 bg-primary d-flex justify-between align-center">
                <h3 style="flex-grow: 1; text-align: center;">Liste des produits</h3>
                <XIcon @click="isProductDialogVisible = false" />

            </v-card-title>
            <v-card-text>
                
                <v-data-table :headers="headersProduct" :items="produtsList" v-model:search="searchValueP"
                                items-per-page="5" class="rounded-md datatable">

                                <template v-slot:item.product_id="{ item }">
                                   <span>
                                    {{ (item as any).product_id }}
                                   </span>
                                </template>

                                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>


<style scoped>
.loader {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.7);
}


.loader svg {
    margin-right: 8px;
}

.no-data-message {
    text-align: center;
    font-size: 1.2em;
    color: #888;
    margin: 20px 0;
}

.text-capitalize {
    text-transform: capitalize;
}

.text-no-wrap {
    white-space: nowrap;
}

a {
    text-decoration: none;
}
</style>