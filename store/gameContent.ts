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
  discussionTimeLimit: DateTime | null = null;

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

  @Action({ rawError: true })
  init(): void {
    this.SET_MY_ROLE(undefined);
    this.SET_SUBJECT('');
    this.SET_DISCUSSION_TIME_LIMIT(null);
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

  get storedSubject(): string {
    return this.subject;
  }

  get storedMyRole(): Role | undefined {
    return this.myRole;
  }

  get storedDiscussionTimeLimit(): DateTime | null {
    return this.discussionTimeLimit;
  }
}

export default GameContentModule;
