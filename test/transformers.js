/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-19
 */

import FetchHttp from '../src/http/fetch-http.js';

FetchHttp.defaultConfigs.requestTransformers.push((data, headersGetter, status) => {

  console.log('request transformer execute', data, headersGetter, status);

  return data;

});

FetchHttp.defaultConfigs.responseTransformers.push((data, headersGetter, status) => {

  console.log('response transformer execute', data, headersGetter, status);

  return data;

});
