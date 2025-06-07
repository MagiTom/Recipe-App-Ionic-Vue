<template>
  <ion-item lines="full" class="image-picker">
    <ion-label class="ion-text-wrap">{{ label }}</ion-label>

    <div class="buttons">
      <ion-button fill="outline" size="default" @click="openFileInput">
        <ion-icon slot="icon-only" :icon="imageIcon" />
      </ion-button>

      <ion-button fill="outline" size="default" @click="takePhoto">
        <ion-icon slot="icon-only" :icon="cameraIcon" />
      </ion-button>

      <ion-button
        fill="outline"
        color="danger"
        size="default"
        :disabled="!currentPreview"
        @click="removeImage"
      >
        <ion-icon slot="icon-only" :icon="trashIcon" />
      </ion-button>
    </div>

    <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileUpload" />

    <ion-thumbnail v-if="currentPreview" @click="openFileInput">
      <img :src="currentPreview" alt="Podgląd zdjęcia" />
    </ion-thumbnail>
  </ion-item>
</template>

<script lang="ts">
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonThumbnail
} from '@ionic/vue'
import { cameraOutline, imageOutline, trashOutline } from 'ionicons/icons'
import { computed, defineComponent, ref, type PropType } from 'vue'

export default defineComponent({
  name: 'ImagePicker',
  components: {
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonThumbnail,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    initialImage: {
      type: [String, null] as PropType<string | null>,
      default: null,
    },
  },
  emits: ['update:image'],
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null)
    const imagePreview = ref<string | null>(null)

    const currentPreview = computed(() => imagePreview.value || props.initialImage)

    const emitFile = (file: File | null) => {
      emit('update:image', file)
    }

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0] || null
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
          imagePreview.value = reader.result as string
        }
        reader.readAsDataURL(file)
        emitFile(file)
      }
    }

    const openFileInput = () => {
      fileInput.value?.click()
    }

    const takePhoto = async () => {
      try {
        const image = await Camera.getPhoto({
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          quality: 80,
        })

        if (image.base64String) {
          const blob = await fetch(`data:image/jpeg;base64,${image.base64String}`).then(res =>
            res.blob(),
          )
          const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
          imagePreview.value = URL.createObjectURL(file)
          emitFile(file)
        }
      } catch (err) {
        console.warn('Nie udało się zrobić zdjęcia:', err)
      }
    }

    const removeImage = () => {
      imagePreview.value = null
      emitFile(null)
      if (fileInput.value) fileInput.value.value = ''
    }

    return {
      fileInput,
      imagePreview,
      currentPreview,
      openFileInput,
      handleFileUpload,
      takePhoto,
      removeImage,
      imageIcon: imageOutline,
      trashIcon: trashOutline,
      cameraIcon: cameraOutline,
    }
  },
})
</script>

<style scoped>
.buttons {
  display: flex;
  gap: 0.2rem;
  padding-block: 0.5rem;
}
.image-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
ion-thumbnail {
  width: 64px;
  height: 64px;
  margin-left: 0.5rem;
}
</style>
