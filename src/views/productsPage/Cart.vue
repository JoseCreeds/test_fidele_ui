<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, nextTick  } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { ShoppingBagIcon } from 'vue-tabler-icons';
import { useDisplay } from 'vuetify';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useAdminStore } from '@/stores/adminStore';
import Header from './Header.vue';

export default defineComponent({
  name: 'NavigationBar',
    components: {
    Header, UiParentCard
  },
  emits: ['task-type-selected', 'logo-clicked'],
  setup(_, { emit }) {
    const { mobile } = useDisplay(); 
    const isMobileDevice = computed(() => mobile.value);

    const router = useRouter();
    const route = useRoute();
    const adminStore = useAdminStore();

    const links = ['Panier', 'Se connecter'];
    const drawer = ref(false);
    const selectedLink = ref('');



    onMounted(async () => {
      loadCart();
    });

    const cart = ref<any>([]);
    
    const saveCart = () => {
      localStorage.setItem("cart", JSON.stringify(cart.value));
    };

    const loadCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        cart.value = JSON.parse(storedCart);
      }
    }; 

    const resetCart = () => {
      cart.value = []
      localStorage.removeItem("cart")
    };

    const isCartEmpty = computed(() => !cart.value || cart.value.length === 0);



   const updateCart = (index: number, newQuantity: number) => {
      if (newQuantity < 1) {
        return; 
      }
      cart.value[index].quantity = newQuantity;
      saveCart()
      //console.log('Panier mis à jour:', cart.value);
    }

const imagePath = `${import.meta.env.VITE_IMAGE_PATH}`;

     // Propriété calculée pour le prix total
    const totalPrice = computed(() => {
      return cart.value.reduce((total:any, item:any) => {
        return total + item.price * item.quantity;
      }, 0); // Initialisation du total à 0
    })

    const cartApiData = computed(() => {
      return {
        products: cart.value.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };
    })

    const isConfirmDialogVisible = computed(() => adminStore.confirmOrder);

    const submitCart = async () => {
      if(!isAuth()) return router.push('/auth/login')
    await adminStore.submitClientCart(cartApiData.value)
      //isConfirmDialogVisible.value = adminStore.confirmOrder

      if(isConfirmDialogVisible.value){
        resetCart()
      }
    //closeDialog()
    //console.log('cartApiDatacartApiData', cartApiData.value)
  }

    const isAuth = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.user?.role === 'client';
};

  return {
      Header,
      UiParentCard,
      isMobileDevice,
      links,
      drawer,
      selectedLink,
      cart,
      updateCart,
      imagePath,
      resetCart,
      isCartEmpty,
      totalPrice,
      submitCart,
      adminStore,
      isConfirmDialogVisible
    };
  },
});
</script>



<template>
  <Header></Header>
  <main :style="isMobileDevice ? { margin: '80px 2% 50px' } : { margin: '80px 25% 50px' }">
    <h2 style="text-align: center; margin-bottom:30px;">Votre panier</h2>

    <v-card elevation="10">
      <v-card-title class = "pa-4 bg-lightprimary">
        <v-btn @click="resetCart" class="text-error bg-lighterror"> Vider le panier</v-btn>
      </v-card-title>
      <v-card-item>
         
            <div v-if="isCartEmpty"  class="no-data-message ">
                <p style="text-align: center;" >
                    Votre panier est vide.
                </p>
            </div>

            <div v-else >

                <v-table>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Stock</th>
                      <th>Quantité</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in cart" :key="index"  >

                      <!-- Colonne 1 : Image, Libellé et Prix -->
                      <td style="padding: 10px 0px">
                        <v-row class="align-center">
                          <v-col cols="12" sm="6" >
                          <v-avatar size="50" >
                            <img :src="`${imagePath}/storage/product_images/${item.picture}`"  alt="Produit" />
                            
                          </v-avatar>
                          </v-col>
                          <v-col cols="12" sm="6" >
                          <div>
                            <h6 class="text-h6 mb-1">{{ item.libelle }}</h6>
                            <span>{{ item.price }} XOF</span>
                          </div>
                          </v-col>
                        </v-row>
                      </td>

                      <td>
                        <span>{{ item.stock }}</span>
                      </td>

                      <td>
                        <span >
                        <v-text-field
                        style="margin-top: 20px; " 
                          v-model.number="item.quantity"
                          type="number"
                          class="w-75 text-center"
                          min="1"
                          :max="item.stock"
                         @input="updateCart(index, item.quantity)"
                        ></v-text-field></span>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
            </div>
      </v-card-item>

      <v-card-actions v-if="!isCartEmpty" class = "pa-4 justify-space-between bg-lightprimary">
        <h3>Total : {{totalPrice}} FCFA</h3>
        <v-btn @click="submitCart" :disabled="isCartEmpty" :isSubmitting ="adminStore.isLoading" color="primary" variant="flat" class="text-error bg-primay" >Commander</v-btn>
      
      </v-card-actions>
    </v-card>
  </main>
    <v-dialog v-model="isConfirmDialogVisible" max-width="450px">
        <v-card>
            <v-card-text>
                    <h3 style="text-align: center; margin-bottom: 30px; font-weight: 600">Commande effectuée avec succès</h3>

                    <v-row no-gutters class="justify-end">
                       
                        <v-btn color="primary" @click='adminStore.confirmOrder=false' >
                            OK
                        </v-btn>

                    </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>


<style scoped>


/* Example CSS */
#logo {
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  padding: 0;
}

.nav-links li {
  display: inline-block;
  margin-right: 20px;
}

.dropdown-link {
  position: relative;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
}

.nav-active {
  display: block;
}

.toggle .line1 {
  transform: rotate(45deg) translate(5px, 5px);
}

.toggle .line2 {
  opacity: 0;
}

.toggle .line3 {
  transform: rotate(-45deg) translate(5px, -5px);
}

.line1, .line2, .line3 {
  width: 30px;
  height: 4px;
  background-color: #333;
  margin: 6px 0;
}

.quantity-badge {
  position: absolute;
  top: 0; /* Ajustez pour placer le badge correctement */
  right: 12px; /* Ajustez pour placer le badge correctement */
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  transform: translate(50%, -50%);
}

.quantity-badge-mobile {
  position: absolute;
  top: 0; /* Ajustez pour placer le badge correctement */
  right: 0px; /* Ajustez pour placer le badge correctement */
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  transform: translate(50%, -50%);
}

</style>
