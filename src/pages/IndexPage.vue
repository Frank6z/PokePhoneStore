<template>
  <q-page class="bg-grey-2 q-pa-md custom-font">
    <!-- CABECERA CON CONTROL DEL DRAWER DE FILTROS -->
    <div class="row items-center justify-between no-wrap q-mb-md q-gutter-x-sm">
      <div class="text-h5 text-primary text-weight-bold ellipsis">Catálogo de Dispositivos</div>
      <q-btn
        push
        glossy
        no-caps
        color="primary"
        :icon="filterStore.drawerOpen ? 'filter_list_off' : 'filter_list'"
        :label="
          $q.screen.gt.xs ? (filterStore.drawerOpen ? 'Ocultar filtros' : 'Filtros') : undefined
        "
        :round="$q.screen.lt.sm"
        aria-label="Mostrar u ocultar filtros"
        @click="filterStore.toggleDrawer()"
      >
        <q-badge v-if="activeFiltersCount > 0" color="accent" text-color="dark" floating>
          {{ activeFiltersCount }}
        </q-badge>
      </q-btn>
    </div>

    <!-- FILTROS SUPERIORES -->
    <q-card flat bordered class="bg-white q-pa-md q-mb-md shadow-1 filters-card">
      <div
        class="row items-center"
        :class="$q.screen.lt.sm ? 'q-col-gutter-sm' : 'q-col-gutter-md'"
      >
        <div class="col-6 col-sm-4">
          <q-input
            v-model.number="minPrecio"
            type="number"
            outlined
            dense
            label="Precio Min."
            color="primary"
            clearable
          />
        </div>
        <div class="col-6 col-sm-4">
          <q-input
            v-model.number="maxPrecio"
            type="number"
            outlined
            dense
            label="Precio Max."
            color="primary"
            clearable
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-select
            v-model="sortBy"
            :options="sortOptions"
            outlined
            dense
            emit-value
            map-options
            label="Ordenar Por"
            color="primary"
            clearable
          >
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
    </q-card>

    <!-- PRODUCTOS FILTRADOS -->
    <!-- Cargando catálogo -->
    <div v-if="cargandoCatalogo" class="column flex-center q-pa-xl text-grey-7">
      <img src="../assets/torterra.gif" alt="" class="state-gif q-mb-md" />
      Cargando catálogo...
    </div>

    <div v-else class="row" :class="$q.screen.lt.sm ? 'q-col-gutter-sm' : 'q-col-gutter-md'">
      <div v-for="phone in filteredAndSortedPhones" :key="phone.id" class="col-6 col-md-4 col-lg-3">
        <q-card
          class="column no-wrap full-height shadow-2 cursor-pointer product-card"
          @click="verDetalles(phone.id)"
        >
          <!-- Imagen del producto: marco 4:3 fijo, la foto se recorta sin deformarse -->
          <div class="relative-position">
            <q-img
              :src="resolvePhoneImage(phone.images?.[0])"
              :ratio="4 / 3"
              :fit="phone.images?.length ? 'cover' : 'contain'"
              spinner-color="primary"
              class="product-image"
              :class="{ 'is-placeholder': !phone.images?.length }"
              :alt="phone.title"
            >
              <template #error>
                <div class="absolute-full flex flex-center bg-grey-1 image-fallback">
                  <img :src="placeholderIcon" alt="" class="no-image-icon" />
                </div>
              </template>
            </q-img>

            <div class="absolute-top row items-start justify-between q-pa-sm card-overlay">
              <q-badge :color="colorCondition(phone.condition)" text-color="white">
                {{ phone.condition }}
              </q-badge>
              <q-btn
                push
                round
                dense
                size="sm"
                color="negative"
                icon="delete"
                aria-label="Eliminar"
                @click.stop="confirmarBorrado(phone.firebaseId)"
              />
            </div>
          </div>

          <q-card-section class="col card-body">
            <div class="text-caption text-grey-7 ellipsis">{{ phone.brand }}</div>
            <div class="text-subtitle1 text-weight-bold text-primary card-title">
              {{ phone.title }}
            </div>
            <div class="text-h6 text-weight-bolder text-green-9 q-mt-xs">
              ${{ Number(phone.price).toFixed(2) }}
            </div>
            <div class="text-caption text-grey-6 q-mt-xs">Lanzamiento: {{ phone.releaseDate }}</div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="card-footer">
            <span class="text-caption text-grey-7 ellipsis">Vendedor: {{ phone.seller }}</span>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div
      v-if="!cargandoCatalogo && filteredAndSortedPhones.length === 0"
      class="column flex-center text-center q-pa-xl text-grey-6"
    >
      <img src="../assets/venusaur.gif" alt="" class="state-gif q-mb-md" />
      No se encontraron dispositivos que coincidan con los criterios de busqueda
    </div>

    <!-- Acceso rápido a filtros en móvil al hacer scroll -->
    <q-page-sticky v-if="$q.screen.lt.md" position="bottom-right" :offset="[16, 16]">
      <q-btn
        fab
        push
        glossy
        color="primary"
        icon="tune"
        aria-label="Abrir filtros"
        @click="filterStore.toggleDrawer()"
      >
        <q-badge v-if="activeFiltersCount > 0" color="accent" text-color="dark" floating>
          {{ activeFiltersCount }}
        </q-badge>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useFilterStore } from '@/stores/filterStore'
