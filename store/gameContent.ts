import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

@Module({
  name: 'gameContent',
  stateFactory: true,
  namespaced: true,
})
class GameContentModule extends VuexModule {
  subject: string = '';

  @Mutation
  SET_SUBJECT(subject: string): void {
    this.subject = subject;
  }

  @Action({ rawError: true })
  setSubject(subject: string): void {
    this.SET_SUBJECT(subject);
  }

  get storeSubject(): string {
    return this.subject;
  }
}

export default GameContentModule;
