/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-19
 */

import {FetchHttp} from '../src/index.js';
import unused from './interceptor.js';
import unused1 from './transformers.js';

FetchHttp.post('/posts', {id: 111}).then(data => {
  console.log(`post success.data`, data);
});

FetchHttp.get('/posts').then(data => {
  console.log('get /posts success!', data);
})

FetchHttp.delete('/posts/1', {userName: 'k'}).then(() => {
  console.log('delete success');
});
