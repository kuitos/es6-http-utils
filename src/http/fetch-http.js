/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-09-21
 * Fetch request api,inspired by angular $http
 */

import unused from 'whatwg-fetch';
import {REQUEST_METHODS, APPLICATION_JSON} from '../constants/http-constants.js';
import {isString, isFunction, isObject, isDate, isFile, isBlob, isFormData, toJson} from '../utils/object-util';
import {urlIsSameOrigin, encodeUriQuery} from '../utils/url-util';
import LRUCache from '../cache/lru-cache.js';

const fetch = window.fetch;
const Headers = window.Headers;

function getHeadersGetter(headers) {
  headers = new Headers(headers);
  return headers.get.bind(headers);
}

// serialize to json string when payload was an object
function defaultRequestTransformer(data) {
  return isObject(data) && !isFile(data) && !isBlob(data) && !isFormData(data) ? toJson(data) : data;
}

// deserialize response when response content-type was application/json
function defaultResponseTransformer(response, headersGetter) {

  let contentType = headersGetter('Content-Type');

  if (contentType) {

    let isDataConsumed = response.hasOwnProperty('data');

    // because of the Response instance can only consume once,if the response had a data property,it means it had been consumed
    // so we need to get from data property
    if (contentType.indexOf(APPLICATION_JSON) === 0) {
      response.data = isDataConsumed ? response.data : response.json();
    } else {
      response.data = isDataConsumed ? response.data : response.text();
    }
    // todo handler more content type of data such as images/form,we need to convert them to blob/formData

  }

  return response;
}

// execute request|response transformers
function executeHttpTransformers(data, headersGetter, status, fns) {

  if (isFunction(fns)) {
    data = fns(data, headersGetter, status);
  } else {
    fns.forEach(fn => {
      data = fn(data, headersGetter, status);
    });
  }

  return data;
}

function combineResponseWithRequest(request, response) {

  Object.keys(request).forEach(prop => {

    let value = request[prop];
    // the prop which response not exist and it is not a function will be combine
    if (!isFunction(value) && !(prop in response)) {
      response[prop] = value;
    }

  });

  return response;
}

/**
 * process response entity then execute response transformers
 * @param request request configs
 * @param response response configs
 * @returns Promise
 */
function transformResponse(request, response) {

  if (response instanceof Error) {
    throw new TypeError('Response type error when transforming');
  } else {
    response = combineResponseWithRequest(request, response);
    response = executeHttpTransformers(response, getHeadersGetter(response.headers), response.status, response.responseTransformers);
    return Promise[response.ok ? 'resolve' : 'reject'](response);
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

// default cache
let defaultCacheStore = new LRUCache();

function sendReq(url, requestConfigs) {

  let promise = fetch(url, requestConfigs);

  if (requestConfigs.cacheStore) {

    let cacheStore = isObject(requestConfigs.cacheStore) ? requestConfigs.cacheStore : defaultCacheStore;
    let cacheResp = cacheStore.get(url);

    if (cacheResp) {
      return Promise.resolve(cacheResp);
    } else {
      // we need to store a promise as cache to solve the several async request when they are the same url
      cacheStore.set(url, promise);

      return promise;
    }

  } else {
    return promise;
  }
}

/**
 * @param url
 * @param method
 * @param configs:
 *           params: url query params
 *           data: request payload.
 *           headers: customer headers
 * Other configs see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
 * @returns {*|Promise.<response>}
 * @constructor
 */
function FetchHttp(url, method, configs) {

  if (!urlIsSameOrigin(url)) {
    configs.mode = 'cors';
  }

  // merge headers
  configs.headers = Object.assign({}, FetchHttp.defaultConfigs.headers, configs.headers);
  // copy interceptors from default configs
  configs.interceptors = Array.from(FetchHttp.defaultConfigs.interceptors);

  // merge method/url and other configs
  configs = Object.assign({url}, FetchHttp.defaultConfigs, configs, {method: method.toUpperCase()});

  // build url
  if (configs.params) {
    url = buildUrl(url, configs.params);
  }

  let serverRequest = requestConfigs => {

    // execute response transformers
    let processResponse = response => transformResponse(requestConfigs, response);

    // execute transformers
    let bodyAfterTransform = executeHttpTransformers(requestConfigs.data, getHeadersGetter(requestConfigs.headers), undefined, requestConfigs.requestTransformers);
    let configsAfterTransform = Object.assign({body: bodyAfterTransform}, requestConfigs);

    return sendReq(url, configsAfterTransform).then(processResponse, processResponse);
  };

  // build the request execute chain
  let chain = [serverRequest, undefined];

  // add interceptors into execute chain which will around the server request
  let interceptors = configs.interceptors;
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

  // execute chain which include interceptors,serverRequest and transformers
  let promise = Promise.resolve(configs);
  while (chain.length) {

    let resolveFn = chain.shift();
    let rejectFn = chain.shift();

    promise = promise.then(resolveFn, rejectFn);
  }

  // resolve response data entity to caller
  return promise.then(response => response.data, response => Promise.reject(response));
}

/**
 * FetchHttp short methods
 */
(function createShortMethods(names) {

  names.forEach(name => {

    FetchHttp[name.toLowerCase()] = (url, params, configs = {}) => {
      configs.params = params;
      return FetchHttp(url, name, configs);
    }
  });

})([REQUEST_METHODS.GET, REQUEST_METHODS.DELETE, REQUEST_METHODS.HEAD]);

(function createShortMethodsWithPayload(names) {

  names.forEach(name => {

    FetchHttp[name.toLowerCase()] = (url, payload, configs = {}) => {
      configs.data = payload;
      return FetchHttp(url, REQUEST_METHODS.POST, configs);
    }
  });

})([REQUEST_METHODS.POST, REQUEST_METHODS.PUT, REQUEST_METHODS.PATCH]);

/**
 * FetchHttp configuration
 */
FetchHttp.defaultConfigs = {

  headers    : {
    'Content-Type'    : `${APPLICATION_JSON};charset=utf-8`,
    'X-Requested-With': 'https://github.com/kuitos/'
  },
  credentials: 'same-origin',
  mode       : 'same-origin',
  cache      : 'no-cache',

  cacheStore          : false,
  interceptors        : [],
  interceptorBlackList: [],
  requestTransformers : [defaultRequestTransformer],
  responseTransformers: [defaultResponseTransformer]

};

export default FetchHttp;
