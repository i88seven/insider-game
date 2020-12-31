<template>
  <v-card>
    <v-card-title class="headline">インサイダーゲーム</v-card-title>
    <v-card-text>参加者を待っています。</v-card-text>
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
    <v-card-actions v-if="isHost && players.length > 2">
      <v-spacer />
      <v-btn color="primary" @click="start">始める</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { gameContentStore } from '~/store';
import {
  initSocket,
  joinRoom,
  onJoinRoom,
  onBloadcastPlayers,
  decideRoles,
  onDecideRoles,
} from '~/utils/socket';

export default Vue.extend({
  name: 'Main',

  computed: {
    players: () => {
      return gameContentStore.storedPlayers;
    },
    isHost: () => {
      return gameContentStore.isHost;
    },
  },
  async mounted(): Promise<void> {
    gameContentStore.init();
    const paramId = this.$route.query.id ? this.$route.query.id.toString() : '';
    const paramName = this.$route.query.name ? this.$route.query.name.toString() : '';
    let player = paramId && paramName ? { id: paramId, name: paramName } : undefined; // TODO
    await gameContentStore.initLiff(player);

    const roomId = this.$route.query.roomId
      ? this.$route.query.roomId.toString()
      : gameContentStore.myId;
    gameContentStore.setRoomId(roomId);
    initSocket();
    joinRoom();
    if (gameContentStore.isHost) {
      onJoinRoom();
    } else {
      onBloadcastPlayers();
      onDecideRoles(() => {
        this.$router.push('role-action');
      });
    }
  },
  methods: {
    start(): void {
      gameContentStore.randomSelectRoles();
      decideRoles();
      this.$router.push('role-action');
    },
  },
});
</script>
