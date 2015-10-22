/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-22
 */

import DoubleLinkedList from './DoubleLinkedList.js';


export default class HashDoubleLinkedList extends DoubleLinkedList {

  constructor() {
    super();
    this._hashMap = new Map();
  }

  find(element) {
    return this._hashMap.get(element);
  }

  insertBefore(beforeBaseElement, element) {
    let node = super.insertBefore(beforeBaseElement, element);
    this._hashMap.set(element, node);
    return node;
  }

  insertAfter(afterBaseElement, element) {
    let node = super.insertAfter(afterBaseElement, element);
    this._hashMap.set(element, node);
    return node;
  }

  insertHead(element) {
    let node = super.insertHead(element);
    this._hashMap.set(element, node);
    return node;
  }

  insertEnd(element) {
    let node = super.insertEnd(element);
    this._hashMap.set(element, node);
    return node;
  }

  remove(element) {
    let node = super.remove(element);
    this._hashMap.delete(element);
    return node;
  }

  display() {

    super.display();

    for (let entry of this._hashMap) {

      console.log(entry);

    }

  }

}
