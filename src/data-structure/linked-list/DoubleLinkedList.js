/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-21
 */

import Node from './../Node.js';

export default class DoubleLinkedList {

  constructor() {
    this._headNode = new Node();
    this._endNode = new Node();
  }

  /**
   * @returns Node or null
   */
  find(element) {

    let currentNode = this._headNode;

    while (currentNode && (currentNode.element !== element)) {
      currentNode = currentNode.next;
    }

    return currentNode;
  }

  findHead() {
    return this._headNode;
  }

  findEnd() {
    return this._endNode;
  }

  insertBefore(beforeBaseElement, element) {

    let beforeBaseNode = this.find(beforeBaseElement);

    if (beforeBaseNode === null || beforeBaseNode === this._headNode || beforeBaseNode.prev.element === null) {
      return this.insertHead(element);
    } else {

      let node = new Node(element);
      node.next = beforeBaseNode;
      node.prev = beforeBaseNode.prev;
      beforeBaseNode.prev = node;
      node.prev.next = node;

      return node;
    }

  }

  insertAfter(afterBaseElement, element) {

    let afterBaseNode = this.find(afterBaseElement);

    if (afterBaseNode === null || afterBaseNode === this._endNode || afterBaseNode.next.element === null) {
      return this.insertEnd(element);
    } else {

      let node = new Node(element);

      node.prev = afterBaseNode;
      node.next = afterBaseNode.next;
      afterBaseNode.next = node;
      node.next.prev = node;

      return node;
    }

  }

  insertHead(element) {

    let node = new Node(element);

    if (this._headNode.element === null) {

      this._headNode = node;
      this._headNode.next = this._endNode;
      this._endNode.prev = this._headNode;

    } else {

      node.next = this._headNode;
      this._headNode.prev = node;
      this._headNode = node;

      if (this._endNode.element === null) {
        this.insertEnd(this._endNode.prev.element);
      }
    }

    return node;
  }

  insertEnd(element) {

    let node = new Node(element);

    if (this._endNode.element === null) {

      this._endNode = node;
      this._endNode.prev = this._headNode;
      this._headNode.next = this._endNode;

    } else {

      node.prev = this._endNode;
      this._endNode.next = node;
      this._endNode = node;

      if (this._headNode.element === null) {
        this.insertHead(this._headNode.next.element);
      }
    }

    return node;
  }

  remove(element) {

    let node = this.find(element);

    if (node !== null) {

      if (node === this._headNode) {

        // remove head
        this._headNode = this._headNode.next;
        this._headNode.prev = null;

      } else if (node === this._endNode) {

        // remove end
        this._endNode = this._endNode.prev;
        this._endNode.next = null;

      } else {

        let prevNode = node.prev;
        let nextNode = node.next;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
      }

    }

    return node;
  }

  removeHead() {
    return this.remove(this._headNode.element);
  }

  removeEnd() {
    return this.remove(this._endNode.element);
  }

  clear() {
    this._headNode = new Node();
    this._endNode = new Node();
  }

  display() {

    let currentNode = this._headNode;

    while (currentNode) {
      console.log(currentNode);
      currentNode = currentNode.next;
    }

  }

}


