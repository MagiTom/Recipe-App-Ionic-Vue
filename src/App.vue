<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import {  defineComponent } from 'vue'
import {
  IonApp,

  IonRouterOutlet,
} from '@ionic/vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    return {
    };
  },
});
</script>

<style scoped lang="scss">

</style>
