/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-09-30
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreFetchHttpJs = require('./core/fetch-http.js');

var _coreFetchHttpJs2 = _interopRequireDefault(_coreFetchHttpJs);

var _coreFetchHttpResourceJs = require('./core/fetch-http-resource.js');

var _coreFetchHttpResourceJs2 = _interopRequireDefault(_coreFetchHttpResourceJs);

exports.FetchHttp = _coreFetchHttpJs2['default'];
exports.FetchHttpResource = _coreFetchHttpResourceJs2['default'];