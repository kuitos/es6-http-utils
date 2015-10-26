/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-26
 */

import DoubleLinkedList from '../DoubleLinkedList';
import HashDoubleLinkedList from '../HashDoubleLinkedList.js';

describe('DoubleLinkedList', () => {

  it('double linked list', () => {

    let dlList = new DoubleLinkedList();

    dlList.insertHead('head');
    dlList.insertAfter('head', 1);
    dlList.insertBefore(1, 0.1);
    dlList.insertEnd('end');
    dlList.remove('head');
    dlList.insertBefore(0, 1);

    expect(dlList.findHead().element).toEqual(1);
    expect(dlList.findEnd().element).toEqual('end');

  });

});

describe('HashDoubleLinkedList', () => {

  it('HashDoubleLinkedList', () => {
    let hdLL = new HashDoubleLinkedList();

    hdLL.insertHead(0);
    hdLL.insertBefore(-1, 0);
    hdLL.insertEnd(100);
    hdLL.insertAfter(100, 101);
    hdLL.insertBefore(100, 90);
    hdLL.remove(90);

    expect(hdLL.find(90)).toBeNull();

    hdLL.remove(101);

    expect(hdLL.findEnd().element).toEqual(100);

  });

});


