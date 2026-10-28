<template>
  <q-page class="q-pa-md bg-grey-2 custom-font" v-if="phone">
    <div class="row justify-between items-center no-wrap q-mb-md q-gutter-x-sm">
      <q-btn
        push
        color="white"
        text-color="primary"
        icon="arrow_back"
        :label="$q.screen.gt.xs ? 'Volver al catálogo' : 'Volver'"
        to="/"
      />
      <q-btn push glossy color="secondary" icon="shopping_cart" label="Ver Carrito" to="/cart" />
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-white q-pa-md shadow-1 detail-card">
          <!-- Galería: la foto se muestra completa sobre un fondo difuminado de sí misma -->
          <q-carousel
            v-if="images.length > 0"
            animated
            swipeable
            v-model="slide"
            :thumbnails="images.length > 1"
            :arrows="images.length > 1"
            :navigation="false"
            infinite
            :height="galleryHeight"
            control-color="primary"
            class="rounded-borders gallery"
          >
            <q-carousel-slide
              v-for="(imgUrl, index) in images"
              :key="index"
              :name="index"
              :img-src="imgUrl"
              class="q-pa-none"
            >
              <div class="absolute-full gallery-backdrop" />
              <q-img
                :src="imgUrl"
                fit="contain"
                class="absolute-full"
                spinner-color="primary"
                :alt="`${phone.title} - imagen ${index + 1}`"
              />
            </q-carousel-slide>
          </q-carousel>

          <div
            v-else
            class="column flex-center bg-grey-1 rounded-borders text-grey-6"
            :style="{ height: galleryHeight }"
          >
            <img :src="placeholderIcon" alt="" class="no-image-icon q-mb-sm" />
            Sin imágenes
          </div>
        </q-card>
      </div>

      <!-- Columna Derecha: Información del Producto -->
      <div class="col-12 col-md-6">
        <q-card
          flat
          bordered
          class="bg-white q-pa-md shadow-1 column justify-between full-height detail-info"
        >
          <div>
            <div class="text-caption text-grey-7">
              {{ phone.brand }} • Estado: <strong>{{ phone.condition }}</strong>
            </div>
            <div class="text-h5 text-weight-bold text-primary q-mt-xs">{{ phone.title }}</div>
            <div class="text-h4 text-weight-bolder text-green-9 q-my-md">
              ${{ Number(phone.price).toFixed(2) }}
            </div>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Descripción</div>
            <p class="text-body1 text-grey-8">{{ phone.description }}</p>

            <div class="row q-gutter-xs q-my-md">
              <q-chip icon="phone_android" color="grey-3">Pantalla: {{ phone.screen }}"</q-chip>
              <q-chip icon="memory" color="grey-3">RAM: {{ phone.ram }}</q-chip>
              <q-chip icon="storage" color="grey-3">ROM: {{ phone.rom }}</q-chip>
              <q-chip icon="settings" color="grey-3">Sistema: {{ phone.system }}</q-chip>
            </div>
          </div>

          <div>
            <q-separator class="q-my-md" />
            <div class="row items-center justify-between q-col-gutter-sm">
              <div class="col-12 col-sm">
                <div class="text-caption text-grey-7">
                  Vendedor: <strong>{{ phone.seller }}</strong>
                </div>
                <div class="text-subtitle1 text-primary text-weight-bold">
                  Contacto: {{ phone.phoneContact }}
                </div>
              </div>
              <div class="col-12 col-sm-auto">
                <q-btn
                  push
                  glossy
                  color="green-8"
                  icon="add_shopping_cart"
                  label="Añadir al Carrito"
                  class="full-width"
                  @click="agregarAlCarrito"
                />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>

  <q-page class="flex flex-center bg-grey-2 custom-font" v-else>
    <div class="text-center">
      <template v-if="cargando">
        <img src="../assets/sceptile.gif" alt="" class="state-gif q-mb-md" />
        <div class="text-h6 text-grey-7">Cargando producto...</div>
      </template>
      <template v-else>
        <q-avatar size="72px" class="q-mb-md bg-green-1">
          <img src="../assets/Icon/Sceptile.webp" alt="" />
        </q-avatar>
        <div class="text-h6 text-grey-7 q-mb-md">Producto no encontrado</div>
        <q-btn push glossy color="primary" label="Volver al inicio" to="/" />
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCartStore } from '@/stores/cartStore'
import { db } from '@/boot/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { phoneImages, placeholderIcon } from '@/utils/phoneImage'

const route = useRoute()
const $q = useQuasar()
const cartStore = useCartStore()

const phone = ref(null)
const slide = ref(0)
const cargando = ref(true)

const images = computed(() => phoneImages(phone.value))
const galleryHeight = computed(() =>
  $q.screen.lt.sm ? '320px' : $q.screen.lt.md ? '420px' : '460px',
)

// Detalles de telefono: ID y busqueda en Firestore
onMounted(async () => {
  const phoneId = Number(route.query.id)
  try {
    const querySnapshot = await getDocs(collection(db, 'phones'))
    const phones = querySnapshot.docs.map((doc) => doc.data())
    phone.value = phones.find((p) => Number(p.id) === phoneId)
  } catch (error) {
    console.error('Error al obtener los detalles del teléfono:', error)
  } finally {
    cargando.value = false
  }
})

// Agregar al carrito
function agregarAlCarrito() {
  cartStore.addToCart(phone.value)
  $q.notify({
    message: `¡${phone.value.title} agregado al carrito!`,
    icon: 'shopping_cart',
    color: 'green-10',
    position: 'top',
    timeout: 2000,
  })
}
</script>

<style scoped>
/* Galería con proporción uniforme para fotos verticales, horizontales o cuadradas */
.gallery {
  background: #f5f5f5;
}
.gallery :deep(.q-carousel__slide) {
  background-size: cover;
  background-position: center;
}
.gallery-backdrop {
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  background: rgba(255, 255, 255, 0.55);
}
.gallery :deep(.q-carousel__thumbnail) {
  width: 64px;
  height: 64px;
  object-fit: cover;
}
.no-image-icon {
  width: 80px;
  opacity: 0.45;
  filter: grayscale(40%);
}

@media (max-width: 599px) {
  .detail-card {
    padding: 8px !important;
  }
  .gallery :deep(.q-carousel__thumbnail) {
    width: 48px;
    height: 48px;
  }
  .detail-info {
    padding: 12px !important;
  }
}

.state-gif {
  height: 110px;
}
.custom-font {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>
