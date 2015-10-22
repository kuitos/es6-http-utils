/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-21
 * node structure
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function Node() {
  var element = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  var prevNode = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var nextNode = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  _classCallCheck(this, Node);

  this.element = element;
  this.prev = prevNode;
  this.next = nextNode;
};

exports["default"] = Node;
module.exports = exports["default"];