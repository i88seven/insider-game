<template>
  <v-card>
    <v-card-title class="headline">正解</v-card-title>
    <v-card-text>
      <h3>お題は {{ storedSubject }} でした</h3>
      <p>インサイダーを探せ!</p>
    </v-card-text>
    <v-card-text>
      <p>残り</p>
      <h3>{{ timeCount }}</h3>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="goToVote">投票へ</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import Vue from 'vue';
import { gameContentStore } from '~/store';

export default Vue.extend({
  name: 'SubjectResult',

  components: {},
  data(): { timeCount: string; intervalId: NodeJS.Timeout | undefined } {
    return {
      timeCount: '--:--',
      intervalId: undefined,
    };
  },
  computed: {
    storedSubject(): string {
      return gameContentStore.storedSubject;
    },
  },
  mounted() {
    this.intervalId = setInterval(() => {
      const timeLimit = gameContentStore.storedSearchTimeLimit;
      if (!timeLimit) {
        this.timeCount = '--:--';
        return;
      }
      const diff = timeLimit.diff(DateTime.utc(), ['minutes', 'seconds']);
      if (diff.seconds < 0) {
        this.stopInterval();
        // TODO vote 画面に遷移
        return;
      }
      this.timeCount =
        diff.minutes.toString().padStart(2, '0') +
        ':' +
        Math.floor(diff.seconds).toString().padStart(2, '0');
    }, 1000);
  },
  methods: {
    goToVote(): void {
      // TODO vote 画面に遷移
    },
    stopInterval(): void {
      if (this.intervalId !== undefined) {
        clearInterval(this.intervalId);
      }
    },
  },
});
</script>
