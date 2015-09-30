/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-09-01
 */
import unused from 'whatwg-fetch';
import FetchJsonAPI from '../src/request/fetch-json-api.js';

const fetch = window.fetch;

fetch('/server.js').then(response => {
  return response.text();
}).then(data => {
  console.log(data);
});

FetchJsonAPI.post('/posts', {id: 111}).then(data => {
  console.log(data);
}).then(() => {
  FetchJsonAPI.get('/posts').then(data => {
    console.log(data);
  })
});

FetchJsonAPI.delete('/posts/1', {userName:'k'}).then(data => {
  console.log(data);
});
