<template>
  <v-card>
    <v-card-title class="headline">結果</v-card-title>
    <v-card-text>
      <h3>
        <role-text role="insider" />
        <span :class="isLose ? 'lose' : 'win'">
          {{ insiderResultText }}
        </span>
      </h3>
    </v-card-text>
    <v-card-text>
      投票結果
      <v-simple-table>
        <template #default>
          <tbody>
            <tr v-for="voteResult in voteResults" :key="voteResult.id">
              <td>
                <role-text :role="voteResult.fromRole" :name="voteResult.fromName" />
              </td>
              <td>→</td>
              <td>
                <role-text
                  v-if="voteResult.toName"
                  :role="voteResult.toRole"
                  :name="voteResult.toName"
                />
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-actions v-if="isHost">
      <v-spacer />
      <v-btn @click="nextGame(true)">メンバーを変更</v-btn>
      <v-btn color="primary" @click="nextGame(false)">次のゲーム</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import RoleText from '~/components/role-text.vue';
import { nextGame, onNextGame } from '~/utils/socket';
import { gameContentStore } from '~/store';
import { Player, Role } from '~/store/type';

interface VoteResult {
  fromRole?: Role;
  fromName: string;
  toRole?: Role;
  toName: string;
}

export default Vue.extend({
  name: 'GameResult',

  components: { RoleText },
  computed: {
    storedSubject(): string {
      return gameContentStore.storedSubject;
    },
    voteResults(): VoteResult[] {
      return gameContentStore.storedPlayers.map(
        (player): VoteResult => {
          const toPlayer = gameContentStore.storedPlayers.find((target): boolean => {
            return target.id === gameContentStore.storedVotes[player.id];
          });
          return {
            fromRole: gameContentStore.storedRoles[player.id],
            fromName: player.name,
            toRole: toPlayer ? gameContentStore.storedRoles[toPlayer.id] : undefined,
            toName: toPlayer ? toPlayer.name : '',
          };
        }
      );
    },
    insider(): Player | undefined {
      return gameContentStore.insider;
    },
    isHost(): boolean {
      return gameContentStore.isHost;
    },
    insiderResultText(): string {
      return gameContentStore.isInsiderLose ? '負け' : '勝ち';
    },
    isLose(): boolean {
      return (
        (gameContentStore.isInsiderLose && gameContentStore.myRole === 'insider') ||
        (!gameContentStore.isInsiderLose && gameContentStore.myRole !== 'insider')
      );
    },
    iconLabelMap(): { [key: string]: string } {
      return {
        master: 'mdi-account-cowboy-hat',
        insider: 'mdi-emoticon-devil',
        citizen: 'mdi-account',
      };
    },
  },
  mounted() {
    if (!this.isHost) {
      onNextGame((memberChange: boolean) => {
        this.$router.push(memberChange ? 'member-change' : 'role-action');
      });
    }
  },
  methods: {
    nextGame(memberChange: boolean): void {
      if (this.isHost) {
        gameContentStore.initGameContent();
        if (!memberChange) {
          gameContentStore.randomSelectRoles();
        }
        nextGame(memberChange);
        this.$router.push(memberChange ? 'member-change' : 'role-action');
      }
    },
  },
});
</script>
