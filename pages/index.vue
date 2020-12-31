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
        <v-card-actions v-if="isHost">
          <v-spacer />
          <v-btn color="primary" @click="start">始める</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
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
import Logo from '~/components/Logo.vue';
import VuetifyLogo from '~/components/VuetifyLogo.vue';

const MOCK_PLAYER = {
  id: '123456789012345678',
  name: 'mockPlayer',
};

export default Vue.extend({
  name: 'Main',

  components: {
    Logo,
    VuetifyLogo,
  },
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
    const player = this.$route.query.roomId ? MOCK_PLAYER : undefined; // TODO
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
