<template>
  <v-card>
    <v-card-title class="headline">インサイダーゲーム</v-card-title>
    <v-card-text>参加者を待っています</v-card-text>
    <v-card-text>
      参加者
      <v-simple-table>
        <template #default>
          <tbody>
            <tr v-for="player in players" :key="player.id">
              <td>{{ player.name }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-btn v-if="isHost" @click="requestReSend">現在の参加者を反映</v-btn>
    <v-card-actions v-if="isHost">
      <v-spacer />
      <v-btn color="primary" @click="share">友達を呼ぶ</v-btn>
      <v-btn :disabled="players.length < 3" color="primary" @click="start">始める</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { gameContentStore } from '~/store';
import { decideRoles, reSendPlayers } from '~/utils/socket';

export default Vue.extend({
  name: 'MemberChange',

  computed: {
    players: () => {
      return gameContentStore.storedPlayers;
    },
    isHost: () => {
      return gameContentStore.isHost;
    },
  },
  methods: {
    async share(): Promise<void> {
      await gameContentStore.share();
    },
    requestReSend(): void {
      reSendPlayers();
    },
    start(): void {
      gameContentStore.randomSelectRoles();
      decideRoles();
      this.$router.push('role-action');
    },
  },
});
</script>
