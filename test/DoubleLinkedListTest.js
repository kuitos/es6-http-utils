/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-21
 */

import DLList from '../src/data-structure/linked-list/DoubleLinkedList.js';
import HDList from '../src/data-structure/linked-list/HashDoubleLinkedList.js';

//let dlList = new DLList();
let dlList = new HDList();
dlList.insertHead('head');
dlList.insertAfter('head', 1);
dlList.insertBefore(1, 4);
dlList.insertEnd(3);
dlList.insertEnd('end');
dlList.insertAfter('end', 9);
dlList.insertBefore('head', 10);

dlList.display();
