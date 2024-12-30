<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, nextTick  } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { ShoppingBagIcon } from 'vue-tabler-icons';
import { useDisplay } from 'vuetify';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useAuthStore } from '@/stores/auth';


export default defineComponent({
  name: 'NavigationBar',
  emits: ['task-type-selected', 'logo-clicked'],
  setup(_, { emit }) {
    const { mobile } = useDisplay(); 
    const isMobileDevice = computed(() => mobile.value);

    const router = useRouter();
    const route = useRoute();

    const authStore = useAuthStore();
  
    const drawer = ref(false);
    const selectedLink = ref('');

   const isAuth = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.user?.role === 'client';
};


    return {
      UiParentCard,
      isMobileDevice,
      drawer,
      selectedLink,
      isAuth,
      authStore
    }
  },
});
</script>



<template>
  <v-app-bar elevation="3" flat>
    <!-- Container for logo and menu items -->
    <v-container class="d-flex align-center justify-center">
      <!-- Logo -->
      <v-app-bar-title>
        <RouterLink to="/" style="color: inherit; text-decoration: none; ">
        <p >Vente-Achat</p>
        </RouterLink>
        <!--<v-img src="../assets/logo.png" max-height="70" max-width="70" @click="logoClicked"></v-img>-->
      </v-app-bar-title>

      <!-- Menu items for desktop view -->
      <template v-if="!isMobileDevice">
        <div v-if="!isAuth()" class="d-flex flex-row align-center justify-center" style="flex: 1;">
          
            <v-spacer />
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

        <div v-else class="d-flex flex-row align-center justify-center" style="flex: 1;">
            <v-spacer />
             <RouterLink to="/historique/commande" class="text-decoration-none text-body-1">
            <p class="me-4" >
              Historique des commandes
            </p>
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
      </template>

      <!-- Hamburger icon for mobile view -->

       
      <v-app-bar-nav-icon v-if="isMobileDevice" @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-container>
  </v-app-bar>

  <!-- Navigation drawer for mobile view -->
  <v-navigation-drawer v-model="drawer" location="left" temporary v-if="isMobileDevice">
    <v-list>
      <v-list-item>
          <RouterLink to="/" style="color: inherit;" class="text-decoration-none text-body-1">

        <v-list-item-title>Boutique</v-list-item-title>
          </RouterLink>
      </v-list-item>
      <div v-if="isAuth()" >
      <v-list-item >
          <RouterLink to="/historique/commande" style="color: inherit;" class="text-decoration-none text-body-1">
        <v-list-item-title>Historique des commandes</v-list-item-title>
          </RouterLink>
      </v-list-item>

      <v-list-item style="margin-top: 15px " >
            <v-list-item-title>
                <v-chip @click="authStore.logout()" variant="flat" style="width: 100%; justify-content: center; padding: 18px 0; " >Se déconnecter</v-chip>
            </v-list-item-title>
      </v-list-item>
    </div>

    <div v-else >
         <v-list-item style="margin-top: 15px; " >
        <RouterLink to="/auth/login" style="color: inherit;" class="text-decoration-none text-body-1">
            <v-list-item-title>
                <v-chip variant="tonal" style="width: 100%; justify-content: center;padding: 18px 0; " >Se connecter</v-chip>
            </v-list-item-title>
        </RouterLink>
      </v-list-item>

      <v-list-item>
          <RouterLink to="/auth/register" style="color: inherit;" class="text-decoration-none text-body-1">
            <v-list-item-title>
                <v-chip variant="flat" style="width: 100%; justify-content: center; padding: 18px 0; " >S'inscrire</v-chip>
            </v-list-item-title>
        </RouterLink>
      </v-list-item>
    </div>
    </v-list>
  </v-navigation-drawer>
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
