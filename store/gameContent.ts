import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { Socket } from 'socket.io-client';
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
  socket: Socket | undefined = undefined;
  roomId: string = '';
  myId: string = '';
  players: Player[] = [];
  decidedRoles: { [key: string]: Role } = {};
  subject: string = '';
  discussionTimeLimit: DateTime | null = null;
  searchTimeLimit: DateTime | null = null;

  @Mutation
  SET_SOCKET(socket: Socket | undefined): void {
    this.socket = socket;
  }

  @Mutation
  SET_ROOM_ID(roomId: string): void {
    this.roomId = roomId;
  }

  @Mutation
  SET_MY_ID(myId: string): void {
    this.myId = myId;
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
  SET_ROLES(decidedRoles: { [key: string]: Role }): void {
    this.decidedRoles = decidedRoles;
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
    this.SET_SOCKET(undefined);
    this.SET_ROOM_ID('');
    this.SET_MY_ID('');
    this.SET_PLAYERS([]);
    this.SET_ROLES({});
    this.SET_SUBJECT('');
    this.SET_DISCUSSION_TIME_LIMIT(null);
    this.SET_SEARCH_TIME_LIMIT(null);
  }

  @Action({ rawError: true })
  setSocket(socket: Socket): void {
    this.SET_SOCKET(socket);
  }

  @Action({ rawError: true })
  setRoomId(roomId: string): void {
    this.SET_ROOM_ID(roomId);
  }

  @Action({ rawError: true })
  setMyId(myId: string): void {
    this.SET_MY_ID(myId);
  }

  @Action({ rawError: true })
  addPlayer({ id, name }: { id: string; name: string }): void {
    if (
      this.players.find((player): boolean => {
        return id === player.id;
      })
    ) {
      return;
    }
    this.SET_PLAYERS([
      ...this.players,
      {
        id,
        name,
      },
    ]);
  }

  @Action({ rawError: true })
  setPlayers(players: Player[]): void {
    this.SET_PLAYERS(players);
  }

  @Action({ rawError: true })
  setSubject(subject: string): void {
    this.SET_SUBJECT(subject);
  }

  @Action({ rawError: true })
  randomSelectRoles(): void {
    const indexOfMaster = Math.floor(Math.random() * this.playerCount);
    let indexOfInsider = Math.floor(Math.random() * (this.playerCount - 1));
    if (indexOfMaster === indexOfInsider) {
      indexOfInsider = this.playerCount - 1;
    }
    const roles: { [key: string]: Role } = {};
    this.players.forEach((player, index): void => {
      switch (index) {
        case indexOfMaster:
          roles[player.id] = 'master';
          break;
        case indexOfInsider:
          roles[player.id] = 'insider';
          break;
        default:
          roles[player.id] = 'citizen';
          break;
      }
    });
    this.SET_ROLES(roles);
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

  get storedSocket(): Socket | undefined {
    return this.socket;
  }

  get storedRoomId(): string {
    return this.roomId;
  }

  get storedMyId(): string {
    return this.myId;
  }

  get storedPlayers(): Player[] {
    return this.players;
  }

  get playerCount(): number {
    return this.players.length;
  }

  get storedSubject(): string {
    return this.subject;
  }

  get storedRoles(): { [key: string]: Role } {
    return this.decidedRoles;
  }

  get myRole(): Role | undefined {
    return this.decidedRoles[this.myId];
  }

  get storedDiscussionTimeLimit(): DateTime | null {
    return this.discussionTimeLimit;
  }

  get storedSearchTimeLimit(): DateTime | null {
    return this.searchTimeLimit;
  }

  get isHost(): boolean {
    if (!this.roomId || !this.myId) {
      return false;
    }
    return this.roomId === this.myId;
  }
}

export default GameContentModule;
