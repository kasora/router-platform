'use strict';

const assert = require('assert');

const { shallow, mount } = require('enzyme');
const Title = require('../src/components/Title');

describe('check Title bar.', () => {
  it('check click username.', () => {
    let title = mount(<Title userinfo={{ name: "kasora" }} />);
    let optionList = title.find("li").at(0);
    optionList.simulate("click");
    assert(optionList.hasClass("open"));
  });
})
