/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-14
 * restful like use fetch api,inspired by ngResource
 */

import FetchRequest from './fetch-request.js';
import {REQUEST_METHODS} from '../constants/http-constants.js';

/**
 * use params to fill the url template
 * @param urlTemplate
 * @param params
 * @returns filled url template
 */
function genUrlFromTemplate(urlTemplate, params) {

  let generatedUrl = urlTemplate.replace(/:\w+/g, function (match) {
    let key = match.substr(1);
    return params[key] !== undefined ? params[key] : '';
  });

  generatedUrl = generatedUrl.replace(/\/\//g, '/');

  return generatedUrl;

}

/**
 * get the rest params after url template use up
 * @param urlTemplate
 * @param params
 * @returns rest params
 */
function getRestParamsFromUrlTemplate(urlTemplate, params) {

  let restParams = Object.assign({}, params);

  (urlTemplate.match(/:\w+/g) || []).forEach(key => {
    delete restParams[key.substr(1)];
  });

  return restParams;
}

class FetchRequestResource {

  /**
   * Resource Constructor
   * @param urlTemplate
   * @param defaultParams
   * @param actions
   *          {get:{method:...,headers:....}} see fetch api config
   * @returns {} resource instance
   */
  constructor(urlTemplate, defaultParams, actions = {}) {

    let resource = {};
    // POST|PUT|PATCH can have request body according to rest specification
    let methodsCanHaveBody = [REQUEST_METHODS.POST, REQUEST_METHODS.PUT, REQUEST_METHODS.PATCH];

    Object.keys(Object.assign(actions, FetchRequestResource.defaults.actions)).forEach(actionName => {

      /**
       * generate resource method
       * @returns {Promise.<response>}
       */
      resource[actionName] = (...args) => {

        let configs = {},
          action = actions[actionName],
          method = action.method,
          hasBody = !!~methodsCanHaveBody.indexOf(method),
          params;

        switch (args.length) {

          case 2:
            params = args[0];
            configs.data = args[1];
            break;

          case 1:
            if (hasBody) {
              configs.data = args[0];
            } else {
              params = args[0];
            }
            break;

          case 0:
            break;

          default:
            throw new Error('unexpected arguments!');

        }

        // fill configs from action
        Object.keys(action).forEach(prop => {

          if (prop !== 'isArray') {
            configs[prop] = action[prop];
          }

        });

        let extractParams = Object.assign({}, defaultParams, params);
        let url = genUrlFromTemplate(urlTemplate, extractParams);

        configs.params = getRestParamsFromUrlTemplate(urlTemplate, extractParams);

        return FetchRequest(url, method, configs).then(response => {

          if (!!action.isArray !== Array.isArray(response)) {
            throw new Error(`${method} request to url:${url} occurred an error in resource configuration for action ${actionName}.
            Expected response to contain an ${action.isArray ? 'array' : 'object'} but got an ${Array.isArray(response) ? 'array' : 'object'}`);
          }

          return response;
        });

      }

    });

    return resource;
  }

}

// resource defaults configurations
FetchRequestResource.defaults = {

  actions: {
    'get'       : {method: REQUEST_METHODS.GET},
    'query'     : {method: REQUEST_METHODS.GET, isArray: true},
    'save'      : {method: REQUEST_METHODS.POST},
    'update'    : {method: REQUEST_METHODS.PUT},
    'partUpdate': {method: REQUEST_METHODS.PATCH},
    'delete'    : {method: REQUEST_METHODS.DELETE}, // physical delete
    'remove'    : {method: REQUEST_METHODS.DELETE}  // logical delete
  }

};

export default FetchRequestResource;
