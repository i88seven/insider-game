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
      <v-btn @click="nextGame(true)">メンバーを変更</v-btn>
      <v-btn color="primary" @click="nextGame(false)">次のゲーム</v-btn>
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
      onNextGame((memberChange: boolean) => {
        this.$router.push(memberChange ? 'member-change' : 'role-action');
      });
    }
  },
  methods: {
    nextGame(memberChange: boolean): void {
      if (this.isHost) {
        gameContentStore.initGameContent();
        if (!memberChange) {
          gameContentStore.randomSelectRoles();
        }
        nextGame(memberChange);
        this.$router.push(memberChange ? 'member-change' : 'role-action');
      }
    },
  },
});
</script>
