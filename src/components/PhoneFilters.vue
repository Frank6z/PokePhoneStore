<template>
  <div class="q-pa-sm custom-font">
    <div class="row items-center q-mb-md q-pa-sm bg-green-9 text-white rounded-borders shadow-2">
      <q-avatar size="35px" class="q-mr-sm bg-green-8">
        <img alt="Logo avatar Sceptile" src="../assets/Icon/Sceptile.webp" />
      </q-avatar>
      <div>
        <div class="text-weight-bold text-subtitle2">Filtros de Busqueda</div>
      </div>
    </div>

    <q-card flat bordered class="bg-white q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between">
          <span class="text-subtitle2 text-primary text-weight-bold">NUEVOS</span>
          <q-toggle v-model="filterStore.filters.showNew" color="primary" />
        </div>
      </q-card-section>

      <q-separator color="primary" inset />

      <!-- MARCA -->
      <q-card-section class="q-pb-xs">
        <div class="text-subtitle2 text-primary text-weight-bold">MARCA</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="q-py-sm">
        <div class="column q-gutter-xs">
          <div
            v-for="brand in availableBrands"
            :key="brand.name"
            class="row items-center justify-between"
          >
            <q-checkbox
              v-model="filterStore.filters.brands"
              :val="brand.name"
              :label="brand.name"
              color="primary"
              dense
            />
            <q-badge color="grey-4" text-color="dark" rounded>{{ brand.count }}</q-badge>
          </div>
        </div>
      </q-card-section>

      <q-separator color="primary" inset />

      <!-- SISTEMA -->
      <q-card-section class="q-pb-xs">
        <div class="text-subtitle2 text-primary text-weight-bold">SISTEMA</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="q-py-sm">
        <div class="column q-gutter-xs">
          <div
            v-for="sys in availableSystems"
            :key="sys.name"
            class="row items-center justify-between"
          >
            <q-checkbox
              v-model="filterStore.filters.systems"
              :val="sys.name"
              :label="sys.name"
              color="primary"
              dense
            />
            <q-badge color="grey-4" text-color="dark" rounded>{{ sys.count }}</q-badge>
          </div>
        </div>
      </q-card-section>

      <q-separator color="primary" inset />

      <!-- PANTALLA -->
      <q-card-section class="q-pb-xs">
        <div class="text-subtitle2 text-primary text-weight-bold">PANTALLA</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="q-py-sm">
        <div class="column q-gutter-xs">
          <div
            v-for="screen in availableScreens"
            :key="screen.val"
            class="row items-center justify-between"
          >
            <q-checkbox
              v-model="filterStore.filters.screens"
              :val="screen.val"
              :label="screen.label"
              color="primary"
              dense
            />
            <q-badge color="grey-4" text-color="dark" rounded>{{ screen.count }}</q-badge>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { db } from '@/boot/firebase'
import { collection, getDocs } from 'firebase/firestore'

const filterStore = useFilterStore()
const phones = ref([])

// Cargar los telefonos desde Firestore
onMounted(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'phones'))
    phones.value = querySnapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.error('Error al cargar datos para los filtros:', error)
  }
})

const availableBrands = computed(() => {
  const brandList = ['Samsung', 'Huawei', 'Nokia', 'iPhone', 'Xiaomi', 'Google']
  return brandList.map((name) => ({
    name,
    count: phones.value.filter((p) => p.brand && p.brand.toLowerCase() === name.toLowerCase())
      .length,
  }))
})

const availableSystems = computed(() => {
  const sysList = ['Android', 'Windows', 'iOS']
  return sysList.map((name) => ({
    name,
    count: phones.value.filter((p) => p.system && p.system.toLowerCase() === name.toLowerCase())
      .length,
  }))
})

const availableScreens = computed(() => {
  return [
    {
      val: '6.0',
      label: '6.0 pulgadas o más',
      count: phones.value.filter((p) => p.screen >= 6.0).length,
    },
    {
      val: '5.5',
      label: '5.5 pulgadas',
      count: phones.value.filter((p) => p.screen >= 5.5 && p.screen < 6.0).length,
    },
    { val: '5.0', label: '5.0 pulgadas', count: phones.value.filter((p) => p.screen < 5.5).length },
  ]
})
</script>

<style scoped>
.custom-font {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>
