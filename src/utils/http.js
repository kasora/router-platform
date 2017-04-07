'use strict';

/**
* From https://github.com/ntzyz/new-blog/tree/master/src/utils, modified.
*/

function common(method, url, data, options) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        options = options || {};
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        if (data && typeof data === 'object') {
            let pairs = [];
            if (data instanceof FormData) {
                for (let pair of data.entries()) {
                    pairs.push(encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]));
                }
            }
            else {
                for (let key in data) {
                    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }
            }
            data = pairs.join('&');
        }

        if (options.before) {
            options.before(xhr);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.responseText === "") {
                    if (xhr.status === 204) {
                        resolve({});
                    }
                    else {
                        reject({ err: "network error" });
                    }
                }
                else {
                    let res = JSON.parse(xhr.responseText);
                    if (res.err === undefined) {
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                }
            }
        };
        xhr.send(data);
    });
}

let request = {};

request.get = function (url, options) {
    return common('GET', url, undefined, options);
}

request.post = function (url, data, options) {
    return common('POST', url, data, options);
}

request.put = function (url, data, options) {
    return common('PUT', url, data, options);
}

request.delete = function (url, options) {
    return common('DELETE', url, undefined, options);
}

request.head = function (url, options) {
    return common('HEAD', url, undefined, options);
}

module.exports = request;