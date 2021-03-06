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
    <v-btn @click="logout">ログアウト</v-btn>
    <v-btn v-if="isHost" @click="requestReSend">現在の参加者を反映</v-btn>
    <v-card-actions v-if="isHost">
      <v-spacer />
      <v-menu top offset-y>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">友達を呼ぶ</v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title @click="share">LINE でシェア</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="copyUrl">URL をコピー</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn :disabled="players.length < 3" color="primary" @click="start">始める</v-btn>
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
  reSendPlayers,
  onReSendPlayers,
  onBloadcastPlayers,
  onSendSettings,
  decideRoles,
  onDecideRoles,
  onReload,
  onReloadResponse,
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
    gameContentStore.initLiff();
    await setTimeout(() => {
      this.afterInitLiff();
    }, 0);
  },
  methods: {
    async afterInitLiff(): Promise<void> {
      const roomId = this.$route.query.roomId ? this.$route.query.roomId.toString() : '';
      const paramId = this.$route.query.id ? this.$route.query.id.toString() : '';
      const paramName = this.$route.query.name ? this.$route.query.name.toString() : '';
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
        onReSendPlayers();
        onSendSettings();
      }
      if (gameContentStore.isHost) {
        onReload();
        return;
      }
      onReloadResponse((route: string) => this.$router.push(route));
    },
    requestReSend(): void {
      reSendPlayers();
    },
    async logout(): Promise<void> {
      await gameContentStore.logout();
      this.$router.push('/');
    },
    async share(): Promise<void> {
      await gameContentStore.share();
    },
    async copyUrl(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self: any = this;
      await self.$copyText(`${process.env.LIFF_URL}/main?roomId=${gameContentStore.roomId}`);
    },
    start(): void {
      gameContentStore.randomSelectRoles();
      decideRoles();
      this.$router.push('role-action');
    },
  },
});
</script>
