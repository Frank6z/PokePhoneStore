import { api } from '@/boot/axios'

// Base de datos de CouchDB dedicada EXCLUSIVAMENTE a imágenes.
// Cada documento solo contiene los campos nativos de CouchDB:
// _id (= id del documento en Firestore), _rev y _attachments.
const COUCH_DB = 'imagenesfpi'

const docPath = (docId) => `/${COUCH_DB}/${encodeURIComponent(docId)}`

// URL pública de un adjunto (la que se guarda como referencia en Firestore)
export const attachmentUrl = (docId, attname) =>
  `${api.defaults.baseURL}${docPath(docId)}/${encodeURIComponent(attname)}`

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

// Sube las imágenes como attachments del documento y devuelve sus URLs
export async function uploadImages(docId, files) {
  let rev = await ensureImageDoc(docId)
  const urls = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const attname = 'archivo' + i + '.jpg'

    const { data } = await api.put(`${docPath(docId)}/${attname}`, file, {
      params: { rev },
      headers: { 'Content-Type': file.type },
    })

    // cada adjunto genera una nueva revisión que se usa para el siguiente
    rev = data.rev
    urls.push(attachmentUrl(docId, attname))
  }

  return urls
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
