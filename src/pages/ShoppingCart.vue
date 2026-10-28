<template>
  <q-page class="q-pa-md bg-grey-2" style="max-width: 900px; margin: 0 auto">
    <div class="row items-center justify-between q-mb-md q-gutter-y-sm">
      <div class="text-h5 text-primary text-weight-bold">Carrito de Compras</div>
      <q-btn
        push
        color="white"
        text-color="grey-8"
        icon="arrow_back"
        :label="$q.screen.gt.xs ? 'Seguir viendo dispositivos' : 'Seguir viendo'"
        to="/"
      />
    </div>

    <div v-if="cartStore.items.length > 0">
      <q-card flat bordered class="bg-white q-pa-md shadow-1 q-mb-md cart-card">
        <q-list separator>
          <q-item v-for="(item, index) in cartStore.items" :key="index">
            <q-item-section avatar>
              <q-avatar rounded :size="$q.screen.lt.sm ? '52px' : '64px'" class="cart-thumb">
                <q-img
                  :src="resolvePhoneImage(item.images?.[0])"
                  :ratio="1"
                  :fit="item.images?.length ? 'cover' : 'contain'"
                  no-spinner
                  class="fit"
                  :alt="item.title"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold text-primary" lines="2">
                {{ item.title }}
              </q-item-label>
              <q-item-label caption class="text-grey-7">Vendedor: {{ item.seller }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="text-h6 text-green-9 text-weight-bold cart-price">
                ${{ item.price.toFixed(2) }}
              </div>
            </q-item-section>

            <q-item-section side>
              <q-btn
                push
                round
                dense
                color="negative"
                icon="delete"
                aria-label="Quitar del carrito"
                @click="cartStore.removeFromCart(index)"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator class="q-my-md" />

        <div class="row justify-between items-center q-px-md">
          <div class="text-h6 text-weight-bold">Total a pagar:</div>
          <div class="text-h5 text-weight-bolder text-green-9">
            ${{ cartStore.totalPrice.toFixed(2) }}
          </div>
        </div>
      </q-card>

      <div class="row justify-end">
        <q-btn
          push
          glossy
          color="primary"
          icon="check"
          label="Proceder al pago"
          size="lg"
          class="text-weight-bold col-12 col-sm-auto"
          @click="finalizarCompra"
        />
      </div>
    </div>

    <q-card flat bordered class="bg-white q-pa-md shadow-1" v-else>
      <div class="text-center q-pa-xl text-grey-6">
        <img src="../assets/zygarde.gif" alt="" class="empty-gif q-mb-md" />
        <div class="text-h6">Tu carrito está vacío por ahora</div>
        <p class="text-caption text-grey-5 q-mt-sm">
          Explora el catálogo y añade dispositivos para simular tu compra.
        </p>
        <q-btn push glossy color="primary" label="Ir al Catálogo" to="/" class="q-mt-md" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { resolvePhoneImage } from '@/utils/phoneImage'

const cartStore = useCartStore()
const $q = useQuasar()
const router = useRouter()

function finalizarCompra() {
  // Guardar la venta simulada
  const currentSales = JSON.parse(localStorage.getItem('simulated_sales') || '[]')
  const newSale = {
    date: new Date().toLocaleDateString(),
    total: cartStore.totalPrice,
    itemsCount: cartStore.items.length,
  }
  currentSales.push(newSale)
  localStorage.setItem('simulated_sales', JSON.stringify(currentSales))

  $q.notify({
    color: 'green-13',
    message: '¡Gracias por tu pedido! Venta registrada en estadísticas.',
    position: 'top',
    timeout: 3000,
  })

  cartStore.items = []
  router.push('/')
}
</script>

<style scoped>
.empty-gif {
  height: 96px;
}
.cart-thumb {
  background: #f5f5f5;
  overflow: hidden;
}

@media (max-width: 599px) {
  .cart-card {
    padding: 8px !important;
  }
  .cart-card :deep(.q-item) {
    padding-left: 4px;
    padding-right: 4px;
  }
  .cart-card :deep(.q-item__section--avatar) {
    min-width: 60px;
  }
  .cart-price {
    font-size: 0.95rem;
  }
}
</style>
