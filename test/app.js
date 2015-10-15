/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-09-01
 */
import unused from 'whatwg-fetch';
import {FetchRequest, FetchRequestResource} from '../src/index.js';

const fetch = window.fetch;

//fetch('/server.js').then(response => {
//  return response.text();
//}).then(data => {
//  console.log(data);
//});
//
//FetchRequest.post('/posts', {id: 111}).then(data => {
//  console.log(data);
//}).then(() => {
//  FetchRequest.get('/posts').then(data => {
//    console.log(data);
//  })
//});
//
//FetchRequest.delete('/posts/1', {userName: 'k'}).then(data => {
//  console.log(data);
//});
//
//let xhr = new XMLHttpRequest();
//xhr.open('GET', '/posts');
//xhr.setRequestHeader('X-Powered-By', 'Kuitos');
//xhr.send();

let PostsResource = new FetchRequestResource('/posts/:postId/', {postId: 11});
PostsResource.query().then(response => {
  console.log(response);
});

PostsResource.save({id: 11, userName: 'kuitos'}).then(response => {
  console.log(response);
});

PostsResource.update({userName: 'god12312'});

let GitHub = new FetchRequestResource('https://api.github.com/repos/kuitos/kuitos.github.io/issues?per_page=5&page=2', {},
  {query: {method: 'GET', headers: {Authorization: 'token 1c7271c113339c0a6f50e11c2fec05f0f0d31760'}, isArray: true}});

GitHub.query().then(res => {
  console.log(res);
});