import { db } from '@/boot/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { deleteImageDoc } from '@/services/couchImages'
import { resolvePhoneImage, placeholderIcon } from '@/utils/phoneImage'

const router = useRouter()
const $q = useQuasar()
const filterStore = useFilterStore()

const phoneList = ref([])
const minPrecio = ref(null)
const maxPrecio = ref(null)
const sortBy = ref(null)
const cargandoCatalogo = ref(true)

// Cargar telefonos desde Firestore
const cargarTelefonos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'phones'))
    phoneList.value = querySnapshot.docs.map((document) => ({
      firebaseId: document.id,
      ...document.data(),
    }))
  } catch (error) {
    console.error('Error al cargar los teléfonos de Firestore: ', error)
  } finally {
    cargandoCatalogo.value = false
  }
}

onMounted(() => {
  cargarTelefonos()
})

// Borrar telefono
const confirmarBorrado = (firebaseId) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar este teléfono de la base de datos?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await deleteDoc(doc(db, 'phones', firebaseId))
      $q.notify({ color: 'positive', message: 'Teléfono eliminado con éxito', icon: 'done' })
      cargarTelefonos()

      // Limpiar tambien el documento de imagenes en CouchDB
      try {
        await deleteImageDoc(firebaseId)
      } catch (couchError) {
        console.error('No se pudieron eliminar las imágenes de CouchDB: ', couchError)
        $q.notify({
          color: 'warning',
          message: 'El teléfono se eliminó, pero sus imágenes no pudieron borrarse de CouchDB',
          icon: 'warning',
        })
      }
    } catch (error) {
      console.error('Error al eliminar: ', error)
      $q.notify({ color: 'negative', message: 'No se pudo eliminar el registro', icon: 'error' })
    }
  })
}

// Ordenamiento y filtrado de productos
const sortOptions = [
  { label: 'Precio: Menor a Mayor', icon: 'arrow_upward', value: 'price_asc' },
  { label: 'Precio: Mayor a Menor', icon: 'arrow_downward', value: 'price_desc' },
  { label: 'Fecha: Más antiguos', icon: 'arrow_upward', value: 'date_asc' },
  { label: 'Fecha: Más recientes', icon: 'arrow_downward', value: 'date_desc' },
]

const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0)
  const [day, month, year] = dateStr.split('/')
  return new Date(`${year}-${month}-${day}`)
}

