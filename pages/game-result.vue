<template>
  <v-card>
    <v-card-title class="headline">結果</v-card-title>
    <v-card-text>
      <h3>インサイダー勝ち</h3>
    </v-card-text>
    <v-card-text>
      投票結果
      <v-simple-table>
        <template #default>
          <tbody>
            <tr v-for="voteResult in voteResults" :key="voteResult.id">
              <td>{{ voteResult.fromName }}</td>
              <td>{{ voteResult.toName }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
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

interface VoteResult {
  fromName: string;
  toName: string;
}

export default Vue.extend({
  name: 'GameResult',

  components: {},
  computed: {
    storedSubject(): string {
      return gameContentStore.storedSubject;
    },
    voteResults(): VoteResult[] {
      return gameContentStore.storedPlayers.map(
        (player): VoteResult => {
          const toPlayer = gameContentStore.storedPlayers.find((target): boolean => {
            return target.id === gameContentStore.storedVotes[player.id];
          });
          return {
            fromName: player.name,
            toName: toPlayer ? toPlayer.name : '',
          };
        }
      );
    },
    insiderName(): string {
      return gameContentStore.insider ? gameContentStore.insider.name : '';
    },
  },
  methods: {
    nextGame(): void {
      gameContentStore.init();
      this.$router.push('role-action');
    },
  },
});
</script>
