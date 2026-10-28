<template>
  <q-page class="q-pa-md bg-grey-2 custom-font" style="padding-top: 25px !important">
    <!-- ENCABEZADO DE LA SECCIÓN -->
    <div
      class="row items-center justify-between bg-white q-pa-md rounded-borders shadow-1 q-mb-lg filter-section"
    >
      <div class="row no-wrap items-center">
        <q-avatar size="48px" class="q-mr-md bg-green-1 shadow-1 gt-xs">
          <img alt="" src="../assets/Icon/Tyranitar.webp" />
        </q-avatar>
        <div>
          <h5 class="q-my-none text-primary text-weight-bold">Estadisticas de la Tienda</h5>
          <p class="text-grey-7 text-body2 q-mt-xs q-mb-none">
            Metricas en tiempo real basadas en los datos y ventas simuladas
          </p>
        </div>
      </div>
      <q-chip color="green-1" text-color="primary" icon="trending_up" class="text-weight-bold">
        Reporte Activo 2026
      </q-chip>
    </div>

    <!-- TARJETAS DE MÉTRICAS RÁPIDAS -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Total de Artículos en Firestore -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-kpi-card bg-white shadow-2 q-pa-sm">
          <q-card-section class="row items-center justify-between q-pb-none">
            <div>
              <div class="text-caption text-grey-7 text-weight-bold">TOTAL DISPOSITIVOS</div>
              <div class="text-h4 text-primary text-weight-bold q-mt-sm">{{ totalProducts }}</div>
            </div>
            <q-avatar color="green-1" text-color="primary" icon="smartphone" size="50px" />
          </q-card-section>
          <q-card-section class="text-caption text-positive q-pt-sm">
            <q-icon name="check_circle" /> Sincronizado con Firestore
          </q-card-section>
        </q-card>
      </div>

      <!-- Promedio de Valor de los Productos -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-kpi-card bg-white shadow-2 q-pa-sm">
          <q-card-section class="row items-center justify-between q-pb-none">
            <div>
              <div class="text-caption text-grey-7 text-weight-bold">PRECIO PROMEDIO</div>
              <div class="text-h4 text-primary text-weight-bold q-mt-sm">${{ averagePrice }}</div>
            </div>
            <q-avatar color="green-1" text-color="primary" icon="attach_money" size="50px" />
          </q-card-section>
          <q-card-section class="text-caption text-grey-8 q-pt-sm">
            Valor medio por equipo
          </q-card-section>
        </q-card>
      </div>

      <!-- Ingresos Simulados por Ventas -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-kpi-card bg-white shadow-2 q-pa-sm">
          <q-card-section class="row items-center justify-between q-pb-none">
            <div>
              <div class="text-caption text-grey-7 text-weight-bold">INGRESOS (VENTAS)</div>
              <div class="text-h4 text-positive text-weight-bold q-mt-sm">
                ${{ totalSalesRevenue }}
              </div>
            </div>
            <q-avatar color="green-1" text-color="positive" icon="payments" size="50px" />
          </q-card-section>
          <q-card-section class="text-caption text-positive q-pt-sm">
            <q-icon name="shopping_cart" /> {{ totalSalesCount }} compras simuladas
          </q-card-section>
        </q-card>
      </div>

      <!-- Marca con más artículos -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-kpi-card bg-white shadow-2 q-pa-sm">
          <q-card-section class="row items-center justify-between q-pb-none">
            <div>
              <div class="text-caption text-grey-7 text-weight-bold">MARCA MAS POPULAR</div>
              <div class="text-h6 text-primary text-weight-bold q-mt-sm ellipsis">
                {{ topBrand }}
              </div>
            </div>
            <q-avatar color="green-1" text-color="primary" icon="star" size="50px" />
          </q-card-section>
          <q-card-section class="text-caption text-grey-8 q-pt-sm">
            Sistema dominante: <strong>{{ topSystem }}</strong>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- SECCIÓN DE DETALLES Y CONTEOS -->
    <div class="row q-col-gutter-md">
      <!-- Resumen por Marcas en Base de Datos -->
      <div class="col-12 col-md-6">
        <q-card class="bg-white shadow-2 q-pa-md full-height">
          <div class="text-h6 text-primary text-weight-bold q-mb-md">Distribución de Marcas</div>

          <div v-if="brandCounts.length > 0">
            <div v-for="brand in brandCounts" :key="brand.name" class="q-mb-md">
              <div class="row justify-between text-subtitle2 text-grey-8 q-mb-xs">
                <span>{{ brand.name }}</span>
                <span class="text-weight-bold text-primary">{{ brand.count }} artículos</span>
              </div>
              <q-linear-progress
                :value="brand.count / totalProducts"
                size="15px"
                color="primary"
                track-color="green-1"
                rounded
                class="shadow-1"
              />
            </div>
          </div>
          <div v-else class="text-center text-grey-6 q-pa-md">
            No hay dispositivos registrados en la base de datos
          </div>
        </q-card>
      </div>

      <!-- Resumen de Sistemas Operativos -->
      <div class="col-12 col-md-6">
        <q-card class="bg-white shadow-2 q-pa-md full-height">
          <div class="text-h6 text-primary text-weight-bold q-mb-md">
            Sistemas Operativos Registrados
          </div>

          <div v-if="systemCounts.length > 0" class="column q-gutter-md q-mt-md">
            <div v-for="sys in systemCounts" :key="sys.name">
              <div class="row justify-between text-subtitle2 text-grey-8 q-mb-xs">
                <span>{{ sys.name }}</span>
                <span class="text-weight-bold text-positive">{{ sys.count }} equipos</span>
              </div>
              <q-linear-progress
                :value="sys.count / totalProducts"
                size="18px"
                color="positive"
                track-color="grey-3"
                rounded
              />
            </div>
          </div>
          <div v-else class="text-center text-grey-6 q-pa-md">No hay sistemas registrados</div>

          <q-banner class="bg-green-1 text-primary rounded-borders q-mt-lg" dense>
            <template #avatar>
              <q-icon name="verified" color="primary" />
            </template>
            Las estadisticas se actualizan automaticamente al registrar o eliminar articulos en
            Firestore.
          </q-banner>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/boot/firebase'
