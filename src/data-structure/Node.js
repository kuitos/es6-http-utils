/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-21
 * node structure
 */

export default class Node {

  constructor(element = null, prevNode = null, nextNode = null) {
    this.element = element;
    this.prev = prevNode;
    this.next = nextNode;
  }

}
