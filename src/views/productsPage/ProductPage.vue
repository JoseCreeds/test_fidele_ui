<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ShoppingBagIcon } from "vue-tabler-icons";
import { useDisplay } from "vuetify";
import UiParentCard from "@/components/shared/UiParentCard.vue";

import * as TablerIcons from "vue-tabler-icons";
import { useAdminStore } from "@/stores/adminStore";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
  name: "NavigationBar",
  components: {
    UiParentCard,
  },
  emits: ["task-type-selected", "logo-clicked"],
  setup(_, { emit }) {
    const { mobile } = useDisplay(); // Récupère la détection mobile via Vuetify
    const isMobileDevice = computed(() => mobile.value);

    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();

    const links = ["Panier", "Se connecter"];
    const drawer = ref(false);

    // Admin Store Logic
    const adminStore = useAdminStore();
    const getProductsList = computed(() => adminStore.allProductList);
    const FinalInvoice = ref([...getProductsList.value]);

    // Charger les données des produits lors du montage
    onMounted(async () => {
      loadCart();
      await adminStore.getAllProducts();
      FinalInvoice.value = [...getProductsList.value];
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

    const addToCart = (product: any) => {
      const existingProduct = cart.value.find(
        (item: any) => item.libelle === product.libelle
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.value.push({ ...product, quantity: 1 });
      }
      saveCart();
      console.log("Cart:", cart.value);
    };

    const imagePath = `${import.meta.env.VITE_IMAGE_PATH}`;

    const isAuth = () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return user?.user?.role === "client";
    };

    return {
      isMobileDevice,
      links,
      drawer,
      getProductsList,
      FinalInvoice,
      cart,
      addToCart,
      imagePath,
      isAuth,
      authStore,
      UiParentCard,
    };
  },
});
</script>

