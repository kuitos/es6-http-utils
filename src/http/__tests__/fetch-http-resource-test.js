/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-28
 */

import FetchHttpResource from '../fetch-http-resource.js';
import {REQUEST_METHODS} from '../../constants/http-constants.js';

describe('FetchHttpResource', () => {

  it('fetch restful resource', () => {

    let PostsResource = new FetchHttpResource('/posts/:postId/', undefined, {test: {method: REQUEST_METHODS.GET}});

    // todo how to test ajax
    //PostsResource.get({postId: 2}).then(response => {
    //  expect(response.userName).toEqual('kaa');
    //});
    //
    //PostsResource.test({postId: 11}).then(response => {
    //  expect(response.userName).toEqual('god12312');
    //});
    //
    //PostsResource.query().then(response => {
    //
    //  expect(Array.isArray(response)).toBe(false);
    //
    //});

  });

});
