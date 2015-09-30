/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-09-21
 * fetch request api基础封装
 */

import unused from 'whatwg-fetch';

const fetch = window.fetch;

let toString = Object.prototype.toString;

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function isFile(obj) {
  return toString.call(obj) === '[object File]';
}

function isBlob(obj) {
  return toString.call(obj) === '[object Blob]';
}

function isFormData(obj) {
  return toString.call(obj) === '[object FormData]';
}

function toJson(obj) {
  if (obj !== undefined) {
    return JSON.stringify(obj);
  }
}

// 参数为json对象时则作序列化操作
function transformRequest(payload) {
  return isObject(payload) && !isFile(payload) && !isBlob(payload) && !isFormData(payload) ? toJson(payload) : payload;
}

// 响应头为application/json时作反序列化处理
function transformResponse(response) {

  let contentType = response.headers.get('Content-Type');

  if (contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) {
    return response.json();
  } else {
    return response;
  }

}

// 请求方法类型
const METHODS = {
  GET   : 'GET',
  POST  : 'POST',
  PUT   : 'PUT',
  PATCH : 'PATCH',
  DELETE: 'DELETE'
};

const APPLICATION_JSON = 'application/json';

// fetch默认配置
let DEFAULT_CONFIG = {
  mode       : 'same-origin',
  headers    : {'Content-Type': `${APPLICATION_JSON};charset=utf-8`},
  cache      : 'no-cache',
  credentials: 'same-origin'
};

function sendReq(url, method, payload, configs) {

  let init;

  // get和delete方法不允许有请求体
  if (~[METHODS.GET, METHODS.DELETE].indexOf(method)) {
    init = Object.assign({}, DEFAULT_CONFIG, configs, {method});
  } else {
    init = Object.assign({body: transformRequest(payload)}, DEFAULT_CONFIG, configs, {method});
  }

  return fetch(url, init).then(response => {
    return transformResponse(response);
  });
}

export default {

  get (url, configs){
    return sendReq(url, METHODS.GET, undefined, configs);
  },

  post (url, payload, configs){
    return sendReq(url, METHODS.POST, payload, configs);
  },

  put (url, payload, configs){
    return sendReq(url, METHODS.PUT, payload, configs);
  },

  patch (url, payload, configs){
    return sendReq(url, METHODS.PATCH, payload, configs);
  },

  delete (url, configs){
    return sendReq(url, METHODS.DELETE, undefined, configs);
  }

}
