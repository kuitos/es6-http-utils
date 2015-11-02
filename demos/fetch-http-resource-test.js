/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-19
 */

import {FetchHttpResource} from '../src/index.js';
import {REQUEST_METHODS} from '../src/constants/http-constants.js';
import unused from './interceptor.js';

let PostsResource = new FetchHttpResource('/posts/:postId/', {postId: 11}, {test: {method: REQUEST_METHODS.GET}});

PostsResource.get().then(response => {
  console.log(response);
});

PostsResource.get().then(response => {
  console.log(response);
});

let Posts = new FetchHttpResource('https://api.github.com/repos/kuitos/kuitos.github.io/issues');

Posts.query().then(posts => {
  console.log(posts);
});

//PostsResource.save({id: 11, userName: 'kuitos'}).then(response => {
//  console.log(response);
//});
//
//PostsResource.update({userName: 'god12312'});
