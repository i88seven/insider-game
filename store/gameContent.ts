import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { Role } from '~/store/type';

const ROLE_LIST: Role[] = ['master', 'insider', 'citizen'];

@Module({
  name: 'gameContent',
  stateFactory: true,
  namespaced: true,
})
class GameContentModule extends VuexModule {
  myRole: Role | undefined = undefined;
  subject: string = '';

  @Mutation
  SET_SUBJECT(subject: string): void {
    this.subject = subject;
  }

  @Mutation
  SET_MY_ROLE(myRole: Role): void {
    this.myRole = myRole;
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

  get storedSubject(): string {
    return this.subject;
  }

  get storedMyRole(): Role | undefined {
    return this.myRole;
  }
}

export default GameContentModule;
