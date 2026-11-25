import { api } from '@/boot/axios'

// Base de datos de CouchDB dedicada EXCLUSIVAMENTE a imágenes.
// Cada documento solo contiene los campos nativos de CouchDB:
// _id (= id del documento en Firestore), _rev y _attachments.
export const COUCH_DB = 'fpi-imagenes'

const docPath = (docId) => `/${COUCH_DB}/${encodeURIComponent(docId)}`

// Ruta RELATIVA de un adjunto (lo que se guarda en Firestore), sin dominio:
// "fpi-imagenes/<id>/archivo0.jpg". Así, si cambia la URL de CouchDB
// (p. ej. el túnel de Cloudflare), no hay que tocar los datos guardados.
export const attachmentPath = (docId, attname) =>
  `${COUCH_DB}/${encodeURIComponent(docId)}/${encodeURIComponent(attname)}`

// Convierte una ruta relativa en la URL completa usando la URL actual del .env
export const couchFileUrl = (path) =>
  `${String(api.defaults.baseURL || '').replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`

// Crea el documento vacío (solo _id/_rev) o, si ya existe, lo normaliza
// eliminando cualquier campo que no sea estructural. Devuelve el _rev actual.
async function ensureImageDoc(docId) {
  try {
    const { data } = await api.put(docPath(docId), {})
    return data.rev
  } catch (error) {
    if (error.response?.status !== 409) throw error

    const { data: existing } = await api.get(docPath(docId))
    const cleanDoc = { _rev: existing._rev }
    if (existing._attachments) cleanDoc._attachments = existing._attachments

    const { data } = await api.put(docPath(docId), cleanDoc)
    return data.rev
  }
}

// Sube las imágenes como attachments del documento y devuelve sus rutas relativas
export async function uploadImages(docId, files) {
  let rev = await ensureImageDoc(docId)
  const paths = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const attname = 'archivo' + i + '.jpg'

    const { data } = await api.put(`${docPath(docId)}/${attname}`, file, {
      params: { rev },
      headers: { 'Content-Type': file.type },
    })

    // cada adjunto genera una nueva revisión que se usa para el siguiente
    rev = data.rev
    paths.push(attachmentPath(docId, attname))
  }

  return paths
}

// Elimina el documento de imágenes (con todos sus attachments)
export async function deleteImageDoc(docId) {
  try {
    const { data } = await api.get(docPath(docId))
    await api.delete(docPath(docId), { params: { rev: data._rev } })
  } catch (error) {
    // si no existe en CouchDB no hay nada que limpiar
    if (error.response?.status !== 404) throw error
  }
}
