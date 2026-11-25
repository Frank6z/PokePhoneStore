import placeholderIcon from '@/assets/Icon/Zygarde.webp'
import { COUCH_DB, couchFileUrl } from '@/services/couchImages'

export { placeholderIcon }

const couchPrefix = `${COUCH_DB}/`

// Resuelve la imagen de un teléfono según su origen:
// - ruta relativa de CouchDB ("fpi-imagenes/<id>/archivo0.jpg") -> URL actual del .env
// - URL absoluta antigua de CouchDB (p. ej. "http://localhost:5984/fpi-imagenes/...")
//   -> se reescribe con la URL actual del .env, así siguen funcionando con el túnel
// - otra URL absoluta, blob: o data: -> se usa tal cual
// - nombre de archivo (datos semilla de phones.json) -> asset local
// - vacío -> placeholder
export const resolvePhoneImage = (image) => {
  if (!image) return placeholderIcon

  if (image.startsWith(couchPrefix)) return couchFileUrl(image)

  if (/^https?:/.test(image)) {
    try {
      const { pathname } = new URL(image)
      if (pathname.startsWith(`/${couchPrefix}`)) return couchFileUrl(pathname)
    } catch {
      // URL mal formada: se devuelve tal cual y q-img mostrará el placeholder
    }
    return image
  }

  if (/^(blob:|data:)/.test(image)) return image
  return new URL(`../assets/Phones/${image}`, import.meta.url).href
}

export const phoneImages = (phone) => (phone?.images || []).map(resolvePhoneImage)
