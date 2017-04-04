'use strict'

const assert = require('assert');
const md5 = require('md5');
const randomstring = require('randomstring');
const config = require('../../config');
const mongoway = require('../../dataoption/mongoway');
const request = require('supertest');

let app = require('../../server');

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

let agent = request.agent(app);

function signup(userInfo) {
    let params = `email=${userInfo.email}&password=${userInfo.passwordMD5}`;
    if (userInfo.name) params += `&name=${userInfo.name}`;
    return agent
        .post('/api/user' + '?' + params)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(201);
}
function login(userInfo) {
    let params = `email=${userInfo.email}&password=${userInfo.passwordMD5}`;
    return agent
        .get('/api/login' + '?' + params)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(201);
}
function logout() {
    return agent
        .delete('/api/login')
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(204);
}
function remove(userInfo) {
    let params = `email=${userInfo.email}`;
    return agent
        .delete('/api/user' + '?' + params)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(204);
}
function getUser(userInfo) {
    let params = `email=${userInfo.email}`;
    return agent
        .get('/api/user' + '?' + params)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(200);
}
function userUpdate(newUserInfo) {
    let params = `email=${newUserInfo.email}&name=${newUserInfo.name}&password=${newUserInfo.passwordMD5}`;
    return agent
        .put('/api/user' + '?' + params)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(201);
}

function addLink(link) {
    let params = `link=${link}`;
    return agent
        .post('/api/link' + '?' + params)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(201);
}
function getLink(page, per_page) {
    let params = "";
    if (page) params += `&page=${page}`;
    if (per_page) params += `&per_page=${per_page}`;
    return agent
        .get('/api/link' + '?' + params)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(200);
}
function removeLink(linkid) {
    let params = `linkid=${linkid}`;
    return agent
        .delete('/api/link' + '?' + params)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(204);
}
function updateLink(linkid, newlink) {
    let params = `linkid=${linkid}&newlink=${newlink}`;
    return agent
        .put('/api/link' + '?' + params)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .expect(201);
}

describe('check user part.', () => {

    before(async function () {
        try {
            await signup(adminInfo);
        }
        catch (err) {
            await login(adminInfo);
        }
        await mongoway.setAdmin(adminInfo.email);
        await remove(guestInfo);
        await remove(fakeadmin);
        await remove(adminInfo);
    });

    it('check service.', async function () {
        await request(app)
            .get('/checkService')
            .expect(200);
    });

    it('user sign up.', async function () {
        let info = await signup(guestInfo);
        assert(info.body.email === guestInfo.email);
        assert(info.body.name === guestInfo.name);

        await remove(guestInfo);
    });

    it('user sign up without name.', async function () {
        let temp = guestInfo.name;
        guestInfo.name = undefined;

        let info = await signup(guestInfo);
        assert(info.body.email === guestInfo.email);
        assert(info.body.name === "unknown");

        guestInfo.name = temp;
        await remove(guestInfo);
    });

    it('user sign up on the same email.', async function () {
        await signup(guestInfo);
        try {
            await signup(guestInfo)
            assert(false);
        }
        catch (err) {
        }

        await remove(guestInfo);
    });

    it('user login.', async function () {
        await signup(guestInfo);
        let info = await login(guestInfo);
        assert(info.body.email === guestInfo.email);
        assert(info.body.name === guestInfo.name);

        await remove(guestInfo);
    });

    it('user log out.', async function () {
        await signup(guestInfo);

        await logout();
        try {
            await remove(guestInfo);
            assert(false);
        }
        catch (err) {
        }

        await login(guestInfo);
        await remove(guestInfo);
    });

    it('find user.', async function () {
        await signup(guestInfo);
        await logout();
        let info = await getUser(guestInfo);
        assert(info.body.email === guestInfo.email);
        assert(info.body.name === guestInfo.name);

        await login(guestInfo);
        await remove(guestInfo);
    });

    it('get self info by token', async function () {
        await signup(guestInfo);
        
        let userinfo = await agent
            .get('/api/user')
            .set("Content-Type", "application/x-www-form-urlencoded")
            .expect(200);
        console.log(userinfo);
        console.log(guestInfo);

        await remove(guestInfo);
    });

    it('purview up', async function () {
        await signup(guestInfo);

        await signup(adminInfo);
        await mongoway.setAdmin(adminInfo.email);

        await remove(guestInfo);

        await remove(adminInfo);
    });

    it('wrong login.', async function () {
        await signup(guestInfo);
        try {
            await login(wrongInfo);
            assert(false);
        }
        catch (err) { }

        await remove(guestInfo);
    });

    it('fake admin test.', async function () {
        await signup(guestInfo);

        let params = `email=${fakeadmin.email}&password=${fakeadmin.passwordMD5}`;
        params += "&purview=admin";
        let info = await agent
            .post('/api/user' + '?' + params)
            .set("Content-Type", "application/x-www-form-urlencoded")
            .expect(201);
        assert(info.body.purview === "user");

        try {
            await remove(guestInfo);
            assert(false);
        }
        catch (err) { }

        await remove(fakeadmin);
        await login(guestInfo);
        await remove(guestInfo);
    });

    it('user update by themselves.', async function () {
        let tempInfo = JSON.parse(JSON.stringify(guestInfo));
        await signup(tempInfo);

        tempInfo.name = "updateguest";
        tempInfo.password = randomstring.generate();
        tempInfo.passwordMD5 = md5(guestInfo.password);

        await userUpdate(tempInfo);
        let info = await login(tempInfo);
        assert(info.body.name === tempInfo.name);

        await remove(tempInfo);
    });

    it('user update by admin.', async function () {
        let tempInfo = JSON.parse(JSON.stringify(guestInfo));
        await signup(tempInfo);

        tempInfo.name = "updateguest";
        tempInfo.password = randomstring.generate();
        tempInfo.passwordMD5 = md5(guestInfo.password);

        await signup(adminInfo);
        await mongoway.setAdmin(adminInfo.email);

        await userUpdate(tempInfo);
        let info = await login(tempInfo);
        assert(info.body.name === tempInfo.name);

        await remove(tempInfo);
        await login(adminInfo);
        await remove(adminInfo);
    });

    it('fake admin test update user.', async function () {
        let tempInfo = JSON.parse(JSON.stringify(guestInfo));
        await signup(tempInfo);

        tempInfo.name = "updateguest";
        tempInfo.password = randomstring.generate();
        tempInfo.passwordMD5 = md5(guestInfo.password);

        await signup(fakeadmin);

        try {
            await userUpdate(tempInfo);
            assert(false);
        }
        catch (err) { }

        let info = await login(guestInfo);
        assert(info.body.name === guestInfo.name);

        await remove(guestInfo);
        await login(fakeadmin);
        await remove(fakeadmin);
    });

    after(async function () {
        await signup(guestInfo);
        await signup(fakeadmin);
        await signup(adminInfo);
        await logout();
    });
});

