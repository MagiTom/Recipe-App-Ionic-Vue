<template>
  <ion-app>
    <p>jdsfhjkadf</p>
    <ion-router-outlet></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
});
</script>

<style>
/* Możesz dodać globalne style tutaj */
</style>
