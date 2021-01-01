<template>
  <v-card>
    <v-card-title class="headline">インサイダーゲーム</v-card-title>
    <v-card-text>LINE にログインします</v-card-text>
    <v-card-text>{{ debugMsg }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import liff from '@line/liff';
import { gameContentStore } from '~/store';

export default Vue.extend({
  name: 'Root',

  data(): { debugMsg: string } {
    return {
      debugMsg: '',
    };
  },
  async mounted(): Promise<void> {
    this.debugMsg = 'before init store';
    gameContentStore.init();
    this.debugMsg = 'after init store';
    const roomId = this.$route.query.roomId ? this.$route.query.roomId.toString() : '';
    this.debugMsg = `roomId: ${roomId}`;
    await gameContentStore.initLiff();
    this.debugMsg = `after init liff`;
    if (!liff.isLoggedIn()) {
      this.debugMsg = `is logged in`;
      await gameContentStore.loginLiff();
      this.debugMsg = `after login liff`;
      return;
    }
    if (roomId) {
      this.debugMsg = `roomId: ${roomId}`;
      this.$router.push({ path: 'main', query: { roomId } });
    } else {
      this.debugMsg = `no roomId`;
      this.$router.push('main');
    }
  },
});
</script>
