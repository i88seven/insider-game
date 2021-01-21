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
    async copyUrl(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self: any = this;
      await self.$copyText(`${process.env.LIFF_URL}/main?roomId=${gameContentStore.roomId}`);
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