<template>
  <v-app-bar elevation="3" flat>
    <!-- Container for logo and menu items -->
    <v-container class="d-flex align-center justify-center">
      <!-- Logo -->
      <v-app-bar-title>
        <RouterLink to="/" style="color: inherit; text-decoration: none">
          <p>Vente-Achat</p>
        </RouterLink>
        <!--<v-img src="../assets/logo.png" max-height="70" max-width="70" @click="logoClicked"></v-img>-->
      </v-app-bar-title>

      <!-- Menu items for desktop view -->
      <template v-if="!isMobileDevice">
        <div class="d-flex flex-row align-center justify-center" style="flex: 1">
          <RouterLink to="/panier">
            <div class="position-relative d-inline-block" style="color: inherit">
              <ShoppingBagIcon class="mr-4" />
              <span class="quantity-badge">{{ cart.length }}</span>
            </div>
          </RouterLink>

          <v-spacer />
          <div
            v-if="!isAuth()"
            class="d-flex flex-row align-center justify-center"
            style="flex: 1"
          >
            <RouterLink to="/auth/login" class="text-decoration-none text-body-1">
              <v-btn
                class="text-none me-4 text-subtitle-1"
                color="#05B990"
                size="small"
                variant="outlined"
              >
                Se connecter
              </v-btn>
            </RouterLink>

            <RouterLink to="/auth/register" class="text-decoration-none text-body-1">
              <v-btn
                class="text-none text-subtitle-1"
                color="#05B990"
                size="small"
                variant="outlined"
              >
                S'inscrire
              </v-btn>
            </RouterLink>
          </div>
          <div v-else class="d-flex flex-row align-center justify-center" style="flex: 1">
            <v-spacer />

            <RouterLink
              to="/historique/commande"
              class="text-decoration-none text-body-1"
            >
              <p class="me-4">Historique des commandes</p>
            </RouterLink>

            <v-btn
              class="text-none text-subtitle-1"
              color="#05B990"
              size="small"
              variant="outlined"
              @click="authStore.logout()"
            >
              Se déconnecter
            </v-btn>
          </div>
        </div>
      </template>

      <!-- Hamburger icon for mobile view -->

      <div
        v-if="isMobileDevice"
        style="margin-right: 10px"
        class="position-relative d-inline-block"
      >
        <RouterLink to="/panier">
          <ShoppingBagIcon style="color: inherit" />
          <span class="quantity-badge-mobile">{{ cart.length }}</span>
        </RouterLink>
      </div>
      <v-app-bar-nav-icon
        v-if="isMobileDevice"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-container>
  </v-app-bar>

  <!-- Navigation drawer for mobile view -->
  <v-navigation-drawer v-model="drawer" location="left" temporary v-if="isMobileDevice">
    <v-list>
      <v-list-item>
        <RouterLink
          to="/"
          style="color: inherit"
          class="text-decoration-none text-body-1"
        >
          <v-list-item-title>Boutique</v-list-item-title>
        </RouterLink>
      </v-list-item>

      <div v-if="isAuth()">
        <v-list-item>
          <RouterLink
            to="/historique/commande"
            style="color: inherit"
            class="text-decoration-none text-body-1"
          >
            <v-list-item-title>Historique des commandes</v-list-item-title>
          </RouterLink>
        </v-list-item>

        <v-list-item style="margin-top: 20px !important">
          <v-list-item-title>
            <v-chip
              @click="authStore.logout()"
              variant="flat"
              style="width: 100%; justify-content: center; padding: 18px 0"
              >Se déconnecter</v-chip
            >
          </v-list-item-title>
        </v-list-item>
      </div>

      <div v-else>
        <v-list-item style="margin-top: 15px">
          <RouterLink
            to="/auth/login"
            style="color: inherit"
            class="text-decoration-none text-body-1"
          >
            <v-list-item-title>
              <v-chip
                variant="tonal"
                style="width: 100%; justify-content: center; padding: 18px 0"
                >Se connecter</v-chip
              >
            </v-list-item-title>
          </RouterLink>
        </v-list-item>

        <v-list-item>
          <RouterLink
            to="/auth/register"
            style="color: inherit"
            class="text-decoration-none text-body-1"
          >
            <v-list-item-title>
              <v-chip
                variant="flat"
                style="width: 100%; justify-content: center; padding: 18px 0"
                >S'inscrire</v-chip
              >
            </v-list-item-title>
          </RouterLink>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>

  <main style="margin: 80px 10% 50px">
    <h2 style="text-align: center">Votre magasin de vente et achat rapide</h2>

    <div
      style="margin-top: 50px"
      v-if="!FinalInvoice || FinalInvoice.length === 0"
      class="no-data-message"
    >
      <v-card elevation="10">
        <p style="text-align: center; margin: 50px 0">Pas de produit disponible</p>
      </v-card>
    </div>

    <v-row class="justify-content-end mt-5">
      <v-col cols="12">
        <v-row>
          <v-col
            cols="12"
            md="4"
            sm="6"
            v-for="(card, index) in FinalInvoice"
            :key="index"
          >
            <v-card elevation="10" class="card-hover overflow-hidden">
              <v-avatar size="220" class="rounded-0 w-100">
                <img
                  :src="`${imagePath}/storage/product_images/${card.picture}`"
                  alt="gallery"
                  width="100%"
                />
              </v-avatar>

              <v-card-text>
                <v-row class="">
                  <v-col cols="6" class="d-flex justify-content-start">
                    <div class="d-flex gap-3">
                      <div>
                        <h6 class="text-h6 mb-1">{{ card.libelle }}</h6>
                        <span
                          class="d-block text-truncate d-flex align-center gap-2 textSecondary"
                        >
                          {{ card.price }} XOF
                        </span>
                        <span>Stock : {{ card.stock }}</span>
                      </div>
                    </div>
                  </v-col>
                  <v-col
                    cols="6"
                    class="d-flex justify-content-end"
                    style="justify-content: right; margin-top: 10px"
                  >
                    <v-btn color="primary" variant="flat" @click="addToCart(card)"
                      >Ajouter</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </main>
</template>

<style scoped>
/* Add your CSS styles here */

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

.line1,
.line2,
.line3 {
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
