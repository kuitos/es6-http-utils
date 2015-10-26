/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-26
 */

jest.dontMock('../Node.js');

let Node = require('../Node.js');

describe('Node', () => {

  it('Node test', () => {

    let node = new Node(1);

    expect(node.element).toEqual(1);

  });

});
