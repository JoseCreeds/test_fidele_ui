<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, nextTick  } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { ShoppingBagIcon } from 'vue-tabler-icons';
import { useDisplay } from 'vuetify';
import Header from './Header.vue';
import HistoriqueOrder from './HistoriqueOrder.vue';


export default defineComponent({
  name: 'NavigationBar',
components: {
    Header, HistoriqueOrder
  },
  emits: ['task-type-selected', 'logo-clicked'],
  setup(_, { emit }) {
    const { mobile } = useDisplay(); // Récupère la détection mobile via Vuetify
    const isMobileDevice = computed(() => mobile.value);

    return {
      isMobileDevice,
    };
  },
});
</script>



<template>
    <Header></Header>

    <div :style="isMobileDevice ? { margin: '80px 2% 50px' } : { margin: '80px 25% 50px' }">
       <HistoriqueOrder />
    </div>
</template>