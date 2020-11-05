<template>
  <v-card>
    <v-card-title class="headline">投票</v-card-title>
    <v-card-text>
      <v-radio-group v-model="votedPlayerId">
        <v-radio
          v-for="player in players"
          :key="player.id"
          :label="player.name"
          :value="player.id"
        ></v-radio>
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="vote">投票</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { gameContentStore } from '~/store';
import { Player } from '~/store/type';

export default Vue.extend({
  name: 'Vote',

  components: {},
  data() {
    return {
      votedPlayerId: '',
    };
  },
  computed: {
    storedSubject(): string {
      return gameContentStore.storedSubject;
    },
    players(): Player[] {
      return gameContentStore.players;
    },
  },
  methods: {
    vote(): void {
      console.log(this.votedPlayerId);
      gameContentStore.vote();
      this.$router.push('game-result');
    },
  },
});
</script>
