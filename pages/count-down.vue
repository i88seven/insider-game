<template>
  <v-card>
    <v-card-title class="headline">話し合い</v-card-title>
    <v-card-text>
      <p>残り</p>
      <h3>{{ timeCount }}</h3>
      <h3 v-if="myRole === 'master' || myRole === 'insider'">お題は {{ subject }} です</h3>
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
  data(): { timeCount: string; intervalId: NodeJS.Timeout | undefined } {
    return {
      timeCount: '--:--',
      intervalId: undefined,
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
    if (this.myRole === 'insider' || this.myRole === 'citizen') {
      onCorrect(() => {
        this.$router.push('subject-result');
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
      this.timeCount =
        diff.minutes.toString().padStart(2, '0') +
        ':' +
        Math.floor(diff.seconds).toString().padStart(2, '0');
    }, 1000);
  },
  methods: {
    correct(): void {
      gameContentStore.generateSearchTimeLimit();
      correct();
      this.$router.push('subject-result');
    },
    stopInterval(): void {
      if (this.intervalId !== undefined) {
        clearInterval(this.intervalId);
      }
    },
  },
});
</script>
