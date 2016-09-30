/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-14
 * restful like use fetch api,inspired by ngResource
 */

import FetchHttp from './fetch-http.js';
import { REQUEST_METHODS } from '../constants/http-constants.js';
import { encodeUriSegment } from '../utils/url-util';

/**
 * use params to fill the url template
 * @param urlTemplate
 * @param params
 * @returns filled url template
 */
function genUrlFromTemplate(urlTemplate, params) {

	let generatedUrl = urlTemplate.replace(/:\w+/g, match => {
		let key = match.substr(1);
		return params[key] !== undefined ? encodeUriSegment(params[key]) : '';
	});

	generatedUrl = generatedUrl.replace(/https?:\/\//, '$&//').replace(/\/\//g, '/');

	return generatedUrl;

}

/**
 * get the rest params after url template use up
 * @param urlTemplate
 * @param params
 * @returns rest params
 */
function getRestParamsFromUrlTemplate(urlTemplate, params) {

	let restParams = Object.assign({}, params);

	(urlTemplate.match(/:\w+/g) || []).forEach(key => {
		delete restParams[key.substr(1)];
	});

	return restParams;
}

class FetchHttpResource {

	/**
	 * Resource Constructor
	 * @param urlTemplate
	 * @param defaultParams
	 * @param actions
	 *          {get:{method:...,headers:....}} see fetch api config
	 * @returns {} resource instance
	 */
	constructor(urlTemplate, defaultParams, actions = {}) {

		let resource = {};
		// POST|PUT|PATCH can have request body according to rest specification
		let methodsCanHaveBody = [REQUEST_METHODS.POST, REQUEST_METHODS.PUT, REQUEST_METHODS.PATCH];

		Object.keys(Object.assign(actions, FetchHttpResource.defaults.actions)).forEach(actionName => {

			/**
			 * generate resource method
			 * @returns {Promise.<response>}
			 */
			resource[actionName] = (...args) => {

				let configs = {};
				let action = actions[actionName];
				let method = action.method;
				let hasBody = !!~methodsCanHaveBody.indexOf(method);
				let params;

				switch (args.length) {

					case 2:
						params = args[0];
						configs.data = args[1];
						break;

					case 1:
						if (hasBody) {
							configs.data = args[0];
						} else {
							params = args[0];
						}
						break;

					case 0:
						break;

					default:
						throw new Error('unexpected arguments!');

				}

				// fill configs from action
				Object.keys(action).forEach(prop => {

					if (prop !== 'isArray') {
						configs[prop] = action[prop];
					}

				});

				let extractParams = Object.assign({}, defaultParams, params);
				let url = genUrlFromTemplate(urlTemplate, extractParams);

				// strip trailing slashes and set the url (unless this behavior is specifically disabled)
				if (FetchHttpResource.defaults.stripTrailingSlashes) {
					url = url.replace(/\/+$/, '') || '/';
				}

				configs.params = getRestParamsFromUrlTemplate(urlTemplate, extractParams);

				return FetchHttp(url, method, configs).then(response => {

					return response.data.then(data => {
						if (!!action.isArray !== Array.isArray(data)) {
							throw new Error(`${method} request to url:${response.url} occurred an error in resource configuration for action ${actionName}.` +
								`Expected response to contain an ${action.isArray ? 'array' : 'object'} but got an ${Array.isArray(response.data) ? 'array' : 'object'}`);
						}

						return data;
					});
				}, response => Promise.reject(response));

			};

		});

		return resource;
	}

}

// resource defaults configurations
FetchHttpResource.defaults = {

	actions: {
		'get': {method: REQUEST_METHODS.GET},  // query return object
		'query': {method: REQUEST_METHODS.GET, isArray: true}, // query return array
		'save': {method: REQUEST_METHODS.POST}, // save
		'update': {method: REQUEST_METHODS.PUT},  // batch update
		'patch': {method: REQUEST_METHODS.PATCH},  // part update
		'delete': {method: REQUEST_METHODS.DELETE}, // physical delete
		'remove': {method: REQUEST_METHODS.DELETE}  // logical delete
	},

	stripTrailingSlashes: true

};

export default FetchHttpResource;
