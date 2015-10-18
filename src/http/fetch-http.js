/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-09-21
 * Fetch request api.Inspired by angular $http
 */

import unused from 'whatwg-fetch';
import {REQUEST_METHODS, APPLICATION_JSON} from '../constants/http-constants.js';
import {isString, isFunction, isObject, isDate, isFile, isBlob, isFormData, toJson} from '../utils/base-util.js';
import {urlIsSameOrigin, encodeUriQuery} from '../utils/web-util.js';

const fetch = window.fetch;
const Request = window.Request;
const Response = window.Response;

// serialize to json string when payload was an object
function defaultRequestTransformer(request) {
  let body = request.body;
  request.body = isObject(body) && !isFile(body) && !isBlob(body) && !isFormData(body) ? toJson(body) : body;
  return request;
}

// deserialize response when response content-type was application/json
function defaultResponseTransformer(response) {

  if (response instanceof Response) {

    let contentType = response.headers.get('Content-Type');

    if (contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) {
      return response.json();
    }

  } else {
    return response;
  }

}

function executeRequestTransformers(request) {

  let fns = request.requestTransformers;

  if (isFunction(fns)) {
    body = fns(body, headers, status);
  } else {
    fns.forEach(fn => {
      body = fn(body, headers, status);
    });
  }

  return body;

}

function transformResponse(request, response) {

  if (response instanceof Response) {
    return Promise[response.ok ? 'resolve' : 'reject']({request, response});
  } else {
    return Promise.reject(new TypeError('Network request failed'));
  }

}

function buildUrl(url, params) {

  let queryParams = [];
  let builtUrl = url;

  if (params) {

    Object.keys(params).sort().forEach(key => {

      let value = params[key];

      // not undefined or null
      if (value != undefined) {

        if (isObject(value)) {
          if (isDate(value)) {
            value = value.toISOString();
          } else if (Array.isArray(value)) {
            // according to rest specification array should be separated by comma in url
            value = value.join(',');
          } else {
            value = toJson(value);
          }
        }

        queryParams.push(`${encodeUriQuery(key)}=${encodeUriQuery(value)}`);
      }

    });

    if (queryParams.length) {
      builtUrl = `${url}${url.indexOf('?') === -1 ? '?' : '&'}${queryParams.join('&')}`;
    }

  }

  return builtUrl;
}

/**
 * FetchHttp configuration
 */
FetchHttp.defaultConfigs = {

  headers    : {
    'Content-Type'    : `${APPLICATION_JSON};charset=utf-8`,
    'Cache-Control'   : 'no-cache',
    'X-Requested-With': 'https://github.com/kuitos/'
  },
  mode       : 'same-origin',
  credentials: 'same-origin',
  cache      : 'no-cache',

  interceptors        : [],
  requestTransformers : [defaultRequestTransformer],
  responseTransformers: [defaultResponseTransformer]

};

/**
 * @param url
 * @param method
 * @param request:
 *           params: url query params
 *           body: request payload.
 * Other configs see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
 * @returns {*|Promise.<response>}
 * @constructor
 */
function FetchHttp(url, method, request) {

  if (!urlIsSameOrigin(url)) {
    request.mode = 'cors';
    request.credentials = 'include';
  }

  // merge headers
  request.headers = Object.assign({}, FetchHttp.defaultConfigs.headers, request.headers);

  // merge method/url and other configs
  request = Object.assign({url}, FetchHttp.defaultConfigs, request, {method: method.toUpperCase()});

  // build url
  if (request.params) {
    url = buildUrl(url, request.params);
  }

  let serverRequest = request => {

    let handleResponse = response => {
      return transformResponse(request, response);
    };

    return fetch(url, Object.assign({body: executeRequestTransformers(request)}, request))
      .then(handleResponse, handleResponse);
  };

  let chain = [serverRequest, undefined];
  let interceptors = request.interceptors;
  while (interceptors.length) {

    // The reversal is needed so that we can build up the interception chain around the server request.
    let interceptor = interceptors.pop();

    if (interceptor.request || interceptor.requestError) {
      chain.unshift(interceptor.request, interceptor.requestError);
    }

    if (interceptor.response || interceptor.responseError) {
      chain.push(interceptor.response, interceptor.responseError);
    }
  }

  let promise = Promise.resolve(request);
  while (chain.length) {

    let resolveFn = chain.shift();
    let rejectFn = chain.shift();

    promise = promise.then(resolveFn, rejectFn);
  }

  return promise.then(defaultResponseTransformer, defaultResponseTransformer);
}

/**
 * FetchHttp short methods
 */
(function createShortMethods(names) {

  names.forEach(name => {

    FetchHttp[name] = (url, params, request = {}) => {
      request.params = params;
      return FetchHttp(url, name, request);
    }
  });

})([REQUEST_METHODS.GET, REQUEST_METHODS.DELETE, REQUEST_METHODS.HEAD]);

(function createShortMethodsWithPayload(names) {

  names.forEach(name => {

    FetchHttp[name] = (url, payload, request = {}) => {
      request.body = payload;
      return FetchHttp(url, REQUEST_METHODS.POST, request);
    }
  });

})([REQUEST_METHODS.POST, REQUEST_METHODS.PUT, REQUEST_METHODS.PATCH]);

export default FetchHttp;
