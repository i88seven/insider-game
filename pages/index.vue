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
        <v-card-text>API: {{ apiUrl }}</v-card-text>
        <v-text-field v-model="roomId" class="input" type="text" />
        <v-text-field v-model="msg" class="input" type="text" @keypress.enter.exact="sendMessage" />
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Socket ID</th>
                <th class="text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="message in msgs" :key="message.name + message.text">
                <td>{{ message.name }}</td>
                <td>{{ message.text }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/role-action">始める</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import io from 'socket.io-client';
import Logo from '~/components/Logo.vue';
import VuetifyLogo from '~/components/VuetifyLogo.vue';

export default {
  components: {
    Logo,
    VuetifyLogo,
  },
  data(): any {
    return {
      roomId: '1',
      msg: '',
      msgs: [],
      socket: '',
    };
  },
  computed: {
    apiUrl: (): string => {
      return process.env.API_URL || '';
    },
  },
  mounted(): void {
    this.socket = io(process.env.API_URL, { transports: ['websocket', 'polling', 'flashsocket'] });
    this.socket.emit('join', this.roomId);
    this.socket.on('new-msg', (msg: any) => {
      this.msgs.push(msg);
    });
  },
  methods: {
    sendMessage(): void {
      this.msg = this.msg.trim();
      if (this.msg) {
        const message = {
          name: this.socket.id,
          text: this.msg,
        };
        this.msgs.push(message);
        this.socket.emit('send-msg', message, this.$route.params.id);
        this.msg = '';
      }
    },
  },
};
</script>
