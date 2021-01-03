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
    <v-card-text>
      <v-radio-group v-model="votedPlayerId">
        <v-radio
          v-for="player in playerOptions"
          :key="player.id"
          :label="player.name"
          :value="player.id"
        ></v-radio>
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="voted" color="primary" @click="vote">投票</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import Vue from 'vue';
import { vote, onVote, voteResult, onVoteResult } from '~/utils/socket';
import { gameContentStore } from '~/store';
import { Player, Role } from '~/store/type';

interface Data {
  timeCount: string;
  intervalId: NodeJS.Timeout | undefined;
  votedPlayerId: string;
  voted: boolean;
}

export default Vue.extend({
  name: 'Vote',

  components: {},
  data(): Data {
    return {
      timeCount: '--:--',
      intervalId: undefined,
      votedPlayerId: '',
      voted: false,
    };
  },
  computed: {
    storedSubject(): string {
      return gameContentStore.storedSubject;
    },
    playerOptions(): Player[] {
      return gameContentStore.players.filter((player): boolean => {
        return player.id !== gameContentStore.myId && player.id !== gameContentStore.master?.id;
      });
    },
    myRole(): Role | undefined {
      return gameContentStore.myRole;
    },
    votes(): any {
      return gameContentStore.storedVotes;
    },
  },
  mounted() {
    if (this.myRole === 'master') {
      onVote(() => {
        this.$router.push('game-result');
      });
    } else {
      onVoteResult(() => {
        this.$router.push('game-result');
      });
    }
    this.intervalId = setInterval(() => {
      const timeLimit = gameContentStore.storedSearchTimeLimit;
      if (!timeLimit) {
        this.timeCount = '--:--';
        return;
      }
      const diff = timeLimit.diff(DateTime.utc(), ['minutes', 'seconds']);
      if (diff.seconds < 0) {
        this.stopInterval();
        this.$router.push('game-result');
        return;
      }
      this.timeCount =
        diff.minutes.toString().padStart(2, '0') +
        ':' +
        Math.floor(diff.seconds).toString().padStart(2, '0');
    }, 1000);
  },
  methods: {
    vote(): void {
      vote(this.votedPlayerId);
      if (this.myRole === 'master') {
        gameContentStore.setVote({
          fromId: gameContentStore.myId,
          toId: this.votedPlayerId,
        });
        voteResult();
      }
      this.voted = true;
      if (gameContentStore.votesLength === gameContentStore.players.length) {
        this.$router.push('game-result');
      }
    },
    stopInterval(): void {
      if (this.intervalId !== undefined) {
        clearInterval(this.intervalId);
      }
    },
  },
});
</script>
