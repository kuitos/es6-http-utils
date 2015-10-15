/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-09-21
 * Fetch request api.Inspired by angular $http
 */

import unused from 'whatwg-fetch';
import {REQUEST_METHODS, APPLICATION_JSON} from '../constants/http-constants.js';
import {isString, isObject, isDate, isFile, isBlob, isFormData, toJson} from '../utils/base-util.js';
import {urlIsSameOrigin, encodeUriQuery} from '../utils/web-util.js';

const fetch = window.fetch,
  Headers = window.Headers;

// serialize to json string when payload was an object
function transformRequest(payload) {
  return isObject(payload) && !isFile(payload) && !isBlob(payload) && !isFormData(payload) ? toJson(payload) : payload;
}

// deserialize response when response content-type was application/json
function transformResponse(response) {

  let contentType = response.headers.get('Content-Type');

  if (contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) {
    return response.json();
  } else {
    return response;
  }

}

function buildUrl(url, params) {

  let parts = [],
    builtUrl = url;

  if (params) {

    Object.keys(params).sort().forEach(key => {

      let value = params[key];

      // not undefined or null
      if (value != undefined) {

        if (isObject(value)) {
          if (isDate(value)) {
            value = value.toISOString();
          } else if (Array.isArray(value)) {
            value = value.join(',');
          } else {
            value = toJson(value);
          }
        }

        parts.push(`${encodeUriQuery(key)}=${encodeUriQuery(value)}`);
      }

    });

    if (parts.length) {
      builtUrl = `${url}${url.indexOf('?') === -1 ? '?' : '&'}${parts.join('&')}`;
    }

  }

  return builtUrl;
}

// fetch api common config
let COMMON_CONFIG = {
  headers    : {'Content-Type': `${APPLICATION_JSON};charset=utf-8`, 'X-Requested-With': 'https://github.com/kuitos/'},
  mode       : 'same-origin',
  credentials: 'same-origin',
  cache      : 'no-cache'
};

/**
 *
 * @param url
 * @param method
 * @param configs:
 *           params: url query params
 *           data: request payload.
 * Other configs see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
 * @returns {*|Promise.<response>}
 * @constructor
 */
function FetchRequest(url, method, configs) {

  if (!urlIsSameOrigin(url)) {
    configs.mode = 'cors';
  }

  // merge headers
  configs.headers = Object.assign({}, COMMON_CONFIG.headers, configs.headers);

  // build url
  if (configs.params) {
    url = buildUrl(url, configs.params);
  }

  let init = Object.assign({body: transformRequest(configs.data)}, COMMON_CONFIG, configs, {method});

  return fetch(url, init).then(response => {
    return transformResponse(response);
  });
}

FetchRequest.get = (url, params, configs = {}) => {
  configs.params = params;
  return FetchRequest(url, REQUEST_METHODS.GET, configs);
};

FetchRequest.post = (url, payload, configs = {}) => {
  configs.data = payload;
  return FetchRequest(url, REQUEST_METHODS.POST, configs);
};

FetchRequest.put = (url, payload, configs = {}) => {
  configs.data = payload;
  return FetchRequest(url, REQUEST_METHODS.PUT, configs);
};

FetchRequest.patch = (url, payload, configs = {}) => {
  configs.data = payload;
  return FetchRequest(url, REQUEST_METHODS.PATCH, configs);
};

FetchRequest.delete = (url, configs = {}) => {
  return FetchRequest(url, REQUEST_METHODS.DELETE, configs);
};

export default FetchRequest;
