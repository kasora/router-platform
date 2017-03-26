'use strict'

const assert = require('assert');
const md5 = require('md5');
const randomstring = require('randomstring');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const config = require('../../config');
const mongoway = require('../../dataoption/mongoway');

let guestInfo = {
    email: 'justtest@kasora.moe',
    name: "guestkasora",
    password: "guestpassword",
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
guestInfo.passwordMD5 = md5(guestInfo.password);
let fakeadmin = JSON.parse(JSON.stringify(guestInfo));
fakeadmin.purview = "admin";
fakeadmin.email = "fake@kasora.moe";



function signup(userInfo) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let params = `email=${userInfo.email}&password=${userInfo.passwordMD5}`;
        if (userInfo.name !== undefined) {
            params += `&name=${userInfo.name}`;
        }
        xhr.open("POST", `http://localhost:${config.port}/api/user`, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 201) {
                let resUserInfo = JSON.parse(xhr.responseText);
                try {
                    assert(resUserInfo.name !== undefined);
                    assert(resUserInfo.email === userInfo.email);
                    assert(resUserInfo._id !== undefined);
                    assert(resUserInfo.token !== undefined);
                    assert(resUserInfo.tokenDispose !== undefined);
                    assert(resUserInfo.purview !== undefined);
                    if (userInfo.name !== undefined) {
                        assert(resUserInfo.name === userInfo.name);
                    }
                    userInfo._id = resUserInfo._id;
                    userInfo.purview = resUserInfo.purview;
                    userInfo.token = resUserInfo.token;
                    userInfo.dispose = resUserInfo.tokenDispose;
                    resolve(resUserInfo);
                }
                catch (err) {
                    reject("sign up error.");
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
        let url = `http://localhost:${config.port}/api/login`;
        let params = `email=${userInfo.email}&password=${userInfo.passwordMD5}`;
        xhr.open("GET", url + "?" + params, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 201) {
                let resUserInfo = JSON.parse(xhr.responseText);
                try {
                    assert(resUserInfo.name !== undefined);
                    assert(resUserInfo.email === userInfo.email);
                    assert(resUserInfo._id !== undefined);
                    assert(resUserInfo.token !== undefined);
                    assert(resUserInfo.tokenDispose !== undefined);
                    assert(resUserInfo.purview !== undefined);
                    if (userInfo.name !== undefined) {
                        assert(resUserInfo.name === userInfo.name);
                    }
                    userInfo._id = resUserInfo._id;
                    userInfo.purview = resUserInfo.purview;
                    userInfo.token = resUserInfo.token;
                    userInfo.dispose = resUserInfo.tokenDispose;
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
function remove(permission, userInfo) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = `http://localhost:${config.port}/api/user`;
        let params = `email=${userInfo.email}&token=${permission.token}`;
        xhr.open("DELETE", url + "?" + params, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 204) {
                try {
                    assert(xhr.responseText === "");
                    resolve();
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
function getUser(userInfo) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = `http://localhost:${config.port}/api/user`;
        let params = `email=${userInfo.email}`;
        xhr.open("GET", url + "?" + params, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let resUserInfo = JSON.parse(xhr.responseText);
                try {
                    assert(resUserInfo.name !== undefined);
                    assert(resUserInfo.email === userInfo.email);
                    assert(resUserInfo._id !== undefined);
                    assert(resUserInfo.purview !== undefined);
                    if (userInfo.name !== undefined) {
                        assert(resUserInfo.name === userInfo.name);
                    }
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
function userUpdate(permission, newUserInfo) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = `http://localhost:${config.port}/api/user`;
        let params = `token=${permission.token}&email=${newUserInfo.email}&name=${newUserInfo.name}&password=${newUserInfo.passwordMD5}`;
        xhr.open("PUT", url + "?" + params, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 201) {
                let resUserInfo = JSON.parse(xhr.responseText);
                try {
                    assert(resUserInfo.name !== undefined);
                    assert(resUserInfo.email === newUserInfo.email);
                    assert(resUserInfo._id !== undefined);
                    assert(resUserInfo.purview === newUserInfo.purview);
                    if (newUserInfo.name !== undefined) {
                        assert(resUserInfo.name === newUserInfo.name);
                    }
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

function addLink(userInfo, link) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = `http://localhost:${config.port}/api/link`;
        let params = `token=${userInfo.token}&link=${link}`;
        xhr.open("POST", url + "?" + params, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 201) {
                try {
                    let linkInfo = JSON.parse(xhr.responseText);
                    assert(linkInfo.uid !== undefined);
                    assert(linkInfo.linkid !== undefined);
                    assert(linkInfo.count !== undefined);
                    resolve(linkInfo);
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
function getLink(userInfo, page, per_page) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = `http://localhost:${config.port}/api/link`;
        let params = `token=${userInfo.token}`;
        if (page) params += `&page=${page}`;
        if (per_page) params += `&per_page=${per_page}`;
        xhr.open("GET", url + "?" + params, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                try {
                    let linkInfo = JSON.parse(xhr.responseText);
                    resolve(linkInfo);
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
function removeLink(userInfo, linkid) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = `http://localhost:${config.port}/api/link`;
        let params = `token=${userInfo.token}&linkid=${linkid}`;
        xhr.open("DELETE", url + "?" + params, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 204) {
                assert(xhr.responseText === "");
                resolve();
            }
            else if (xhr.readyState == 4) {
                reject(JSON.parse(xhr.responseText).err);
            }
        }
    });
}

describe('check user part.', () => {

    before(function () {
        return login(adminInfo)
            .then(() => { }, () => { return signup(adminInfo); })
            .then(() => { return mongoway.setAdmin(adminInfo.email); })
            .then(() => { return remove(adminInfo, guestInfo); })
            .then(() => { return remove(adminInfo, wrongInfo); })
            .then(() => { return remove(adminInfo, fakeadmin); })
            .then(() => { return remove(adminInfo, adminInfo); });
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

    it('user sign up.', function () {
        return signup(guestInfo);
    });

    it('user sign up on the same email.', function () {
        return signup(adminInfo).then(() => {
            return new Promise((resolve, reject) => {
                return signup(adminInfo).then(
                    () => { reject() },
                    () => { resolve() }
                );
            });
        });
    });

    it('user login.', function () {
        return login(guestInfo);
    });

    it('admin login.', function () {
        return login(adminInfo);
    });

    it('find user.', function () {
        return getUser(guestInfo);
    });

    it('purview up', function () {
        return mongoway.setAdmin(adminInfo.email).then((result) => {
            adminInfo.purview = "admin";
            return new Promise((resolve, reject) => {
                getUser(adminInfo).then((userResult) => {
                    if (userResult.purview === "admin") {
                        resolve();
                    }
                    else {
                        reject();
                    }
                }, (err) => { reject(err) });
            });
        });
    });

    it('wrong login.', function () {
        return new Promise((resolve, reject) => {
            return login(wrongInfo).then(
                () => { reject(); },
                () => { resolve(); }
            );
        });
    });

    it('user remove.', function () {
        return remove(adminInfo, guestInfo).then(() => {
            return new Promise((resolve, reject) => {
                getUser(guestInfo).then((result) => {
                    reject();
                }, (err) => {
                    resolve();
                });
            }).then(() => { return signup(guestInfo); });
        });
    });

    it('fake admin sign up.', function () {
        return signup(fakeadmin).then((result) => {
            assert(result.purview === "user");
        });
    });

    it('fake admin login.', function () {
        return login(fakeadmin);
    });

    it('fake admin test remove.', function () {
        return new Promise((resolve, reject) => {
            return remove(fakeadmin, guestInfo).then(
                () => { reject(); },
                () => { resolve(); }
            )
        })
    });

    it('user update by themselves.', function () {
        guestInfo.name = "updateguest";
        guestInfo.password = randomstring.generate();
        guestInfo.passwordMD5 = md5(guestInfo.password);
        return userUpdate(guestInfo, guestInfo).then(() => {
            return login(guestInfo).then((result) => {
                assert(result.name === guestInfo.name);
            }, (err) => {
                throw "login error."
            });
        });
    });

    it('user update by admin.', function () {
        guestInfo.name = "updateguest";
        guestInfo.password = randomstring.generate();
        guestInfo.passwordMD5 = md5(guestInfo.password);
        return userUpdate(adminInfo, guestInfo).then(() => {
            return login(guestInfo).then((result) => {
                assert(result.name === guestInfo.name);
            }, (err) => {
                throw "login error."
            });
        });
    });

    it('fake admin test update.', function () {
        return new Promise((resolve, reject) => {
            userUpdate(fakeadmin, guestInfo).then(
                () => { reject() },
                () => { resolve() }
            );
        });
    });
});

describe('check link part.', () => {

    it('insert link.', function () {
        let newLink = "https://testlink.com";
        return addLink(guestInfo, newLink).then((linkInfo) => {
            assert(linkInfo.link === newLink);
        });
    });

    it('fix link.', function () {
        let newLink = "testnewlink.com";
        return addLink(guestInfo, newLink).then((linkInfo) => {
            assert(linkInfo.link === "http://" + newLink);
        });
    });

    it('remove links.', async function () {
        let links = await getLink(guestInfo);
        for (let element of links) {
            await removeLink(guestInfo, element._id);
        };
        links = await getLink(guestInfo);
        assert(links.length === 0);
    });
});