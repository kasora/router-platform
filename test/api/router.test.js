'use strict'

const assert = require('assert');
const md5 = require('md5');
const randomstring = require('randomstring');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const config = require('../../config');

describe('check user part.', () => {
    let userInfo = {
        email: 'justtest@kasora.moe',
    }

    it('check service.', function () {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `http://localhost:${config.port}/checkService`, true);
            xhr.send();

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve();
                }
            }
        });
    });

    it('user sign up', function () {
        return new Promise((resolve, reject) => {
            userInfo.password = randomstring.generate();
            userInfo.passwordMD5 = md5(userInfo.password);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", `http://localhost:${config.port}/api/user`, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`email=${userInfo.email}&password=${userInfo.passwordMD5}`);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 201) {
                    let resUserInfo = JSON.parse(xhr.responseText);
                    try {
                        assert(resUserInfo.name !== undefined);
                        assert(resUserInfo.email === userInfo.email);
                        assert(resUserInfo._id !== undefined);
                        assert(resUserInfo.token !== undefined);
                        assert(resUserInfo.tokenDispose !== undefined);
                        userInfo.token = resUserInfo.token;
                        userInfo.dispose = resUserInfo.tokenDispose;
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                }

                if (xhr.readyState == 4 && xhr.status == 400) {
                    reject("Email is exist.")
                }

                if (xhr.readyState == 4 && xhr.status == 500) {
                    reject("database error.")
                }
            }
        });
    });

    it('user login.', function () {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", `http://localhost:${config.port}/api/login`, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`email=${userInfo.email}&password=${userInfo.passwordMD5}`);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let resUserInfo = JSON.parse(xhr.responseText);
                    try {
                        assert(resUserInfo.name === userInfo.name);
                        assert(resUserInfo.email === userInfo.email);
                        assert(resUserInfo._id === userInfo._id);
                        assert(resUserInfo.token !== undefined);
                        assert(resUserInfo.tokenDispose !== undefined);
                        userInfo.token = resUserInfo.token;
                        userInfo.dispose = resUserInfo.tokenDispose;
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                }
            }
        });
    })
});