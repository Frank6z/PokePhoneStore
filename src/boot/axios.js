import { defineBoot } from '#q-app'
import axios from 'axios'

const couchUser = import.meta.env.QCLI_COUCH_USER
const couchPass = import.meta.env.QCLI_COUCH_PASS

const api = axios.create({
  // CouchDB local. Desde Netlify (https) el navegador debe tener permitido
  // el contenido no seguro para el sitio, así puede leer de http://localhost.
  baseURL: 'http://localhost:5984',
  // Solo se envían credenciales si están definidas en el .env local. Sin ellas
  // las peticiones van anónimas (fpi-imagenes permite lectura/escritura pública).
  ...(couchUser && couchPass ? { auth: { username: couchUser, password: couchPass } } : {}),
})

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
