/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-22
 */

import LRUCache from '../src/cache/lru-cache.js';

let cache = new LRUCache(3);

cache.set(1, 1);
cache.set(1, 10);
cache.set(2, 2);
cache.set(3, 3);
cache.set(1, 1);
cache.set(4, 4);
cache.set(2, 2);
console.log(cache);
