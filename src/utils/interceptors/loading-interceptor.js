/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-11-04
 */

import FetchHttp from './../../http/fetch-http';
import {EventEmitter} from 'events';

const setTimeout = window.setTimeout;
const interceptorBlackList = FetchHttp.interceptorBlackList;

function isUrlInInterceptorBlackList(url) {
  return !!~interceptorBlackList.indexOf(url);
}

let counter = 0;
let loading = false;

export let eventEmitter = new EventEmitter();

export default {

  request(request){

    if (!isUrlInInterceptorBlackList(request.url)) {

      counter++;

      if (!loading) {

        setTimeout(()=> {

          if (!loading && counter > 0) {
            loading = true;
            eventEmitter.emit('loading:start');
          }

        }, 500);
      }

    }

    return request;
  },

  response(response){

    counter--;

    if (counter === 0) {

      if (loading) {
        loading = false;
        eventEmitter.emit('loading-end');
      }

    }

    return response;

  },

  responseError(response){

    counter--;

    if (counter === 0) {

      if (loading) {
        loading = false;
        eventEmitter.emit('loading-end');
      }

    }

    return Promise.reject(response);

  }

}
