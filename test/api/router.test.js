'use strict'

const assert = require('assert');
const md5 = require('md5');
const randomstring = require('randomstring');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const config = require('../../config');
const mongoway = require('../../dataoption/mongoway');

describe('check user part.', () => {
    let guestInfo = {
        email: 'justtest@kasora.moe',
        name: "unknown",
    }
    let wrongInfo = {
        email: 'wrong@kasora.moe',
        password: "wrong",
        passwordMD5: md5("wrong"),
    }
    let adminInfo = {
        email: config.adminEamil,
        password: config.adminPassword,
        passwordMD5: md5(config.adminPassword),
    }

    function signup(userInfo) {
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
                        assert(resUserInfo.name === userInfo.name);
                        assert(resUserInfo.email === userInfo.email);
                        assert(resUserInfo._id !== undefined);
                        assert(resUserInfo.token !== undefined);
                        assert(resUserInfo.tokenDispose !== undefined);
                        assert(resUserInfo.purview !== undefined);
                        userInfo._id = resUserInfo._id;
                        userInfo.purview = resUserInfo.purview;
                        userInfo.token = resUserInfo.token;
                        userInfo.dispose = resUserInfo.tokenDispose;
                        resolve(resUserInfo);
                    }
                    catch (err) {
                        reject("login fault.");
                    }
                }
                else if (xhr.readyState == 4) {
                    reject(JSON.parse(xhr.responseText).err);
                }
            }
        });
    }

    function login(userInfo) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", `http://localhost:${config.port}/api/login`, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(`email=${userInfo.email}&password=${userInfo.passwordMD5}`);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 201) {
                    let resUserInfo = JSON.parse(xhr.responseText);
                    try {
                        assert(resUserInfo.email === userInfo.email);
                        assert(resUserInfo._id === userInfo._id);
                        assert(resUserInfo.token !== undefined);
                        assert(resUserInfo.tokenDispose !== undefined);
                        resolve(resUserInfo);
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                else if (xhr.readyState == 4) {
                    reject(JSON.parse(xhr.responseText).err);
                }
            }
        });
    }

    it('preview up', function () {

    });

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
        return signup(guestInfo);
    });

    it('user login.', function () {
        return login(guestInfo);
    });

    it('wrong login.', function () {
        return new Promise((resolve, reject) => {
            return login(wrongInfo).then(
                () => { reject(); },
                () => { resolve(); }
            );
        });
    });

    it('fake admin sign up.', function () {
        let fakeadmin = JSON.parse(JSON.stringify(guestInfo));
        fakeadmin.purview = "admin";
        fakeadmin.email = "fake@kasora.moe";

        return signup(fakeadmin).then(()=>{
            return login(fakeadmin).then((userInfo)=>{
                assert(userInfo.purview==="user");
            });
        });
    });

    it('user remove.', function () {

    });
});