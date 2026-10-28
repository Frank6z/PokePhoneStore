<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-py-sm main-toolbar">
        <!-- Logo y Título -->
        <div class="row no-wrap items-center cursor-pointer" @click="$router.push('/')">
          <q-avatar :size="$q.screen.lt.sm ? '38px' : '45px'" class="q-mr-sm shadow-2 bg-green-9">
            <img alt="Logo avatar Zygarde" src="../assets/Icon/Zygarde.webp" />
          </q-avatar>
          <q-toolbar-title class="text-weight-bold text-subtitle1 q-pa-none gt-xs">
            Poke-Phone-Store
          </q-toolbar-title>
        </div>

        <q-space />

        <!-- Pestañas de navegación central (solo iconos en móvil) -->
        <q-tabs
          dense
          align="center"
          class="text-green-2"
          active-color="green-5"
          indicator-color="green-5"
          narrow-indicator
        >
          <q-route-tab to="/" exact :label="$q.screen.gt.xs ? 'INICIO' : undefined" icon="home" />
          <q-route-tab
            to="/statistics"
            :label="$q.screen.gt.xs ? 'ESTADISTICAS' : undefined"
            icon="bar_chart"
          />
        </q-tabs>

        <q-space />

        <!-- Buscador vinculado al store y con evento Enter -->
        <div class="search-container q-pa-sm">
          <q-input
            dense
            dark
            outlined
            rounded
            v-model="tempSearch"
            @keyup.enter="aplicarBusqueda"
            @clear="limpiarBusqueda"
            placeholder="Buscar modelo, marca, sistema..."
            class="bg-green-9"
            color="green-5"
            clearable
          >
            <template #prepend>
              <q-icon name="search" class="cursor-pointer" @click="aplicarBusqueda" />
            </template>
          </q-input>
        </div>

        <q-space class="gt-xs" />
        <div class="row no-wrap items-center">
          <!-- Boton para agregar nuevo anuncio -->
          <q-btn
            round
            push
            glossy
            color="secondary"
            to="/new-product"
            icon="add"
            class="q-mr-sm"
            aria-label="Nuevo anuncio"
          />

          <!-- Boton para carrito -->
          <q-btn
            round
            push
            glossy
            color="green-10"
            to="/cart"
            icon="local_grocery_store"
            aria-label="Carrito"
          >
            <q-badge v-if="cartStore.items.length > 0" color="green-10" floating>
              {{ cartStore.items.length }}
            </q-badge>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer de filtros: solo existe en el catálogo y se abre desde IndexPage -->
    <q-drawer
      v-if="isCatalog"
      v-model="filterStore.drawerOpen"
      show-if-above
      bordered
      :width="280"
      class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <PhoneFilters />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PhoneFilters from '../components/PhoneFilters.vue'
import { useCartStore } from '../stores/cartStore'
import { useFilterStore } from '../stores/filterStore'

const route = useRoute()
const cartStore = useCartStore()
const filterStore = useFilterStore()

const tempSearch = ref('')

const isCatalog = computed(() => route.path === '/')

function aplicarBusqueda() {
  filterStore.filters.searchQuery = tempSearch.value
}

function limpiarBusqueda() {
  tempSearch.value = ''
  filterStore.filters.searchQuery = ''
}
</script>

<style scoped>
.search-container {
  width: 320px;
  position: relative;
  padding-bottom: 12px;
}

@media (max-width: 1023px) {
  .search-container {
    width: 240px;
  }
}

/* En móvil el buscador baja a una segunda línea a todo el ancho */
@media (max-width: 599px) {
  .main-toolbar {
    flex-wrap: wrap;
    padding-left: 8px;
    padding-right: 8px;
  }
  .search-container {
    order: 1;
    width: 100%;
    padding: 4px 0 0;
  }
}
</style>
