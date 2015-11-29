/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-11-29
 */

jest.dontMock('../cache-factory.js');

let CacheFactory = require('../cache-factory.js');

describe('cache factory', () => {

  it('create test', () => {

    let cache = CacheFactory.create('cache1', 5);
    cache.set('name', 'kuitos');

    expect(CacheFactory.get('cache1').get('name')).toEqual('kuitos');

  });

});
