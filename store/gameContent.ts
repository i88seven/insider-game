import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { Role } from '~/store/type';
import { DateTime } from 'luxon';

const ROLE_LIST: Role[] = ['master', 'insider', 'citizen'];
const DISCUSSION_TIME_MINUTES: number = 5;

@Module({
  name: 'gameContent',
  stateFactory: true,
  namespaced: true,
})
class GameContentModule extends VuexModule {
  myRole: Role | undefined = undefined;
  subject: string = '';
  timeLimit: DateTime | null = null;

  @Mutation
  SET_SUBJECT(subject: string): void {
    this.subject = subject;
  }

  @Mutation
  SET_MY_ROLE(myRole: Role): void {
    this.myRole = myRole;
  }

  @Mutation
  SET_TIME_LIMIT(timeLimit: DateTime): void {
    this.timeLimit = timeLimit;
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
  setTimeLimit(): void {
    this.SET_TIME_LIMIT(DateTime.local().plus({ minutes: DISCUSSION_TIME_MINUTES }));
  }

  get storedSubject(): string {
    return this.subject;
  }

  get storedMyRole(): Role | undefined {
    return this.myRole;
  }

  get storedTimeLimit(): DateTime | null {
    return this.timeLimit;
  }
}

export default GameContentModule;
