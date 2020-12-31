<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">インサイダーゲーム</v-card-title>
        <v-card-text>インサイダーゲーム始めるよ</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="start">始める</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { io } from 'socket.io-client';
import liff from '@line/liff';
import { gameContentStore } from '~/store';
import Logo from '~/components/Logo.vue';
import VuetifyLogo from '~/components/VuetifyLogo.vue';

const MOCK_PLAYER = {
  userId: '123456789012345678',
  displayName: 'mockPlayer',
};

export default Vue.extend({
  name: 'Main',

  components: {
    Logo,
    VuetifyLogo,
  },
  async mounted(): Promise<void> {
    if (process.env.ENV === 'local') {
      await this.liffLogin();
    }
    await liff.init({ liffId: process.env.LIFF_ID || '' });
    const profile = this.$route.query.roomId ? MOCK_PLAYER : await liff.getProfile(); // TODO
    gameContentStore.addPlayer({
      id: profile.userId,
      name: profile.displayName,
    });
    gameContentStore.setMyId(profile.userId);
    const socket = io(process.env.API_URL || '', {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
    const roomId = this.$route.query.roomId ? this.$route.query.roomId.toString() : profile.userId;
    gameContentStore.setRoomId(roomId);
    socket.emit('join-room', roomId, profile.userId, profile.displayName);
    if (gameContentStore.isHost) {
      socket.on('join-room', (player: any) => {
        gameContentStore.addPlayer({
          id: player.id,
          name: player.name,
        });
        socket.emit(
          'broadcast-players',
          gameContentStore.storedRoomId,
          gameContentStore.storedPlayers
        );
      });
    } else {
      socket.on('broadcast-players', (players: any) => {
        gameContentStore.setPlayers(players);
      });
    }
  },
  methods: {
    async liffLogin(): Promise<void> {
      await liff.init({ liffId: process.env.LIFF_ID || '' });
      const isLoggedIn: boolean = await liff.isLoggedIn();
      if (isLoggedIn) {
        return;
      }
      await liff.login();
    },
    start(): void {
      gameContentStore.randomSelectRoles();
      this.$router.push('role-action');
    },
  },
});
</script>
