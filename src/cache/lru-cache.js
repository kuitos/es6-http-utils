/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-20
 * lru cache module
 */

import Node from '../data-structure/Node.js';

let lruEntry = new Map();

let head = null;
let end = null;

function refreshEntry(entry) {

  lruEntry

}

function setHead2Entry(key) {

}

export default class LRUCache extends Map {

  constructor(capacity) {
    super();
    this.capacity = capacity || Number.MAX_VALUE;
  }

  get(key) {

    // when capacity less than MAX_VALUE,we don't need to refresh lru entry
    if (this.capacity < Number.MAX_VALUE) {
      head = new Node(key);
    }

    return super.get(key);
  }

  set(key, value) {

    head = new Node(key);
    if (!end) {
      end = new Node(key);
    }

    if (this.size > this.capacity) {
      this.delete(end.element);
    }

    // return cache for invocation chaining
    return super.set(key, value);
  }

  delete(key) {
    super.delete(key);
  }

  clear() {
    super.clear();
  }

}
