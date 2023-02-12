importScripts('./languages/sv.js', './languages/en.js', './exactmatch.js');



function beenhere(request, sender) {
    const cks = { "url": request.url, "name": "rcp" };
    console.log('checking cookie ' + cks)
    chrome.cookies.get(cks, function (cookie) {
        console.info('Got \'' + cookie + '\' as cookie response')
        if (cookie) {
            console.info('sending true')
            const msg = { message: "beenhere", beenhere: true, 'target_xpath': '' };
            chrome.tabs.sendMessage(sender.tab.id, msg);
        } else {
            console.info('sending false')
            const target = known_sites.filter(x => x.site === request.host);
            var target_xpathloc = ''
            var target_csspath = ''
            var target_shadow = ''
            var total_acc = null
            var total_acc_remove = null
            var popup_array=null
            if (target.length > 0) {
                target_xpathloc = target[0].xpath;
                target_csspath = target[0].csspath;
                target_shadow = target[0].shadow;
            } else {
                total_acc = [total_acc_sv, total_acc_en].flat();
                total_acc_remove = [acc_remove_sv, acc_remove_en,[',','.','!',' ']].flat();
                popup_array = [popup_array_en, popup_array_sv].flat()
            }
            chrome.tabs.sendMessage(sender.tab.id, { 
                message: "beenhere",
                beenhere: false,
                'target_xpath': target_xpathloc,
                'target_csspath': target_csspath,
                'target_shadow': target_shadow,
                'total_acc': total_acc,
                'total_acc_remove': total_acc_remove,
                'popup_array': popup_array });
        }
    });
}

function countSuccessRate(api, extension_id, unresolved,fixed) {
    return new Promise((resolve, reject) => {
        fetch(`${api}/report/unresolved?extension_id=${extension_id}&status=1`, {
            method: 'GET'
        }).then(async (response) => {
            const resolved = await response.json();
            const total = resolved + unresolved;
            const success = unresolved ? Math.round(resolved * 100 * 100 / total) / 100 : 100;
            resolve({
                unresolved: unresolved,
                resolved: resolved,
                reported: unresolved,
                success: `${success}%`,
                fixed: fixed
            });
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

function countUnresolved(api, extension_id) {
    return new Promise((resolve, reject) => {
        fetch(`${api}/report/unresolved?extension_id=${extension_id}&status=0`, {
            method: 'GET'
        }).then((response) => {
            resolve(response.json());
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

function countFixed(api, version) {
    return new Promise((resolve, reject) => {
        fetch(`${api}/report/v2/fixed?version=${version}`, {
            method: 'GET'
        }).then((response) => {
            resolve(response.json());
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

function getData(api) {
    return new Promise((resolve, reject) => {
        fetch(`${api}/report`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            resolve(response.json());
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

function postData(api, data) {
    return new Promise((resolve, reject) => {
        fetch(`${api}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status == 200) {
                resolve(true);
            } else {
                reject(response.status);
            }
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

function setcookie(api, request, sender) {
    const cks = { "url": request.url, "name": "rcp" };
    console.log('RCP: setting cookie ' + cks)
    chrome.cookies.set(cks)
    var u = request.url ? request.url : ''
    var uv = u.split('?')
    if(uv.length > 1) {
        u = uv[0];
    }
    postData(api, {
        url: u,
        issue: 'noissue',
        summary: 'alliswell',

        status: 1,
        extension_id: sender.id
    }).then((result) => {
        console.log('RCP: result : ', result);
        sendResponse({
            message: result
        });
    }).catch((error) => {
        console.log(error);
        sendResponse({
            error: error
        });
    });
}

//const api = 'http://localhost:8080'; // local develop
const api = 'https://rcpopup.com'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url + ", id " + sender.tab.id :
        "from the extension");
    console.log('RCP: got function command ' + request.function)
    const version = chrome.runtime.getManifest().version;

    if (request.function == 'postData') {
        postData(api, {
            ...request.data,
            status: 0,
            reportversion: version,
            extension_id: sender.id
        }).then((result) => {
            console.log('result : ', result);
            sendResponse({
                message: result
            });
        }).catch((error) => {
            console.log(error);
            sendResponse({
                error: error
            });
        });
        return true;
    } else if (request.function == 'getData') {
        console.info('RCP: before triggering getData')
        getData(api).then((result) => {
            console.log('result : ', result);
            sendResponse({
                message: result
            });
        }).catch((error) => {
            console.log(error);
            sendResponse({
                error: error
            });
        });
        return true;
    } else if (request.function == 'countUnresolved') {
        console.info('RCP: before triggering countUnresolved')
        countUnresolved(api, sender.id).then((unresolved) => {
            countFixed(api,version).then((fixed) => {
                countSuccessRate(api, sender.id, unresolved,fixed).then((result) => {
                    console.log('result : ', result);
                    sendResponse(result);
                }).catch((error) => {
                    console.log(error);
                    sendResponse({
                        unresolved: unresolved
                    });
                });
            });
        }).catch((error) => {
            console.log(error);
            sendResponse({
                unresolved: '-'
            });
        });
        return true;
    } else if (request.function == 'beenhere') {
        console.info('RCP: before triggering beenhere')
        beenhere(request, sender);
        chrome.alarms.create("beenhere", { "when": Date.now() + 400 });
        chrome.alarms.create("beenhere", { "when": Date.now() + 1000 });
        chrome.alarms.create("beenhere", { "when": Date.now() + 2000 });
        chrome.alarms.create("beenhere", { "when": Date.now() + 3000 });
        chrome.alarms.create("beenhere", { "when": Date.now() + 4000 });

        chrome.alarms.onAlarm.addListener(function (alarm) {
            beenhere(request, sender);
        });
        return true;
    } else if (request.function == 'setcookie') {
        console.info('RCP: before triggering setcookie')
        setcookie(api, request, sender);
        return true;
    }
});


chrome.runtime.onInstalled.addListener(() => {
    const version = chrome.runtime.getManifest().version
    const extension_id = chrome.runtime.id
    fetch(`${api}/report/upgrade?extension_id=${extension_id}&version=${version}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (response.status == 200) {
            resolve(true);
        } else {
            reject(response.status);
        }
    }).catch((error) => {
        reject('Error : ', error);
    });
});
