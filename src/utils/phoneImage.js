import placeholderIcon from '@/assets/Icon/Zygarde.webp'

export { placeholderIcon }

// Resuelve la imagen de un teléfono según su origen:
// - URL absoluta (adjunto de CouchDB) -> se usa tal cual
// - nombre de archivo (datos semilla de phones.json) -> asset local
// - vacío -> placeholder
export const resolvePhoneImage = (image) => {
  if (!image) return placeholderIcon
  if (/^(https?:|blob:|data:)/.test(image)) return image
  return new URL(`../assets/Phones/${image}`, import.meta.url).href
}

export const phoneImages = (phone) => (phone?.images || []).map(resolvePhoneImage)
