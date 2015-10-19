/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-14
 * restful like use fetch api,inspired by ngResource
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fetchHttpJs = require('./fetch-http.js');

var _fetchHttpJs2 = _interopRequireDefault(_fetchHttpJs);

var _constantsHttpConstantsJs = require('../constants/http-constants.js');

var _utilsWebUtilJs = require('../utils/web-util.js');

/**
 * use params to fill the url template
 * @param urlTemplate
 * @param params
 * @returns filled url template
 */
function genUrlFromTemplate(urlTemplate, params) {

  var generatedUrl = urlTemplate.replace(/:\w+/g, function (match) {
    var key = match.substr(1);
    return params[key] !== undefined ? (0, _utilsWebUtilJs.encodeUriSegment)(params[key]) : '';
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

  var restParams = Object.assign({}, params);

  (urlTemplate.match(/:\w+/g) || []).forEach(function (key) {
    delete restParams[key.substr(1)];
  });

  return restParams;
}

var FetchHttpResource =

/**
 * Resource Constructor
 * @param urlTemplate
 * @param defaultParams
 * @param actions
 *          {get:{method:...,headers:....}} see fetch api config
 * @returns {} resource instance
 */
function FetchHttpResource(urlTemplate, defaultParams) {
  var actions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  _classCallCheck(this, FetchHttpResource);

  var resource = {};
  // POST|PUT|PATCH can have request body according to rest specification
  var methodsCanHaveBody = [_constantsHttpConstantsJs.REQUEST_METHODS.POST, _constantsHttpConstantsJs.REQUEST_METHODS.PUT, _constantsHttpConstantsJs.REQUEST_METHODS.PATCH];

  Object.keys(Object.assign(actions, FetchHttpResource.defaults.actions)).forEach(function (actionName) {

    /**
     * generate resource method
     * @returns {Promise.<response>}
     */
    resource[actionName] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var configs = {},
          action = actions[actionName],
          method = action.method,
          hasBody = !! ~methodsCanHaveBody.indexOf(method),
          params = undefined;

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
      Object.keys(action).forEach(function (prop) {

        if (prop !== 'isArray') {
          configs[prop] = action[prop];
        }
      });

      var extractParams = Object.assign({}, defaultParams, params);
      var url = genUrlFromTemplate(urlTemplate, extractParams);

      configs.params = getRestParamsFromUrlTemplate(urlTemplate, extractParams);

      return (0, _fetchHttpJs2['default'])(url, method, configs).then(function (response) {

        if (!!action.isArray !== Array.isArray(response)) {
          throw new Error(method + ' request to url:' + url + ' occurred an error in resource configuration for action ' + actionName + '.' + ('Expected response to contain an ' + (action.isArray ? 'array' : 'object') + ' but got an ' + (Array.isArray(response) ? 'array' : 'object')));
        }

        return response;
      });
    };
  });

  return resource;
}

// resource defaults configurations
;

FetchHttpResource.defaults = {

  actions: {
    'get': { method: _constantsHttpConstantsJs.REQUEST_METHODS.GET },
    'query': { method: _constantsHttpConstantsJs.REQUEST_METHODS.GET, isArray: true },
    'save': { method: _constantsHttpConstantsJs.REQUEST_METHODS.POST },
    'update': { method: _constantsHttpConstantsJs.REQUEST_METHODS.PUT },
    'partUpdate': { method: _constantsHttpConstantsJs.REQUEST_METHODS.PATCH },
    'delete': { method: _constantsHttpConstantsJs.REQUEST_METHODS.DELETE }, // physical delete
    'remove': { method: _constantsHttpConstantsJs.REQUEST_METHODS.DELETE } // logical delete
  }

};

exports['default'] = FetchHttpResource;
module.exports = exports['default'];