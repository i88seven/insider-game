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
    <v-btn v-if="isLoggedIn" @click="logout">ログアウト</v-btn>
    <v-card-actions v-if="isHost">
      <v-spacer />
      <v-btn color="primary" @click="share">友達を呼ぶ</v-btn>
      <v-btn :disabled="players.length < 3" color="primary" @click="start">始める</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import liff from '@line/liff';
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
    isLoggedIn: () => {
      return liff.isLoggedIn();
    },
  },
  async mounted(): Promise<void> {
    gameContentStore.init();
    const roomId = this.$route.query.roomId ? this.$route.query.roomId.toString() : '';
    const paramId = this.$route.query.id ? this.$route.query.id.toString() : '';
    const paramName = this.$route.query.name ? this.$route.query.name.toString() : '';
    if (!liff.isInClient()) {
      gameContentStore.initLiff();
    } else if (!liff.isLoggedIn()) {
      gameContentStore.loginLiff();
    }
    let player = paramId && paramName ? { id: paramId, name: paramName } : undefined; // TODO
    if (player) {
      gameContentStore.addPlayer(player);
      gameContentStore.setMyId(player.id);
    } else {
      await gameContentStore.getProfile();
    }

    gameContentStore.setRoomId(roomId || gameContentStore.myId);
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
    async logout(): Promise<void> {
      await gameContentStore.logout();
      this.$router.push('/');
    },
    async share(): Promise<void> {
      await gameContentStore.share();
    },
    start(): void {
      gameContentStore.randomSelectRoles();
      decideRoles();
      this.$router.push('role-action');
    },
  },
});
</script>
