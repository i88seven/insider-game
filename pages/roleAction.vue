<template>
  <v-card>
    <v-card-title class="headline">
      あなたはマスターです。
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="subject"
        :rules="[rules.required, rules.counter]"
        label="お題"
        placeholder="お題を決めてください"
        counter
        maxlength="20"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        nuxt
        to="/inspire"
      >
        決定
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      subject: '',
      rules: {
        required: value => !!value || '入力してください',
        counter: value => value.length <= 20 || '20文字以下にしてください。',
      },
    }
  },
}
</script>