const filteredAndSortedPhones = computed(() => {
  let result = [...phoneList.value]

  if (filterStore.filters.searchQuery && filterStore.filters.searchQuery.trim() !== '') {
    const query = filterStore.filters.searchQuery.toLowerCase().trim()
    result = result.filter(
      (phone) =>
        (phone.title && phone.title.toLowerCase().includes(query)) ||
        (phone.brand && phone.brand.toLowerCase().includes(query)) ||
        (phone.system && phone.system.toLowerCase().includes(query)),
    )
  }

  if (!filterStore.filters.showNew) {
    result = result.filter((phone) => phone.condition && phone.condition.toLowerCase() !== 'nuevo')
  }

  if (filterStore.filters.brands.length > 0) {
    result = result.filter(
      (phone) =>
        phone.brand &&
        filterStore.filters.brands.some((b) => b.toLowerCase() === phone.brand.toLowerCase()),
    )
  }

  if (filterStore.filters.systems.length > 0) {
    result = result.filter(
      (phone) =>
        phone.system &&
        filterStore.filters.systems.some((s) => s.toLowerCase() === phone.system.toLowerCase()),
    )
  }

  if (filterStore.filters.screens.length > 0) {
    result = result.filter((phone) => {
      return filterStore.filters.screens.some((val) => {
        if (val === '6.0') return phone.screen >= 6.0
        if (val === '5.5') return phone.screen >= 5.5 && phone.screen < 6.0
        if (val === '5.0') return phone.screen < 5.5
        return false
      })
    })
  }

  if (minPrecio.value !== null && minPrecio.value !== '') {
    result = result.filter((phone) => phone.price >= minPrecio.value)
  }

  if (maxPrecio.value !== null && maxPrecio.value !== '') {
    result = result.filter((phone) => phone.price <= maxPrecio.value)
  }

  if (sortBy.value) {
    result.sort((a, b) => {
      if (sortBy.value === 'price_asc') return a.price - b.price
      if (sortBy.value === 'price_desc') return b.price - a.price
      if (sortBy.value === 'date_asc') return parseDate(a.releaseDate) - parseDate(b.releaseDate)
      if (sortBy.value === 'date_desc') return parseDate(b.releaseDate) - parseDate(a.releaseDate)
      return 0
    })
  }

  return result
})

// Cantidad de filtros activos del drawer (para el badge del botón)
const activeFiltersCount = computed(
  () =>
    filterStore.filters.brands.length +
    filterStore.filters.systems.length +
    filterStore.filters.screens.length +
    (filterStore.filters.showNew ? 0 : 1),
)

// Cambio de color dependiendo del estado
const colorCondition = (condition) => {
  if (!condition) return 'grey-5'
  switch (condition.toUpperCase()) {
    case 'NUEVO':
      return 'green-14'
    case 'USADO':
      return 'green-10'
    default:
      return 'grey-5'
  }
}

const verDetalles = (id) => {
  router.push({ path: '/second', query: { id } })
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease;
}
.product-card:hover {
  transform: translateY(-4px);
}
.product-card:hover .product-image :deep(.q-img__image) {
  transform: scale(1.04);
}

/* Imagen: marco fijo 4:3 con fondo neutro mientras carga */
.product-image {
  background: #f5f5f5;
}
.product-image :deep(.q-img__image) {
  transition: transform 0.3s ease;
}
.product-image.is-placeholder :deep(.q-img__image) {
  padding: 18%;
  opacity: 0.45;
  filter: grayscale(40%);
}
.card-overlay {
  pointer-events: none;
}
.card-overlay > * {
  pointer-events: auto;
}

/* Título limitado a 2 líneas para que todas las tarjetas tengan la misma altura */
.card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  min-height: 2.6em;
}
.card-footer {
  padding: 8px 16px;
}
.card-footer > span {
  min-width: 0;
}

/* Móvil: tarjetas compactas en 2 columnas */
@media (max-width: 599px) {
  .filters-card {
    padding: 10px !important;
  }
  .card-body {
    padding: 8px 10px;
  }
  .card-title {
    font-size: 0.875rem;
  }
  .card-body .text-h6 {
    font-size: 1rem;
    line-height: 1.4rem;
  }
  .card-footer {
    padding: 6px 10px;
  }
  .card-overlay {
    padding: 6px;
  }
}

.state-gif {
  height: 96px;
}
.no-image-icon {
  width: 72px;
  opacity: 0.45;
  filter: grayscale(40%);
}

.custom-font {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>
