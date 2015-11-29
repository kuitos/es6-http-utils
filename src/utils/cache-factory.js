/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-11-29
 */
import LRUCache from '../cache/lru-cache';

let cacheStores = new Map();

// default cache constructor was LRU cache,you can change it by `cacheStores.defaultCacheConstructor = xxxCache` for free
cacheStores.defaultCacheConstructor = LRUCache;

export default {

  get(key){
    return cacheStores.get(key);
  },

  create(key, ...args){
    let cache = new cacheStores.defaultCacheConstructor(...args);
    cacheStores.set(key, cache);
    return cache;
  },

  delete(key){
    cacheStores.delete(key);
  },

  clear(){
    cacheStores.clear();
  }

}
