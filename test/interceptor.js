/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-19
 */

import FetchHttp from '../src/core/fetch-http.js';

FetchHttp.defaultConfigs.interceptors.push({

  request(request){

    console.log('request success interceptor execute', request);
    return request;
  },

  reqeustError(request){
    console.log('request error interceptor execute', request);
    return request;
  },

  response(response){
    console.log('response success interceptor execute', response);
    return response;
  },

  responseError(response){
    console.log('response error interceptor execute', response);
    return response;
  }

});
