<template>
  <v-card>
    <v-card-title class="headline">インサイダーゲーム</v-card-title>
    <v-card-text>LINE にログインします</v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import liff from '@line/liff';
import { gameContentStore } from '~/store';

export default Vue.extend({
  name: 'Root',

  async mounted(): Promise<void> {
    gameContentStore.init();
    const roomId = this.$route.query.roomId ? this.$route.query.roomId.toString() : '';
    await gameContentStore.initLiff();
    if (!liff.isLoggedIn()) {
      await gameContentStore.loginLiff();
      return;
    }
    if (roomId) {
      this.$router.push({ path: 'main', query: { roomId } });
    } else {
      this.$router.push('main');
    }
  },
});
</script>
