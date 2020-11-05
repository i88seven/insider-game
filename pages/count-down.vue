<template>
  <v-card>
    <v-card-title class="headline">話し合い</v-card-title>
    <v-card-text>
      <p>残り</p>
      <h3>{{ timeCount }}</h3>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="correct">正解</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import Vue from 'vue';
import { gameContentStore } from '~/store';

export default Vue.extend({
  name: 'CountDown',

  components: {},
  data(): { timeCount: string; intervalId: NodeJS.Timeout | undefined } {
    return {
      timeCount: '--:--',
      intervalId: undefined,
    };
  },
  mounted() {
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
      this.timeCount =
        diff.minutes.toString().padStart(2, '0') +
        ':' +
        Math.floor(diff.seconds).toString().padStart(2, '0');
    }, 1000);
  },
  methods: {
    correct(): void {
      // TODO subject-result 画面に遷移
    },
    stopInterval(): void {
      if (this.intervalId !== undefined) {
        clearInterval(this.intervalId);
      }
    },
  },
});
</script>
