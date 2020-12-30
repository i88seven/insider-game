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

export default Vue.extend({
  name: 'Main',

  components: {
    Logo,
    VuetifyLogo,
  },
  data(): { socket: any } {
    return {
      socket: '',
    };
  },
  computed: {
    apiUrl: (): string => {
      return process.env.API_URL || '';
    },
    roomId: {
      get() {
        return gameContentStore.storedRoomId;
      },
      set(val: string) {
        gameContentStore.setRoomId(val);
      },
    },
  },
  async mounted(): Promise<void> {
    if (process.env.ENV === 'local') {
      await this.liffLogin();
    }
    await liff.init({ liffId: process.env.LIFF_ID || '' });
    const profile = await liff.getProfile();
    gameContentStore.addPlayer({
      id: profile.userId,
      name: profile.displayName,
    });
    this.socket = io(process.env.API_URL || '', {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
    this.socket.emit('join', this.roomId, profile.userId, profile.displayName);
    this.socket.on('join-room', (player: any) => {
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
