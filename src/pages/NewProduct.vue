<template>
  <q-page class="q-pa-md bg-grey-2 custom-font">
    <div class="row no-wrap items-center justify-center q-mb-md">
      <div class="text-h4 text-green-8 text-weight-bold">NUEVO ANUNCIO</div>
      <q-avatar size="45px" class="q-ml-sm bg-green-8 shadow-2">
        <img alt="Logo avatar Rayquaza" src="../assets/Icon/Rayquaza.webp" />
      </q-avatar>
    </div>

    <q-form @submit.prevent="saveProduct">
      <div class="row q-col-gutter-md justify-center">
        <div class="col-12 col-md-5">
          <q-card class="bg-green-3 shadow-1 q-pa-md full-height form-card" flat bordered>
            <div
              class="row no-wrap items-center text-subtitle1 text-green-10 text-weight-bold q-mb-sm"
            >
              <q-avatar size="28px" class="q-mr-sm bg-green-2 section-icon">
                <img alt="" src="../assets/Icon/Torterra.webp" />
              </q-avatar>
              Informacion General
            </div>
            <div class="q-col-gutter-y-md">
              <div>
                <label class="block text-weight-bold text-green-9 q-mb-xs"
                  >Titulo del anuncio</label
                >
                <q-input
                  bg-color="green-2"
                  v-model="newProduct.title"
                  outlined
                  dense
                  clearable
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-9 q-mb-xs">Vendedor</label>
                <q-input
                  bg-color="green-2"
                  v-model="newProduct.seller"
                  outlined
                  dense
                  clearable
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-9 q-mb-xs">Telefono</label>
                <q-input
                  bg-color="green-2"
                  v-model="newProduct.phoneContact"
                  mask="####-####"
                  outlined
                  dense
                  clearable
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-9 q-mb-xs">DESCRIPCION</label>
                <q-input
                  bg-color="green-2"
                  v-model="newProduct.description"
                  outlined
                  dense
                  type="textarea"
                  rows="4"
                  clearable
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-9 q-mb-xs">PRECIO</label>
                <q-input
                  bg-color="green-2"
                  v-model.number="newProduct.price"
                  outlined
                  dense
                  type="number"
                  prefix="$"
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-9 q-mb-xs"
                  >Fecha de Lanzamiento</label
                >
                <q-input
                  bg-color="green-2"
                  v-model="newProduct.releaseDate"
                  outlined
                  dense
                  mask="##/##/####"
                  placeholder="DD/MM/YYYY"
                  clearable
                  required
                />
              </div>
            </div>
          </q-card>
        </div>

        <!-- Columna Derecha: Especificaciones Técnicas -->
        <div class="col-12 col-md-5">
          <q-card class="bg-green-3 shadow-1 q-pa-md full-height form-card" flat bordered>
            <div
              class="row no-wrap items-center text-subtitle1 text-green-10 text-weight-bold q-mb-sm"
            >
              <q-avatar size="28px" class="q-mr-sm bg-green-2 section-icon">
                <img alt="" src="../assets/Icon/Tyranitar.webp" />
              </q-avatar>
              Especificaciones Tecnicas
            </div>

            <div class="q-col-gutter-y-md">
              <div>
                <label class="block text-weight-bold text-green-10 q-mb-xs">ESTADO</label>
                <div class="q-gutter-sm">
                  <q-radio
                    v-model="newProduct.condition"
                    val="Nuevo"
                    label="Nuevo"
                    color="green-9"
                  />
                  <q-radio
                    v-model="newProduct.condition"
                    val="Usado"
                    label="Usado"
                    color="green-9"
                  />
                </div>
              </div>

              <div>
                <label class="block text-weight-bold text-green-10 q-mb-xs">MARCA</label>
                <q-select
                  bg-color="green-4"
                  v-model="newProduct.brand"
                  :options="['Samsung', 'Huawei', 'Nokia', 'iPhone', 'Xiaomi']"
                  outlined
                  dense
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-10 q-mb-xs">MODELO</label>
                <q-input
                  bg-color="green-4"
                  v-model="newProduct.name"
                  outlined
                  dense
                  clearable
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-10 q-mb-xs"
                  >PANTALLA (Pulgadas)</label
                >
                <q-input
                  bg-color="green-4"
                  v-model.number="newProduct.screen"
                  type="number"
                  step="0.1"
                  outlined
                  dense
                  clearable
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-10 q-mb-xs">SISTEMA</label>
                <q-select
                  bg-color="green-4"
                  v-model="newProduct.system"
                  :options="['Android', 'iOS', 'Windows']"
                  outlined
                  dense
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-10 q-mb-xs"
                  >ROM (Almacenamiento Interno)</label
                >
                <q-input
                  bg-color="green-4"
                  v-model="newProduct.rom"
                  outlined
                  dense
                  clearable
                  placeholder="ej. 256 GB"
                  required
                />
              </div>

              <div>
                <label class="block text-weight-bold text-green-10 q-mb-xs">RAM</label>
                <q-input
                  bg-color="green-4"
                  v-model="newProduct.ram"
                  outlined
                  dense
                  clearable
                  placeholder="ej. 8 GB"
                  required
                />
              </div>
            </div>
          </q-card>
        </div>

        <!-- Imagenes para CouchDB -->
        <div class="col-12 col-md-10">
          <q-card class="bg-green-3 shadow-1 q-pa-md form-card" flat bordered>
            <div
              class="row no-wrap items-center text-subtitle1 text-green-10 text-weight-bold q-mb-sm"
            >
              <q-avatar size="28px" class="q-mr-sm bg-green-2 section-icon">
                <img alt="" src="../assets/Icon/Venusaur.webp" />
              </q-avatar>
              Seleccione las Imagenes para el dispositivo
            </div>
            <q-file
              style="width: 100%; max-width: 300px"
              v-model="filesImages"
              filled
              rounded
              bg-color="green-2"
              label="Restricted to images"
              multiple
              accept=".jpg, image/*"
              @rejected="onRejected"
            />

            <!-- Vista previa con el mismo encuadre 4:3 que usan las tarjetas del catálogo -->
            <div v-if="previews.length" class="row q-col-gutter-sm q-mt-sm">
              <div v-for="(src, index) in previews" :key="src" class="col-4 col-sm-3 col-md-2">
                <q-img
                  :src="src"
                  :ratio="4 / 3"
                  fit="cover"
                  class="rounded-borders shadow-1 preview-image"
                  :alt="`Vista previa ${index + 1}`"
                >
                  <div v-if="index === 0" class="absolute-bottom text-center preview-label">
                    Portada
                  </div>
                </q-img>
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <!-- GUARDAR/CANCELAR -->
      <div class="row justify-center q-mt-lg q-col-gutter-md form-actions">
        <div class="col-12 col-sm-auto">
          <q-btn
            push
            label="Cancelar"
            color="grey-3"
            text-color="grey-9"
            to="/"
            :size="$q.screen.lt.sm ? 'md' : 'lg'"
            class="full-width"
          />
        </div>
        <div class="col-12 col-sm-auto">
          <q-btn
            type="submit"
            :loading="cargando"
            label="Guardar Anuncio"
            glossy
            push
            color="green-9"
            text-color="white"
            :size="$q.screen.lt.sm ? 'md' : 'lg'"
            icon="save"
            class="full-width"
          >
            <template #loading>
              <img alt="" src="../assets/rayquaza.gif" class="saving-gif q-mr-sm" />
              Guardando...
            </template>
          </q-btn>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { db } from '@/boot/firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { uploadImages, deleteImageDoc } from '@/services/couchImages'

