'use strict'

const assert = require('assert');
const md5 = require('md5');
const randomstring = require('randomstring');

describe('check user part', () => {

    before(() => {
        return new Promise((resolve, reject) => {
            let password = randomstring.generate();
            let passwordMD5 = md5(password);
            xmlhttp.open("POST", "/api/user", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send(`email=justtest@kasora.moe&password=${passwordMD5}`);

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 201) {
                    let userInfo = JSON.parse(xmlhttp.responseText);
                    assert(userInfo.name !== undefined);
                    assert(userInfo.email === 'justtest@kasora.moe');
                    assert(userInfo._id !== undefined);
                    assert(userInfo.token !== undefined);
                    assert(userInfo.tokenDispose !== undefined);
                }
            }
        });
    });

});