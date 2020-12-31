<template>
  <v-card>
    <v-card-title class="headline">結果</v-card-title>
    <v-card-text>
      <h3>インサイダー・一般人 負け</h3>
    </v-card-text>
    <v-card-text>
      <h3>お題は {{ storedSubject }} でした</h3>
    </v-card-text>
    <v-card-text>
      <h3>インサイダーは {{ insiderName }} でした</h3>
    </v-card-text>
    <v-card-actions v-if="isHost">
      <v-spacer />
      <v-btn color="primary" @click="nextGame">次のゲーム</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { nextGame, onNextGame } from '~/utils/socket';
import { gameContentStore } from '~/store';

export default Vue.extend({
  name: 'FailureResult',

  components: {},
  computed: {
    storedSubject(): string {
      return gameContentStore.storedSubject;
    },
    insiderName(): string {
      return gameContentStore.insider ? gameContentStore.insider.name : '';
    },
    isHost(): boolean {
      return gameContentStore.isHost;
    },
  },
  mounted() {
    if (!this.isHost) {
      onNextGame(() => {
        this.$router.push('role-action');
      });
    }
  },
  methods: {
    nextGame(): void {
      if (this.isHost) {
        gameContentStore.initGameContent();
        gameContentStore.randomSelectRoles();
        nextGame();
        this.$router.push('role-action');
      }
    },
  },
});
</script>
