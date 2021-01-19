<template>
  <v-card>
    <v-card-title class="headline">インサイダーゲーム</v-card-title>
    <v-card-text>LINE にログインします</v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
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
    async liffInit(): Promise<void> {
      const roomId = this.$route.query.roomId ? this.$route.query.roomId.toString() : '';
      const paramId = this.$route.query.id ? this.$route.query.id.toString() : '';
      const paramName = this.$route.query.name ? this.$route.query.name.toString() : '';
      try {
        await gameContentStore.initLiff();
        if (gameContentStore.isInClient) {
          return;
        }
        if (!gameContentStore.isLoggedIn) {
          const locationPath = location.origin + '/main';
          const redirectUri = locationPath + `?roomId=${roomId}&id=${paramId}&name=${paramName}`;
          gameContentStore.loginLiff(redirectUri);
          return;
        }
        if (roomId) {
          this.$router.push({ path: 'main', query: { roomId } });
        } else {
          this.$router.push('main');
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  },
});
</script>
