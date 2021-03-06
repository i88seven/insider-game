<template>
  <v-card>
    <v-card-title class="headline">
      あなたは
      <role-text :role="myRole" />
      です
    </v-card-title>
    <v-btn
      v-if="myRole === 'master' && !storedSubject"
      :loading="loadingSubjects"
      @click="getRandomSubject"
    >
      お題を自動取得
    </v-btn>
    <p v-if="myRole === 'insider' || myRole === 'citizen'">
      <role-text role="master" />
      は {{ masterMame }} です
    </p>
    <v-card-text v-if="myRole === 'master' && storedSubject === ''">
      <v-text-field
        v-model="subject"
        :rules="[rules.required, rules.counter]"
        label="お題"
        placeholder="お題を決めてください"
        counter
        maxlength="20"
      />
    </v-card-text>
    <p v-if="(myRole === 'master' || myRole === 'insider') && storedSubject">
      お題は
      <span class="subject">{{ storedSubject }}</span>
      です
    </p>
    <v-card-actions v-if="myRole === 'master' && storedSubject === ''">
      <v-spacer />
      <v-btn color="primary" @click="setSubject">決定</v-btn>
    </v-card-actions>
    <v-card-actions v-if="myRole === 'master' && storedSubject">
      <v-spacer />
      <v-btn color="primary" @click="start">始める</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import RoleText from '~/components/role-text.vue';
import { decideSubject, onDecideSubject, startGame, onStartGame } from '~/utils/socket';
import { gameContentStore } from '~/store';
import { Role } from '~/store/type';

export default Vue.extend({
  name: 'RoleAction',

  components: { RoleText },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      subject: '',
      rules: {
        required: (value: string) => !!value || '入力してください',
        counter: (value: string) => value.length <= 20 || '20文字以下にしてください',
      },
      loadingSubjects: false,
    };
  },
  computed: {
    storedSubject(): string {
      return gameContentStore.storedSubject;
    },
    myRole(): Role | undefined {
      return gameContentStore.myRole;
    },
    masterMame(): string {
      return gameContentStore.master?.name ?? '';
    },
  },
  mounted() {
    onDecideSubject();
    onStartGame(() => {
      this.$router.push('count-down');
    });
  },
  methods: {
    async getRandomSubject(): Promise<void> {
      this.loadingSubjects = true;
      await gameContentStore.loadSubjects();
      this.subject = await gameContentStore.getSubject();
      this.loadingSubjects = false;
    },
    setSubject(): void {
      if (this.myRole !== 'master') {
        return;
      }
      decideSubject(this.subject);
    },
    start(): void {
      if (this.myRole !== 'master') {
        return;
      }
      startGame();
      if (gameContentStore.isHost) {
        this.$router.push('count-down');
      }
    },
  },
});
</script>
