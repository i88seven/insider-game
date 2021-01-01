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

  mounted(): void {
    gameContentStore.init();
    setTimeout(() => {
      this.liffInit();
    }, 0);
  },
  methods: {
    liffInit(): void {
      const roomId = this.$route.query.roomId ? this.$route.query.roomId.toString() : '';
      liff.init(
        { liffId: process.env.LIFF_ID || '' },
        () => {
          if (liff.isInClient()) {
            return;
          }
          if (!liff.isLoggedIn()) {
            const locationPath = location.origin + '/main';
            const redirectUri = roomId ? locationPath + `?roomId=${roomId}` : locationPath;
            liff.login({ redirectUri });
            return;
          }
          if (roomId) {
            this.$router.push({ path: 'main', query: { roomId } });
          } else {
            this.$router.push('main');
          }
        },
        (error) => {
          console.log(error.message);
        }
      );
    },
  },
});
</script>
