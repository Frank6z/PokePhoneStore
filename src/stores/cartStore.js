import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  // Añadir un producto al carrito
  const addToCart = (phone) => {
    items.value.push(phone)
  }

  const removeFromCart = (index) => {
    items.value.splice(index, 1)
  }

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price, 0)
  })

  return {
    items,
    addToCart,
    removeFromCart,
    totalPrice,
  }
})