import { collection, getDocs } from 'firebase/firestore'

const phones = ref([])
const salesHistory = ref([])

// Cargar datos y el historial de ventas
onMounted(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'phones'))
    phones.value = querySnapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }

  // Cargamos el historial de compras simuladas
  const savedSales = localStorage.getItem('simulated_sales')
  if (savedSales) {
    salesHistory.value = JSON.parse(savedSales)
  }
})

// Total de productos
const totalProducts = computed(() => phones.value.length)

// Promedio de precio de articulos
const averagePrice = computed(() => {
  if (phones.value.length === 0) return '0.00'
  const sum = phones.value.reduce((acc, p) => acc + Number(p.price || 0), 0)
  return (sum / phones.value.length).toFixed(2)
})

// Ingresos totales simulado
const totalSalesRevenue = computed(() => {
  const sum = salesHistory.value.reduce((acc, sale) => acc + Number(sale.total || 0), 0)
  return sum.toFixed(2)
})

const totalSalesCount = computed(() => salesHistory.value.length)

// Conteo por marcas
const brandCounts = computed(() => {
  const counts = {}
  phones.value.forEach((p) => {
    const brand = p.brand || 'Desconocida'
    counts[brand] = (counts[brand] || 0) + 1
  })
  return Object.keys(counts)
    .map((name) => ({
      name,
      count: counts[name],
    }))
    .sort((a, b) => b.count - a.count)
})

// Marca con mas articulos
const topBrand = computed(() => {
  if (brandCounts.value.length === 0) return 'N/A'
  return brandCounts.value[0].name
})

// Conteo por sistemas
const systemCounts = computed(() => {
  const counts = {}
  phones.value.forEach((p) => {
    const sys = p.system || 'Desconocido'
    counts[sys] = (counts[sys] || 0) + 1
  })
  return Object.keys(counts)
    .map((name) => ({
      name,
      count: counts[name],
    }))
    .sort((a, b) => b.count - a.count)
})

// Sistema con mas articulos
const topSystem = computed(() => {
  if (systemCounts.value.length === 0) return 'N/A'
  return systemCounts.value[0].name
})
</script>

<style scoped>
.filter-section {
  border-left: 6px solid var(--q-primary);
}
.stats-kpi-card {
  border-top: 4px solid var(--q-primary);
  border-radius: 8px;
  transition: transform 0.2s ease;
}
.stats-kpi-card:hover {
  transform: translateY(-3px);
}
.custom-font {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>
