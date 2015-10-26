/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-26
 */

import LRUCache from '../lru-cache.js';

describe('lru-cache', () => {

  it('set several elements into lru-cache', () => {

    let cache = new LRUCache(3);

    cache.set(1, 1);
    cache.set(1, 10);
    cache.set(2, 2);
    cache.set(3, 3);
    cache.set(1, 1);
    cache.set(4, 4);
    cache.set(2, 2);
    cache.set(10, 10);

    expect(cache.capacity).toEqual(3);
    expect(cache._cache.size).toEqual(3);
    expect(cache._lruEntry.findHead().element).toEqual(10);
    expect(cache.get(1)).toBeUndefined();
    expect(cache._lruEntry.findHead().element).toEqual(10);

    cache.delete(10);
    expect(cache._lruEntry.findHead().element).toEqual(2);
    expect(cache.get(10)).toBeUndefined();

    cache.clear();
    expect(cache._cache.size).toEqual(0);


  });

});
