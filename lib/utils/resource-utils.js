/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-11-29
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cacheCacheFactory = require('../cache/cache-factory');

var _cacheCacheFactory2 = _interopRequireDefault(_cacheCacheFactory);

var _httpFetchHttpResource = require('../http/fetch-http-resource');

var _httpFetchHttpResource2 = _interopRequireDefault(_httpFetchHttpResource);

var _constantsHttpConstants = require('../constants/http-constants');

var ResourceUtils = {

	API_PREFIX: '',

	DEFAULT_REST_CACHE: _cacheCacheFactory2['default'].create('defaultRestCache', 50),

	genResource: function genResource(urlTemplate, cache, defaultParams, additionalActions) {

		var restHttpCache = cache === undefined ? this.DEFAULT_REST_CACHE : cache;

		var DEFAULT_ACTIONS = {
			'get': { method: _constantsHttpConstants.REQUEST_METHODS.GET, cache: restHttpCache }, // query return object
			'query': { method: _constantsHttpConstants.REQUEST_METHODS.GET, cache: restHttpCache, isArray: true }, // query return array
			'save': { method: _constantsHttpConstants.REQUEST_METHODS.POST, cache: restHttpCache }, // save
			'update': { method: _constantsHttpConstants.REQUEST_METHODS.PUT, cache: restHttpCache }, // batch update
			'patch': { method: _constantsHttpConstants.REQUEST_METHODS.PATCH, cache: restHttpCache }, // part update
			'delete': { method: _constantsHttpConstants.REQUEST_METHODS.DELETE, cache: restHttpCache }, // physical delete
			'remove': { method: _constantsHttpConstants.REQUEST_METHODS.DELETE, cache: restHttpCache } // logical delete
		};

		return new _httpFetchHttpResource2['default'](this.API_PREFIX + urlTemplate, defaultParams, Object.assign({}, DEFAULT_ACTIONS, additionalActions));
	}

};

ResourceUtils.genResource = ResourceUtils.genResource.bind(ResourceUtils);

exports['default'] = ResourceUtils;
module.exports = exports['default'];