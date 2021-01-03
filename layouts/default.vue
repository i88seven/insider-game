<template>
  <v-app dark>
    <v-app-bar app>
      <div style="text-align: right">
        <v-btn v-if="isRoomExist && !isHost" @click="reload">更新</v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="true" app>
      <span>&copy; {{ new Date().getFullYear() }} i88seven</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { reload } from '~/utils/socket';
import { gameContentStore } from '~/store';

export default Vue.extend({
  name: 'Layout',
  computed: {
    isRoomExist(): boolean {
      return gameContentStore.storedRoomId !== '';
    },
    isHost(): boolean {
      return gameContentStore.isHost;
    },
  },
  methods: {
    reload(): void {
      reload();
    },
  },
});
</script>
