<template>
  <v-card>
    <v-card-title class="headline">結果</v-card-title>
    <v-card-text>
      <h3>インサイダー {{ insiderResultText }}</h3>
    </v-card-text>
    <v-card-text>
      投票結果
      <v-simple-table>
        <template #default>
          <tbody>
            <tr v-for="voteResult in voteResults" :key="voteResult.id">
              <td>{{ voteResult.fromName }}</td>
              <td>→</td>
              <td>{{ voteResult.toName }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
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
    isHost(): boolean {
      return gameContentStore.isHost;
    },
    insiderResultText(): string {
      return gameContentStore.isInsiderLose ? '負け' : '勝ち';
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
