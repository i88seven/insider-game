<template>
  <v-app dark>
    <v-app-bar app>
      <div style="text-align: right">
        <v-btn v-if="isRoomExist" @click="reload">更新</v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="true" app>
      <v-carousel v-show="ruleShow" v-model="selectedPage" height="220">
        <v-carousel-item v-for="rulePage in rulePages" :key="rulePage">
          <v-row class="rule-item" align="center" justify="center">
            <div>
              <v-icon :class="rulePage">{{ iconLabelMap[rulePage] }}</v-icon>
              <span :class="rulePage">{{ $t(rulePage) }}</span>
              <p class="rule">{{ $t(`rules.${rulePage}`) }}</p>
            </div>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <div class="copyright-container">
        <span class="copyright">&copy; {{ new Date().getFullYear() }} i88seven</span>
        <div class="footer-buttons">
          <v-dialog v-if="isHost && !gameStarted" v-model="settingShow">
            <template #activator="{ on, attrs }">
              <v-btn height="22" v-bind="attrs" v-on="on">ゲーム設定</v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">ゲーム設定</v-card-title>
              <v-card-text>
                <v-text-field v-model.number="limitMinute" label="話し合い時間(分)" />
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="decideSettings">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn height="22" @click="openRule">ルール説明</v-btn>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { joinRoom, reload, sendSettings } from '~/utils/socket';
import { gameContentStore } from '~/store';
import { Role } from '~/store/type';

export default Vue.extend({
  name: 'Layout',
  data(): { ruleShow: boolean; settingShow: boolean; selectedPage: number; limitMinute: number } {
    return {
      ruleShow: false,
      settingShow: false,
      selectedPage: 0,
      limitMinute: 5,
    };
  },
  computed: {
    isRoomExist(): boolean {
      return gameContentStore.storedRoomId !== '';
    },
    isHost(): boolean {
      return gameContentStore.isHost;
    },
    gameStarted(): boolean {
      return !!gameContentStore.myRole;
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
      if (this.isHost) {
        joinRoom();
      } else {
        reload();
      }
    },
    openRule(): void {
      this.ruleShow = !this.ruleShow;
    },
    decideSettings(): void {
      if (this.isHost && !this.gameStarted) {
        gameContentStore.setSettings({
          limitMinute: this.limitMinute,
        });
        sendSettings();
      }
      this.settingShow = false;
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

.footer-buttons {
  float: right;
}
</style>
