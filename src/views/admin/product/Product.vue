<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import MyPromiseIcon from '@/components/Icons/MyPromiseIcon.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import * as TablerIcons from 'vue-tabler-icons'
import { useAdminStore } from '@/stores/adminStore';
import { Form } from 'vee-validate';


const page = ref({ title: 'Gestion des produits' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'Produits',
        disabled: true,
        href: '#'
    }
])


const searchValue = ref('');
const adminStore = useAdminStore();

onMounted(async () => {
    await adminStore.getProductList();
    FinalInvoice.value = [...getProductsList.value];

});

const getProductsList = computed(() => adminStore.productList);
let FinalInvoice = ref([...getProductsList.value]);


const headers = ref([
    { key: 'libelle', title: 'Libellé', sortable: true, },
    { key: 'price', title: 'Prix' },
    { key: 'stock',  title: 'Stock' },
    { key: 'actions', title: 'Actions', sortable: false }
])

const productData = ref<any>({
    libelle: '',
    description: '',
    price: null,
    stock: null,
    picture: "",
})

const isAddProductDialogVisible = ref(false)

const isPost = ref<boolean>(true)
const onpenAddCodeDialog = (item: any, value: boolean) => {
    isPost.value = value
    if(isPost.value ){
        productData.value = {
            libelle: '',
            description: '',
            price: null,
            stock: null,
            picture: "",
        }
    }else{
        productData.value = {
            id: item.id,
            libelle: item.libelle,
            description: item.description,
            price: item.price,
            stock: item.stock,
            picture: "",
        }
    }
    isAddProductDialogVisible.value = true
}

const closeDialog = () => {
    productData.value = {
        id: null,
        libelle: '',
        description: '',
        price: null,
        stock: null,
        picture: "",
    }
    isAddProductDialogVisible.value = false
    isDeleteProductDialogVisible.value = false;

}

const submitProduct = async () => {
    productData.value.picture = image.value
    await adminStore.addOrUpdateProduct(productData.value,isPost.value )
    closeDialog()
    await adminStore.getProductList();
    FinalInvoice.value = [...getProductsList.value];
};

const isDeleteProductDialogVisible = ref(false)
let selectedProductRowId = ref(0)
function openDeleteProductDialog(item: any) {
    selectedProductRowId.value = item.id
    isDeleteProductDialogVisible.value = true;
}

const submitDeleteProduct = async () => {
    await adminStore.deleteProduct(selectedProductRowId.value)

    closeDialog()
    await adminStore.getProductList();
    FinalInvoice.value = [...getProductsList.value];

};


const image = ref<any>(null)
const imageUrl = ref<any>(null)
const files = ref<any>([])
const handleFile = (action: string, event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    files.value[action] = file || null;

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        imageUrl.value = e.target?.result as string;
        //console.log('imageUrl', imageUrl.value);
    };
    reader.readAsDataURL(file);

    image.value = file;
    //console.log('image', image.value);
};

</script>


