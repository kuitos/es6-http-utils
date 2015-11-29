/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-11-29
 */
import CacheFactory from '../cache/cache-factory';
import FetchHttpResource from '../http/fetch-http-resource';
import {REQUEST_METHODS} from '../constants/http-constants';

let ResourceUtils = {

  API_PREFIX: '',

  DEFAULT_REST_CACHE: CacheFactory.create('defaultRestCache', 50),

  genResource(urlTemplate, cache, defaultParams, additionalActions){

    const restHttpCache = (cache === undefined) ? this.DEFAULT_REST_CACHE : cache;

    const DEFAULT_ACTIONS = {
      'get'   : {method: REQUEST_METHODS.GET, cache: restHttpCache},  // query return object
      'query' : {method: REQUEST_METHODS.GET, cache: restHttpCache, isArray: true}, // query return array
      'save'  : {method: REQUEST_METHODS.POST, cache: restHttpCache}, // save
      'update': {method: REQUEST_METHODS.PUT, cache: restHttpCache},  // batch update
      'patch' : {method: REQUEST_METHODS.PATCH, cache: restHttpCache},  // part update
      'delete': {method: REQUEST_METHODS.DELETE, cache: restHttpCache}, // physical delete
      'remove': {method: REQUEST_METHODS.DELETE, cache: restHttpCache}  // logical delete
    };

    return new FetchHttpResource(this.API_PREFIX + urlTemplate, defaultParams, Object.assign({}, DEFAULT_ACTIONS, additionalActions));

  }

};

ResourceUtils.genResource = ResourceUtils.genResource.bind(ResourceUtils);

export default ResourceUtils;
