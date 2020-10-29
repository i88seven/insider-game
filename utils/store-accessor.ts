import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import GameContent from '~/store/gameContent';

let gameContentStore: GameContent;

function initialiseStores(store: Store<any>): void {
  gameContentStore = getModule(GameContent, store);
}

export { initialiseStores, gameContentStore };
