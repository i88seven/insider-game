<template>
  <v-card>
    <v-card-title class="headline">話し合い</v-card-title>
    <v-card-text>
      <p>
        残り
        <span :class="'limit' + (isNearLimit ? ' near-limit' : '')">{{ timeCount }}</span>
      </p>
      <h3 v-if="myRole === 'master' || myRole === 'insider'">
        お題は
        <span class="subject">{{ subject }}</span>
        です
      </h3>
    </v-card-text>
    <v-card-actions v-if="myRole === 'master'">
      <v-spacer />
      <v-btn color="primary" @click="correct">正解</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import Vue from 'vue';
import { correct, onCorrect } from '~/utils/socket';
import { gameContentStore } from '~/store';
import { Role } from '~/store/type';

export default Vue.extend({
  name: 'CountDown',

  components: {},
  data(): { timeCount: string; intervalId: NodeJS.Timeout | undefined; isNearLimit: boolean } {
    return {
      timeCount: '--:--',
      intervalId: undefined,
      isNearLimit: false,
    };
  },
  computed: {
    subject(): string {
      return gameContentStore.storedSubject;
    },
    myRole(): Role | undefined {
      return gameContentStore.myRole;
    },
  },
  mounted() {
    this.isNearLimit = false;
    if (this.myRole === 'insider' || this.myRole === 'citizen') {
      onCorrect(() => {
        this.stopInterval();
        this.$router.push('vote');
      });
    }
    this.intervalId = setInterval(() => {
      const timeLimit = gameContentStore.storedDiscussionTimeLimit;
      if (!timeLimit) {
        this.timeCount = '--:--';
        return;
      }
      const diff = timeLimit.diff(DateTime.utc(), ['minutes', 'seconds']);
      if (diff.seconds < 0) {
        this.stopInterval();
        this.$router.push('failure-result');
        return;
      }
      this.isNearLimit = diff.minutes < 1 && diff.seconds < 30;
      this.timeCount =
        diff.minutes.toString().padStart(2, '0') +
        ':' +
        Math.floor(diff.seconds).toString().padStart(2, '0');
    }, 1000);
  },
  methods: {
    correct(): void {
      this.stopInterval();
      gameContentStore.generateSearchTimeLimit();
      correct();
      this.$router.push('vote');
    },
    stopInterval(): void {
      if (this.intervalId !== undefined) {
        clearInterval(this.intervalId);
      }
    },
  },
});
</script>

<style scoped>
.limit {
  font-weight: bold;
  font-size: 1.3rem;
}
</style>
