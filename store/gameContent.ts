import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import liff from '@line/liff';
import { Player, Role, Settings } from '~/store/type';
import { DateTime } from 'luxon';
import axios from 'axios';

@Module({
  name: 'gameContent',
  stateFactory: true,
  namespaced: true,
})
class GameContentModule extends VuexModule {
  roomId: string = '';
  myId: string = '';
  players: Player[] = [];
  decidedRoles: { [key: string]: Role } = {};
  votes: { [key: string]: string } = {};
  subject: string = '';
  loadedSubjects: string[] = [];
  settings: Settings = {
    limitMinute: 5,
  };
  discussionTimeLimit: DateTime | null = null;
  searchTimeLimit: DateTime | null = null;

  @Mutation
  SET_ROOM_ID(roomId: string): void {
    this.roomId = roomId;
  }

  @Mutation
  SET_MY_ID(myId: string): void {
    this.myId = myId;
  }

  @Mutation
  SET_SETTINGS(settings: Settings): void {
    this.settings = settings;
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
  SET_LOADED_SUBJECTS(subjects: string[]): void {
    this.loadedSubjects = subjects;
  }

  @Mutation
  SET_ROLES(decidedRoles: { [key: string]: Role }): void {
    this.decidedRoles = decidedRoles;
  }

  @Mutation
  SET_VOTES(votes: { [key: string]: string }): void {
    this.votes = votes;
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
    this.SET_MY_ID('');
    this.SET_PLAYERS([]);
    this.initGameContent();
  }

  @Action({ rawError: true })
  initGameContent(): void {
    this.SET_ROLES({});
    this.SET_VOTES({});
    this.SET_SUBJECT('');
    this.SET_DISCUSSION_TIME_LIMIT(null);
    this.SET_SEARCH_TIME_LIMIT(null);
  }

  @Action({ rawError: true })
  async initLiff(): Promise<void> {
    await liff.init({ liffId: process.env.LIFF_ID || '' });
  }

  @Action({ rawError: true })
  async loginLiff(redirectUri: string): Promise<void> {
    await liff.login({ redirectUri });
  }

  @Action({ rawError: true })
  async getProfile(): Promise<void> {
    const profile = await liff.getProfile();
    this.addPlayer({
      id: profile.userId,
      name: profile.displayName,
    });
    this.SET_MY_ID(profile.userId);
  }

  @Action({ rawError: true })
  async logout(): Promise<void> {
    if (await liff.isLoggedIn()) {
      await liff.logout();
    }
  }

  @Action({ rawError: true })
  async share(): Promise<boolean> {
    const message =
      'インサイダーゲームに招待されています！ \n' +
      `${process.env.LIFF_URL}/main?roomId=${this.roomId}`;
    await liff.shareTargetPicker([
      {
        type: 'text',
        text: message,
      },
    ]);
    return true;
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
  setSettings(settings: Settings): void {
    this.SET_SETTINGS(settings);
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
  async loadSubjects(): Promise<void> {
    if (this.loadedSubjects.length > 0) {
      return;
    }
    const { data } = await axios.get<string[]>(process.env.GAS_URL + '/exec');
    this.SET_LOADED_SUBJECTS(data);
  }

  @Action({ rawError: true })
  getSubject(): string {
    const randomIndex = Math.floor(Math.random() * this.loadedSubjects.length);
    return this.loadedSubjects[randomIndex];
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
  setRoles(roles: { [key: string]: Role }): void {
    this.SET_ROLES(roles);
  }

  @Action({ rawError: true })
  setDiscussionTimeLimit(discussionTimeLimit: DateTime): void {
    this.SET_DISCUSSION_TIME_LIMIT(discussionTimeLimit);
  }

  @Action({ rawError: true })
  generateDiscussionTimeLimit(): void {
    this.SET_DISCUSSION_TIME_LIMIT(DateTime.utc().plus({ minutes: this.settings.limitMinute }));
  }

  @Action({ rawError: true })
  setSearchTimeLimit(searchTimeLimit: DateTime): void {
    this.SET_SEARCH_TIME_LIMIT(searchTimeLimit);
  }

  @Action({ rawError: true })
  generateSearchTimeLimit(): void {
    if (!this.discussionTimeLimit) {
      return;
    }
    const diff = this.discussionTimeLimit.diff(DateTime.utc(), ['minutes', 'seconds']);
    this.SET_SEARCH_TIME_LIMIT(
      DateTime.utc().plus({ minutes: this.settings.limitMinute }).minus(diff)
    );
  }

  @Action({ rawError: true })
  setVote({ fromId, toId }: { fromId: string; toId: string }): void {
    this.SET_VOTES({
      ...this.votes,
      [fromId]: toId,
    });
  }

  @Action({ rawError: true })
  setVotes(votes: { [key: string]: string }): void {
    this.SET_VOTES(votes);
  }

  get isInClient(): boolean {
    return liff.isInClient();
  }

  get isLoggedIn(): boolean {
    return liff.isLoggedIn();
  }

  get storedRoomId(): string {
    return this.roomId;
  }

  get storedMyId(): string {
    return this.myId;
  }

  get storedSettings(): Settings {
    return this.settings;
  }

  get storedPlayers(): Player[] {
    return this.players;
  }

  get me(): Player | undefined {
    return this.players.find((player): boolean => {
      return player.id === this.myId;
    });
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

  get storedVotes(): { [key: string]: string } {
    return this.votes;
  }

  get votesLength(): number {
    return Object.keys(this.votes).length;
  }

  get isInsiderLose(): boolean {
    if (!this.insider) {
      return true;
    }
    const voteCountMap: { [key: string]: number } = {};
    this.players.forEach((player): void => {
      voteCountMap[player.id] = 0;
    });
    Object.values(this.votes).forEach((votedId): void => {
      voteCountMap[votedId] += 1;
    });
    let maxId = '';
    let maxCount = 0;
    let isSame = false;
    Object.entries(voteCountMap).forEach(([id, count]): void => {
      if (count >= maxCount) {
        isSame = count === maxCount;
        maxId = id;
        maxCount = count;
      }
    });
    if (isSame) {
      return false;
    }
    return maxId === this.insider.id;
  }

  get master(): Player | undefined {
    return this.players.find((player): boolean => {
      return this.decidedRoles[player.id] === 'master';
    });
  }

  get insider(): Player | undefined {
    return this.players.find((player): boolean => {
      return this.decidedRoles[player.id] === 'insider';
    });
  }

  get isHost(): boolean {
    if (!this.roomId || !this.myId) {
      return false;
    }
    return this.roomId === this.myId;
  }
}

export default GameContentModule;
