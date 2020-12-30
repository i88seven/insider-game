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
          <v-btn color="primary" nuxt to="/role-action">始める</v-btn>
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
    const socket = io(process.env.API_URL || '', {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
    gameContentStore.setSocket(socket);
    socket.emit('join', this.roomId, profile.userId, profile.displayName);
    socket.on('join-room', (player: any) => {
      gameContentStore.addPlayer({
        id: player.userId,
        name: player.displayName,
      });
    });
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
  },
});
</script>