<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <v-card elevation="10">
        <v-card-item>
            <div v-if="adminStore.isLoading" class="loader">
                <MyPromiseIcon />
            </div>

            <div v-else-if="!FinalInvoice || FinalInvoice.length === 0" class="no-data-message ">
                <UiParentCard :title="'Liste des produits'">
                    <div class="d-sm-flex justify-space-between align-center my-7">
                                    <v-sheet width="255" class="mt-lg-0 mt-4">
                                        <v-text-field v-model="searchValue" prepend-inner-icon="mdi-keyboard-settings-outline"
                                            append-inner-icon="mdi-magnify" label="Rechercher..." single-line hide-details
                                            class="mb-4" @click:append-inner="" @click:prepend-inner="" />
                                    </v-sheet>

                                    <v-btn color="primary" @click="onpenAddCodeDialog('', true)">
                                        <PlusIcon class="me-2" /> Ajouter 
                                    </v-btn>

                                </div>
                    Aucune donnée disponible.

                </UiParentCard>
            </div>


            <div v-else>
                <v-row>
                    <v-col cols="12">
                        <UiParentCard :title="'Liste des produits'">
                                <div class="d-sm-flex justify-space-between align-center my-7">
                                    <v-sheet width="255" class="mt-lg-0 mt-4">
                                        <v-text-field v-model="searchValue" prepend-inner-icon="mdi-keyboard-settings-outline"
                                            append-inner-icon="mdi-magnify" label="Rechercher..." single-line hide-details
                                            class="mb-4" @click:append-inner="" @click:prepend-inner="" />
                                    </v-sheet>

                                    <v-btn color="primary" @click="onpenAddCodeDialog('', true)">
                                        <PlusIcon class="me-2" /> Ajouter 
                                    </v-btn>

                                </div>

                                <v-data-table :headers="headers" :items="FinalInvoice" v-model:search="searchValue"
                                items-per-page="5" class="rounded-md datatable">


                                <template v-slot:item.actions="{ item }">
                                    <v-row>
                                    <v-col>
                                    <span class="d-flex gap-2" @click="onpenAddCodeDialog(item, false)">

                                    <!--  <i class="mdi mdi-pencil font-size-18" style="font-size: 20px;"></i> -->

                                        <EditIcon color="#14b8a6" />
                                        <v-tooltip activator="parent" location="bottom">Modifer</v-tooltip>

                                    </span>
                                </v-col>
                                    <v-col>
                                                <span @click="openDeleteProductDialog(item)"
                                                    style="cursor: pointer; color: lightcoral;">
                                                    <TrashIcon />
                                                    <v-tooltip activator="parent"
                                                        location="bottom">Supprimer</v-tooltip>
                                                </span>
                                            </v-col>
                                        </v-row>
                                </template>

                                </v-data-table>
                        </UiParentCard>
                    </v-col>
                </v-row>
            </div>

        </v-card-item>
    </v-card>

    <v-dialog v-model="isAddProductDialogVisible" max-width="50%">
        <v-card>
            <v-card-title class="pa-4 bg-primary" style="text-align: center;">
                <h3>{{ isPost ? 'Ajouter produit' : 'Modifier produit' }}</h3>
            </v-card-title>
            <v-card-text>
                <Form @submit="submitProduct()" v-slot="{ errors, isSubmitting }" class="mt-2"
                    style="padding: 30px 2% ">

                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field label="Libellé*"  density="compact"
                                variant="outlined" v-model="productData.libelle" hide-details required />
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Prix*" density="compact" variant="outlined"
                                v-model="productData.price" hide-details required />
                        </v-col>
                    </v-row>

                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field label="Stock*" density="compact"
                                variant="outlined" v-model="productData.stock" hide-details required />
                        </v-col>

                        <v-col cols="6" >
                            <input ref="fileAffiche" type="file" label="" id="file"
                                @change="handleFile('image', $event)" accept="image/*" height="250px">
                   
                        </v-col>
                      
                    </v-row>

                    <v-row cols="12">
                        <v-col cols="12">

                        <v-textarea
                        v-model="productData.description"
                            label="Description*"
                            rows="2"
                            required
                        ></v-textarea>
                    </v-col>

                    </v-row>

                    <v-row class="justify-end">
                        <v-btn size="large" variant="tonal" color="gray" inline @click="closeDialog" flat
                            style="margin-top: 30px; margin-right: 10px">Annuler</v-btn>

                        <v-btn size="large" :loading="isSubmitting" color="primary" inline type="submit" flat
                            style="margin-top: 30px; margin-right: 20px">{{  isPost ? 'Ajouter' : 'Modifier' }}</v-btn>

                    </v-row>


                </Form>
            </v-card-text>
        </v-card>
    </v-dialog>


    <v-dialog v-model="isDeleteProductDialogVisible" max-width="450px">
        <v-card>
            <v-card-text>
                <Form @submit="submitDeleteProduct()" v-slot="{ errors, isSubmitting }" class="mt-2"
                    style="padding: 0px 2% ">
                    <h3 style="text-align: center; margin-bottom: 30px; font-weight: 600">Voulez-vous vraiment supprimer
                        ce produit ?</h3>

                    <v-row no-gutters class="justify-end">
                        <v-btn color="error" variant="tonal" class="me-4" type="reset" @click="() => {
                            closeDialog()
                        }">
                            NON
                        </v-btn>
                        <v-btn color="primary"  :loading="isSubmitting" type="submit">
                            OUI
                        </v-btn>

                    </v-row>


                </Form>
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

input::file-selector-button {
    background-color: #3AAA35 !important;
    color: white;
    border-color: #3AAA35 !important;
    border-radius: 10px;
    box-shadow: none;
    padding: 5px;
    height: 39px;
}

input::file-selector-button:hover {
    background-color: #fff !important;
    color: #000;

}

input[type="file"] {
    border: 1px solid black;
    border-radius: 10px;
    border-style: ridge;
    background-color: #3baa3556;
    width: 100%;

}

input[type="file"]:hover {
    border: 1px solid black;
    border-radius: 10px;
    border-style: ridge;
    background-color: #d4e3d4;
}

.mdi-content-copy:hover {
    color: green;
}

.v-input__append-outer:hover {
    color: green;
}
</style>