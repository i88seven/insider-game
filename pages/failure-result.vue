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
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="nextGame">次のゲーム</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { gameContentStore } from '~/store';

export default Vue.extend({
  name: 'FailureResult',

  components: {},
  computed: {
    storedSubject(): string {
      return gameContentStore.storedSubject;
    },
    insiderName(): string {
      return 'あああ'; // TODO
    },
  },
  methods: {
    nextGame(): void {
      this.$router.push('role-action');
    },
  },
});
</script>
