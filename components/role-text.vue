<template>
  <span class="role-text">
    <v-icon :class="role">
      {{ iconLabelMap[role] }}
    </v-icon>
    <span :class="!name ? role : ''">{{ name ? name : $t(role) }}</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'RoleText',
  props: {
    role: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconLabelMap(): { [key: string]: string } {
      return {
        master: 'mdi-account-cowboy-hat',
        insider: 'mdi-emoticon-devil',
        citizen: 'mdi-account',
      };
    },
  },
});
</script>
