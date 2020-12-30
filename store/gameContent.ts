import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { Player, Role } from '~/store/type';
import { DateTime } from 'luxon';

const ROLE_LIST: Role[] = ['master', 'insider', 'citizen'];
const DISCUSSION_TIME_MINUTES: number = 5;

@Module({
  name: 'gameContent',
  stateFactory: true,
  namespaced: true,
})
class GameContentModule extends VuexModule {
  roomId: string = '';
  players: Player[] = [];
  myRole: Role | undefined = undefined;
  subject: string = '';
  discussionTimeLimit: DateTime | null = null;
  searchTimeLimit: DateTime | null = null;

  @Mutation
  SET_ROOM_ID(roomId: string): void {
    this.roomId = roomId;
  }

  @Mutation
  SET_PLAYERS(players: Player[]): void {
    this.players = players;
  }

  @Mutation
  SET_SUBJECT(subject: string): void {
    this.subject = subject;
  }

  @Mutation
  SET_MY_ROLE(myRole: Role | undefined): void {
    this.myRole = myRole;
  }

  @Mutation
  SET_DISCUSSION_TIME_LIMIT(timeLimit: DateTime | null): void {
    this.discussionTimeLimit = timeLimit;
  }

  @Mutation
  SET_SEARCH_TIME_LIMIT(timeLimit: DateTime | null): void {
    this.searchTimeLimit = timeLimit;
  }

  @Action({ rawError: true })
  init(): void {
    this.SET_ROOM_ID('');
    this.SET_PLAYERS([]);
    this.SET_MY_ROLE(undefined);
    this.SET_SUBJECT('');
    this.SET_DISCUSSION_TIME_LIMIT(null);
    this.SET_SEARCH_TIME_LIMIT(null);
  }

  @Action({ rawError: true })
  setRoomId(roomId: string): void {
    this.SET_ROOM_ID(roomId);
  }

  @Action({ rawError: true })
  setPlayers(): void {
    this.SET_PLAYERS([
      {
        id: '1',
        name: 'あああ',
        role: 'master',
      },
      {
        id: '2',
        name: 'いいい',
        role: 'insider',
      },
      {
        id: '3',
        name: 'ううう',
        role: 'citizen',
      },
    ]);
  }

  @Action({ rawError: true })
  setSubject(subject: string): void {
    this.SET_SUBJECT(subject);
  }

  @Action({ rawError: true })
  randomSelectRole(): void {
    const randomIndex = Math.floor(Math.random() * ROLE_LIST.length);
    this.SET_MY_ROLE(ROLE_LIST[randomIndex]);
  }

  @Action({ rawError: true })
  setDiscussionTimeLimit(): void {
    this.SET_DISCUSSION_TIME_LIMIT(DateTime.utc().plus({ minutes: DISCUSSION_TIME_MINUTES }));
  }

  @Action({ rawError: true })
  setSearchTimeLimit(): void {
    if (!this.discussionTimeLimit) {
      return;
    }
    const diff = this.discussionTimeLimit.diff(DateTime.utc(), ['minutes', 'seconds']);
    this.SET_SEARCH_TIME_LIMIT(
      DateTime.utc().plus({ minutes: DISCUSSION_TIME_MINUTES }).minus(diff)
    );
  }

  @Action({ rawError: true })
  vote(): void {
    // TODO
  }

  get storedRoomId(): Player[] {
    return this.players;
  }

  get storedPlayers(): Player[] {
    return this.players;
  }

  get storedSubject(): string {
    return this.subject;
  }

  get storedMyRole(): Role | undefined {
    return this.myRole;
  }

  get storedDiscussionTimeLimit(): DateTime | null {
    return this.discussionTimeLimit;
  }

  get storedSearchTimeLimit(): DateTime | null {
    return this.searchTimeLimit;
  }
}

export default GameContentModule;
