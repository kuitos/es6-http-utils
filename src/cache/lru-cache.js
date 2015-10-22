/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-20
 * lru cache module
 */

import HashDoubleLinkedList from '../data-structure/linked-list/HashDoubleLinkedList.js';

// update lru entry head node
function updateLRUEntry(element, lruEntry) {
  lruEntry.remove(element);
  lruEntry.insertHead(element);
}

export default class LRUCache {

  constructor(capacity) {
    this.capacity = capacity || Number.MAX_VALUE;
    this._lruEntry = new HashDoubleLinkedList();
    this._cache = new Map();
  }

  get(key) {

    // when capacity less than MAX_VALUE,we need to refresh lru entry
    if (this.capacity < Number.MAX_VALUE) {
      updateLRUEntry(key, this._lruEntry);
    }

    return this._cache.get(key);
  }

  set(key, value) {

    if (this.capacity < Number.MAX_VALUE) {
      updateLRUEntry(key, this._lruEntry);
    }

    if (this._cache.size > this.capacity) {
      // eliminate the last node of lru entry
      this._cache.delete(this._lruEntry.removeEnd().element);
    }

    // return cache for invocation chaining
    return this._cache.set(key, value);
  }

  delete(key) {
    this._lruEntry.remove(key);
    this._cache.delete(key);
  }

  clear() {
    this._lruEntry.clear();
    this._cache.clear();
  }

}
