<template>
  <v-app dark>
    <v-app-bar app>
      <div style="text-align: right">
        <v-btn v-if="isRoomExist && !isHost" @click="reload">更新</v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="true" app>
      <v-carousel v-show="open" v-model="selectedPage" height="220">
        <v-carousel-item v-for="rulePage in rulePages" :key="rulePage">
          <v-row class="rule-item" align="center" justify="center">
            <div>
              <v-icon>{{ iconLabelMap[rulePage] }}</v-icon>
              <span>{{ $t(rulePage) }}</span>
              <p class="rule">{{ $t(`rules.${rulePage}`) }}</p>
            </div>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <div class="copyright-container">
        <span class="copyright">&copy; {{ new Date().getFullYear() }} i88seven</span>
        <div>
          <v-btn class="rule-btn" height="22" @click="openRule">ルール</v-btn>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { reload } from '~/utils/socket';
import { gameContentStore } from '~/store';
import { Role } from '~/store/type';

export default Vue.extend({
  name: 'Layout',
  data(): { open: boolean; selectedPage: number } {
    return {
      open: false,
      selectedPage: 0,
    };
  },
  computed: {
    isRoomExist(): boolean {
      return gameContentStore.storedRoomId !== '';
    },
    isHost(): boolean {
      return gameContentStore.isHost;
    },
    rulePages(): ('rule' | Role)[] {
      return ['rule', 'master', 'insider', 'citizen'];
    },
    iconLabelMap(): { [key: string]: string } {
      return {
        rule: 'mdi-file-document-outline',
        master: 'mdi-account-cowboy-hat',
        insider: 'mdi-emoticon-devil',
        citizen: 'mdi-account',
      };
    },
  },
  methods: {
    reload(): void {
      reload();
    },
    openRule(): void {
      this.open = !this.open;
    },
  },
});
</script>

<style scoped>
.copyright-container {
  width: 100%;
}

.copyright {
  float: left;
}

.rule-item {
  height: 206px;
}

.rule {
  font-size: 12px;
  white-space: break-spaces;
}

.rule-btn {
  float: right;
}
</style>
