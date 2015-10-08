/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-09-01
 */
import unused from 'whatwg-fetch';
import {FetchRequest} from '../src/index.js';

const fetch = window.fetch;

fetch('/server.js').then(response => {
  return response.text();
}).then(data => {
  console.log(data);
});

FetchRequest.post('/posts', {id: 111}).then(data => {
  console.log(data);
}).then(() => {
  FetchRequest.get('/posts').then(data => {
    console.log(data);
  })
});

FetchRequest.delete('/posts/1', {userName: 'k'}).then(data => {
  console.log(data);
});

let xhr = new XMLHttpRequest();
xhr.open('GET', '/posts');
xhr.setRequestHeader('X-Powered-By', 'Kuitos');
xhr.send();
