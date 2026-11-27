import { ref } from 'vue'
import defaultPhoneImage from '@/assets/Imagen_generica/telefono.webp'
import { COUCH_DB, couchFileUrl } from '@/services/couchImages'

export { defaultPhoneImage }

const couchPrefix = `${COUCH_DB}/`

// ¿Responde CouchDB desde este navegador?
// null = verificando · true = disponible · false = no disponible
// Si no está disponible (otro equipo sin CouchDB, contenido no seguro bloqueado,
// servidor apagado...) se muestra la imagen por defecto SIN pedir las imágenes,
// así no aparecen imágenes rotas ni un error por cada foto.
export const couchOnline = ref(null)

let availabilityCheck = null
// force: vuelve a comprobar en lugar de usar el resultado anterior
export function checkCouchAvailability({ force = false } = {}) {
  if (!availabilityCheck || force) {
    availabilityCheck = fetch(couchFileUrl(''), { signal: AbortSignal.timeout(3000) })
      .then((response) => {
        couchOnline.value = response.ok
      })
      .catch(() => {
        couchOnline.value = false
      })
      .then(() => couchOnline.value)
  }
  return availabilityCheck
}
checkCouchAvailability()

// Ruta relativa de CouchDB contenida en el valor guardado, o null si no es de CouchDB.
// Acepta la ruta nueva ("fpi-imagenes/<id>/archivo0.jpg") y las URLs absolutas
// antiguas ("http://localhost:5984/fpi-imagenes/...").
const getCouchPath = (image) => {
  if (image.startsWith(couchPrefix)) return image
  if (/^https?:/.test(image)) {
    try {
      const { pathname } = new URL(image)
      if (pathname.startsWith(`/${couchPrefix}`)) return pathname
    } catch {
      // URL mal formada
    }
  }
  return null
}

// Resuelve la imagen de un teléfono:
// - vacío -> imagen por defecto
// - imagen de CouchDB -> URL con la dirección actual, o imagen por defecto si
//   CouchDB no está disponible (o aún se está verificando)
// - otra URL absoluta, blob: o data: -> se usa tal cual
// - cualquier otro valor (p. ej. nombres de archivo antiguos) -> imagen por defecto
export const resolvePhoneImage = (image) => {
  if (!image) return defaultPhoneImage

  const couchPath = getCouchPath(image)
  if (couchPath) return couchOnline.value ? couchFileUrl(couchPath) : defaultPhoneImage

  if (/^(https?:|blob:|data:)/.test(image)) return image
  return defaultPhoneImage
}

export const isDefaultImage = (src) => src === defaultPhoneImage

// Imágenes de la galería. Si ninguna se puede mostrar devuelve [] para que la
// página use su bloque de "imagen por defecto" en lugar de repetirla varias veces.
export const phoneImages = (phone) => {
  const images = (phone?.images || []).map(resolvePhoneImage)
  return images.every(isDefaultImage) ? [] : images
}
