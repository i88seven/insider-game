<template>
  <v-card>
    <v-card-title class="headline">あなたはマスターです。</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="subject"
        :rules="[rules.required, rules.counter]"
        label="お題"
        placeholder="お題を決めてください"
        counter
        maxlength="20"
      />
    </v-card-text>
    <p>subject is {{ storeSubject }}</p>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="setSubject">決定</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { gameContentStore } from '~/store';

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
    storeSubject(): string {
      return gameContentStore.storeSubject;
    },
  },
  methods: {
    setSubject(): void {
      gameContentStore.setSubject(this.subject);
    },
  },
});
</script>
