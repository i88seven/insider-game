import { Store } from 'vuex';
import { initialiseStores } from '~/utils/store-accessor';
const initializer = (store: Store<any>): void => initialiseStores(store);
export const plugins = [initializer];
export * from '~/utils/store-accessor';
