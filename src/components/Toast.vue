<template>
  <ion-toast
    :is-open="show"
    :message="message"
    duration="3000"
    @didDismiss="show = false"
    position="bottom"
    color="primary"
  />
</template>

<script setup lang="ts">
import { IonToast } from '@ionic/vue'
import { ref, defineExpose } from 'vue'

const show = ref(false)
const message = ref('')

function present(msg: string) {
  message.value = msg
  show.value = true
}

defineExpose({ present })
</script>
