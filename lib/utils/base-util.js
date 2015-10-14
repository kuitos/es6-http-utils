/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-14
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isString = isString;
exports.isObject = isObject;
exports.isDate = isDate;
exports.isFile = isFile;
exports.isBlob = isBlob;
exports.isFormData = isFormData;
exports.toJson = toJson;
var toString = Object.prototype.toString;

function isString(string) {
  return typeof string === 'string';
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function isDate(date) {
  return toString.call(value) === '[object Date]';
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