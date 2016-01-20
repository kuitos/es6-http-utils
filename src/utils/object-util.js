/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-14
 */

let toString = Object.prototype.toString;

export function isString(string) {
	return typeof string === 'string';
}

export function isObject(value) {
	return value !== null && typeof value === 'object';
}

export function isFunction(fn) {
	return typeof fn === 'function';
}

export function isDate(date) {
	return toString.call(date) === '[object Date]';
}

export function isFile(obj) {
	return toString.call(obj) === '[object File]';
}

export function isBlob(obj) {
	return toString.call(obj) === '[object Blob]';
}

export function isFormData(obj) {
	return toString.call(obj) === '[object FormData]';
}

export function toJson(obj) {
	if (obj !== undefined) {
		return JSON.stringify(obj);
	}
}