describe('check link part.', () => {
    it('insert link.', async function () {
        let newLink = "https://testlink.com";
        await login(guestInfo);
        let linkInfo = (await addLink(newLink)).body;
        assert(linkInfo.link === newLink);
        assert(linkInfo.uid !== undefined);
        assert(linkInfo.count !== undefined);
        assert(linkInfo.uid != undefined);

        await removeLink(linkInfo.linkid);
    });

    it('fix link.', async function () {
        let newLink = "testnewlink.com";
        await login(guestInfo);
        let linkInfo = (await addLink(newLink)).body;
        assert(linkInfo.link === "http://" + newLink);

        await removeLink(linkInfo.linkid);
    });

    it('anonymous get info.', async function () {
        await logout();

        try {
            let links = (await getLink()).body;
            assert(false);
        }
        catch (err) { }
    });

    it('update links.', async function () {
        let oldLink = "http://oldLink.com";
        let newLink = "http://newlink.com";
        await login(guestInfo);
        let linkInfo = (await addLink(oldLink)).body;
        await updateLink(linkInfo.linkid, newLink);
        let links = (await getLink()).body;

        let flag = false;
        for (let element of links) {
            if (element.linkid === linkInfo.linkid) {
                assert(element.link === newLink);
                flag = true;
            }
        }
        assert(flag);

        await removeLink(linkInfo.linkid);
    });

    it('admin update links.', async function () {
        let oldLink = "http://oldLink.com";
        let newLink = "http://newlink.com";
        await login(guestInfo);
        let linkInfo = (await addLink(oldLink)).body;
        await login(adminInfo);
        await mongoway.setAdmin(adminInfo.email);
        await updateLink(linkInfo.linkid, newLink);
        await login(guestInfo);
        let links = (await getLink()).body;
        let flag = false;
        for (let element of links) {
            if (element.linkid === linkInfo.linkid) {
                assert(element.link === newLink);
                flag = true;
            }
        }
        assert(flag);

        await login(guestInfo);
        await removeLink(linkInfo.linkid);
        await mongoway.deAdmin(adminInfo.email);
    });

    it('fake admin update links.', async function () {
        let oldLink = "http://oldLink.com";
        let newLink = "http://newlink.com";
        await login(guestInfo);
        let linkInfo = (await addLink(oldLink)).body;

        await login(fakeadmin);
        try {
            await updateLink(linkInfo.linkid, newLink);
            assert(false);
        } catch (err) { }

        await login(guestInfo);
        let links = (await getLink()).body;
        let flag = false;
        for (let element of links) {
            if (element.linkid === linkInfo.linkid) {
                assert(element.link === oldLink);
                flag = true;
            }
        }
        assert(flag);

        await removeLink(linkInfo.linkid);
    });

    it('user remove link.', async function () {
        let newLink = "http://newlink.com";
        await login(guestInfo);
        let linkInfo = (await addLink(newLink)).body;
        await removeLink(linkInfo.linkid);
        let links = (await getLink(guestInfo)).body;

        for (let element of links) {
            assert(element.linkid !== linkInfo.linkid);
        }
    });

    it('admin remove link.', async function () {
        let newLink = "http://newlink.com";
        await login(guestInfo);
        let linkInfo = (await addLink(newLink)).body;

        await login(adminInfo);
        await mongoway.setAdmin(adminInfo.email);
        await removeLink(linkInfo.linkid);
        await login(guestInfo);
        let links = (await getLink()).body;

        for (let element of links) {
            assert(element.linkid !== linkInfo.linkid);
        }

        await mongoway.deAdmin(adminInfo.email);
    });

    it('fake admin remove link.', async function () {
        let newLink = "http://newlink.com";
        await login(guestInfo);
        let linkInfo = (await addLink(newLink)).body;
        await login(fakeadmin);
        try {
            await removeLink(linkInfo.linkid);
            assert(false);
        } catch (err) { }

        await login(guestInfo);
        let links = (await getLink()).body;
        let flag = false;
        for (let element of links) {
            if (element.linkid === linkInfo.linkid) {
                flag = true;
            }
        }
        assert(flag);

        await removeLink(linkInfo.linkid);
    });
});