const router = useRouter()
const $q = useQuasar()
const cargando = ref(false)
const filesImages = ref(null)
const previews = ref([])

// URLs temporales para previsualizar las imágenes (se liberan al cambiar o salir)
const revokePreviews = () => previews.value.forEach((url) => URL.revokeObjectURL(url))

watch(filesImages, (files) => {
  revokePreviews()
  previews.value = (files || []).map((file) => URL.createObjectURL(file))
})

onBeforeUnmount(revokePreviews)

const newProduct = ref({
  title: '',
  condition: 'Nuevo',
  brand: '',
  name: '',
  screen: '',
  system: 'Android',
  rom: '',
  ram: '',
  seller: '',
  phoneContact: '',
  description: '',
  price: '',
  releaseDate: '',
})

function onRejected(rejectedEntries) {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} archivo(s) no pasaron las restricciones de validación`,
  })
}

const saveProduct = async () => {
  cargando.value = true
  try {
    // 1. Guardar el documento en Firestore para obtener su ID
    const docRef = await addDoc(collection(db, 'phones'), {
      id: Date.now(),
      title: newProduct.value.title,
      condition: newProduct.value.condition,
      brand: newProduct.value.brand,
      name: newProduct.value.name,
      screen: Number(newProduct.value.screen),
      system: newProduct.value.system,
      rom: newProduct.value.rom,
      ram: newProduct.value.ram,
      seller: newProduct.value.seller,
      phoneContact: newProduct.value.phoneContact,
      description: newProduct.value.description,
      price: Number(newProduct.value.price),
      releaseDate: newProduct.value.releaseDate,
    })

    const firebaseId = docRef.id

    // 2. Subir las imagenes a CouchDB (documento con solo _id, _rev y _attachments)
    if (filesImages.value && filesImages.value.length > 0) {
      try {
        const imageUrls = await uploadImages(firebaseId, filesImages.value)

        // 3. Guardar en Firestore solo la referencia a los adjuntos de CouchDB
        await updateDoc(doc(db, 'phones', firebaseId), { images: imageUrls })
      } catch (imageError) {
        // Revertir para no dejar un producto sin imagenes ni adjuntos huerfanos
        await Promise.allSettled([
          deleteDoc(doc(db, 'phones', firebaseId)),
          deleteImageDoc(firebaseId),
        ])
        throw imageError
      }
    }

    $q.notify({
      type: 'positive',
      message: '¡Anuncio e imágenes guardados con éxito!',
      position: 'top',
    })

    router.push('/')
  } catch (error) {
    console.error('Error al guardar el producto o subir imágenes: ', error)
    $q.notify({
      type: 'negative',
      message: 'Hubo un error al registrar el producto',
      position: 'top',
    })
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.custom-font {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.section-icon {
  flex-shrink: 0;
}
.saving-gif {
  height: 28px;
}
.preview-image {
  background: #f5f5f5;
}
.preview-label {
  padding: 2px 4px;
  font-size: 0.7rem;
}

@media (max-width: 599px) {
  .form-card {
    padding: 12px !important;
  }
}
</style>
