/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-11-04
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _httpFetchHttp = require('./../../http/fetch-http');

var _httpFetchHttp2 = _interopRequireDefault(_httpFetchHttp);

var _events = require('events');

var setTimeout = window.setTimeout;
var interceptorBlackList = _httpFetchHttp2['default'].defaultConfigs.interceptorBlackList;

function isUrlInInterceptorBlackList(url) {
	return !! ~interceptorBlackList.indexOf(url);
}

var counter = 0;
var loading = false;

var eventEmitter = new _events.EventEmitter();

exports.eventEmitter = eventEmitter;
exports['default'] = {

	request: function request(_request) {

		if (!isUrlInInterceptorBlackList(_request.url)) {

			counter++;

			if (!loading) {

				setTimeout(function () {

					if (!loading && counter > 0) {
						loading = true;
						eventEmitter.emit('loadingStatusChanged', loading);
					}
				}, 500);
			}
		}

		return _request;
	},

	response: function response(_response) {

		counter--;

		if (counter === 0) {

			if (loading) {
				loading = false;
				eventEmitter.emit('loadingStatusChanged', loading);
			}
		}

		return _response;
	},

	responseError: function responseError(response) {

		counter--;

		if (counter === 0) {

			if (loading) {
				loading = false;
				eventEmitter.emit('loadingStatusChanged', loading);
			}
		}

		return Promise.reject(response);
	}

};