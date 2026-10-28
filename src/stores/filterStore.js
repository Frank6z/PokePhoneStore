import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useFilterStore = defineStore('filter', () => {
  const filters = reactive({
    brands: [],
    systems: [],
    screens: [],
    showNew: true,
    searchQuery: '',
  })

  // Estado del drawer de filtros (se controla desde IndexPage)
  const drawerOpen = ref(false)

  const toggleDrawer = () => {
    drawerOpen.value = !drawerOpen.value
  }

  return {
    filters,
    drawerOpen,
    toggleDrawer,
  }
})
