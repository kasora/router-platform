'use strict'

const assert = require('assert');
const md5 = require('md5');
const randomstring = require('randomstring');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const config = require('../../config');

describe('check user part', () => {
    let token = null;
    it('sign up user', function () {
        return new Promise((resolve, reject) => {
            let password = randomstring.generate();
            let passwordMD5 = md5(password);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", `http://localhost:${config.port}/api/user`, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`email=justtest@kasora.moe&password=${passwordMD5}`);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 201) {
                    let userInfo = JSON.parse(xhr.responseText);
                    try {
                        assert(userInfo.name !== undefined);
                        assert(userInfo.email === 'justtest@kasora.moe');
                        assert(userInfo._id !== undefined);
                        assert(userInfo.token !== undefined);
                        assert(userInfo.tokenDispose !== undefined);
                        token = userInfo.token;
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                }
            }
        });
    });
});