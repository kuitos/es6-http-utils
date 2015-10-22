/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-20
 * lru cache module
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _dataStructureNodeJs = require('../data-structure/Node.js');

var _dataStructureNodeJs2 = _interopRequireDefault(_dataStructureNodeJs);

var lruEntry = new Map();

var head = null;
var end = null;

function refreshEntry(entry) {

  lruEntry;
}

function setHead2Entry(key) {}

var LRUCache = (function (_Map) {
  _inherits(LRUCache, _Map);

  function LRUCache(capacity) {
    _classCallCheck(this, LRUCache);

    _get(Object.getPrototypeOf(LRUCache.prototype), 'constructor', this).call(this);
    this.capacity = capacity || Number.MAX_VALUE;
  }

  _createClass(LRUCache, [{
    key: 'get',
    value: function get(key) {

      // when capacity less than MAX_VALUE,we don't need to refresh lru entry
      if (this.capacity < Number.MAX_VALUE) {
        head = new _dataStructureNodeJs2['default'](key);
      }

      return _get(Object.getPrototypeOf(LRUCache.prototype), 'get', this).call(this, key);
    }
  }, {
    key: 'set',
    value: function set(key, value) {

      head = new _dataStructureNodeJs2['default'](key);
      if (!end) {
        end = new _dataStructureNodeJs2['default'](key);
      }

      if (this.size > this.capacity) {
        this['delete'](end.element);
      }

      // return cache for invocation chaining
      return _get(Object.getPrototypeOf(LRUCache.prototype), 'set', this).call(this, key, value);
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      _get(Object.getPrototypeOf(LRUCache.prototype), 'delete', this).call(this, key);
    }
  }, {
    key: 'clear',
    value: function clear() {
      _get(Object.getPrototypeOf(LRUCache.prototype), 'clear', this).call(this);
    }
  }]);

  return LRUCache;
})(Map);

exports['default'] = LRUCache;
module.exports = exports['default'];