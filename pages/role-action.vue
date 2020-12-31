<template>
  <v-card>
    <v-card-title class="headline">あなたは {{ myRole }} です。</v-card-title>
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
      お題は {{ storedSubject }} です
    </p>
    <v-card-actions v-if="myRole === 'master' && storedSubject === ''">
      <v-spacer />
      <v-btn color="primary" @click="setSubject">決定</v-btn>
    </v-card-actions>
    <v-card-actions v-if="myRole === 'master' && storedSubject">
      <v-spacer />
      <v-btn color="primary" @click="startGame">始める</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { decideSubject, onDecideSubject } from '~/utils/socket';
import { gameContentStore } from '~/store';
import { Role } from '~/store/type';

export default Vue.extend({
  name: 'RoleAction',

  components: {},
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      subject: '',
      rules: {
        required: (value: string) => !!value || '入力してください',
        counter: (value: string) => value.length <= 20 || '20文字以下にしてください。',
      },
    };
  },
  computed: {
    storedSubject(): string {
      return gameContentStore.storedSubject;
    },
    myRole(): Role | undefined {
      return gameContentStore.myRole;
    },
  },
  mounted() {
    if (this.myRole === 'insider') {
      onDecideSubject();
    }
  },
  methods: {
    setSubject(): void {
      if (this.myRole !== 'master') {
        return;
      }
      gameContentStore.setSubject(this.subject);
      decideSubject();
    },
    startGame(): void {
      if (this.myRole !== 'master') {
        return;
      }
      gameContentStore.setDiscussionTimeLimit();
      this.$router.push('count-down');
    },
  },
});
</script>
