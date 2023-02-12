

var min_len = 8;
var popup_or_text = null;
var popup_or_span = null;
var total_acc = null;

function getUniqueSelector(elSrc) {
    if (!(elSrc instanceof Element)) return;
    var sSel,
        aAttr = ['name', 'value', 'title', 'placeholder', 'data-*'], // Common attributes
        aSel = [],
        // Derive selector from element
        getSelector = function (el) {
            // 1. Check ID first
            // NOTE: ID must be unique amongst all IDs in an HTML5 document.
            // https://www.w3.org/TR/html5/dom.html#the-id-attribute
            if (el.id) {
                aSel.unshift('#' + el.id);
                return true;
            }
            aSel.unshift(sSel = el.nodeName.toLowerCase());
            // 2. Try to select by classes
            if (el.className) {
                aSel[0] = sSel += '.' + el.className.trim().replace(/ +/g, '.');
                if (uniqueQuery()) return true;
            }
            // 3. Try to select by classes + attributes
            for (var i = 0; i < aAttr.length; ++i) {
                if (aAttr[i] === 'data-*') {
                    // Build array of data attributes
                    var aDataAttr = [].filter.call(el.attributes, function (attr) {
                        return attr.name.indexOf('data-') === 0;
                    });
                    for (var j = 0; j < aDataAttr.length; ++j) {
                        aSel[0] = sSel += '[' + aDataAttr[j].name + '="' + aDataAttr[j].value + '"]';
                        if (uniqueQuery()) return true;
                    }
                } else if (el[aAttr[i]]) {
                    aSel[0] = sSel += '[' + aAttr[i] + '="' + el[aAttr[i]] + '"]';
                    if (uniqueQuery()) return true;
                }
            }
            // 4. Try to select by nth-of-type() as a fallback for generic elements
            var elChild = el,
                sChild,
                n = 1;
            while (elChild = elChild.previousElementSibling) {
                if (elChild.nodeName === el.nodeName) ++n;
            }
            aSel[0] = sSel += ':nth-of-type(' + n + ')';
            if (uniqueQuery()) return true;
            // 5. Try to select by nth-child() as a last resort
            elChild = el;
            n = 1;
            while (elChild = elChild.previousElementSibling) ++n;
            aSel[0] = sSel = sSel.replace(/:nth-of-type\(\d+\)/, n > 1 ? ':nth-child(' + n + ')' : ':first-child');
            if (uniqueQuery()) return true;
            return false;
        },
        // Test query to see if it returns one element
        uniqueQuery = function () {
            return document.querySelectorAll(aSel.join('>') || null).length === 1;
        };
    // Walk up the DOM tree to compile a unique selector
    while (elSrc.parentNode) {
        if (getSelector(elSrc)) return aSel.join(' > ');
        elSrc = elSrc.parentNode;
    }
}

var target_csspath = '';
var target_xpath = '';
var target_shadow = '';

function click_known_site_css() {
    const p = document.querySelector(target_csspath)
    if (p && isVisible(p, false)) {
        console.info('RCP: found button ' + p.textContent + ', clicking and ending button monitoring')
        p.click()
    }
}


function addDelayedKill(element) {
    target_csspath = getUniqueSelector(element);
    for (i in [1000, 2000, 3000]) {
        setTimeout(click_known_site_css, i);
    }
}

function removeEmojis (string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  
    return string.replace(regex, '');
  }
function rcp_trim(ds, total_acc_l) {
    d = ds.iterateNext()
    while (d != null) {
        var txt = null
        if (d.tagName === "INPUT") {
            txt = d.value;
        } else {
            txt = d.innerText;
        }
        if (txt.substring(0, 2) === 'I ') {
            txt = txt.substr(2, txt.length)
        }
        txt = removeEmojis(txt)
        txt = txt.toLowerCase();
        for (s of total_acc_remove) {
            txt = txt.replaceAll(s, ' ')
        }
        txt = txt.replaceAll(' ', '')

        const post_filter = total_acc_l.filter(t => t === txt)
        if (post_filter.length > 0) {
            break;
        } else {
            d = ds.iterateNext()
        }
    }
    return d;
}

function click_away_popup(element, total_acc_l, test) {
    for (const di of total_acc_l) {
        ds = document.evaluate(".//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'" + di + "')]", element, null, XPathResult.ANY_TYPE, null);
        d = rcp_trim(ds, total_acc_l)
        if (d == null) {
            ds = document.evaluate(".//input[contains(translate(@value, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'" + di + "')]", element, null, XPathResult.ANY_TYPE, null);
            d = rcp_trim(ds, total_acc_l)
        }
        if (d == null) {
            ds = document.evaluate(".//span[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'" + di + "')]", element, null, XPathResult.ANY_TYPE, null);
            d = rcp_trim(ds, total_acc_l)
        }
        if (d !== null && isElementInViewport(d)) {
            console.info('RCP: Found ' + d.nodeName + ' with inner text ' + d.innerText + ' to click on')
            if (d.parentNode.nodeName === 'BUTTON') {
                d = d.parentNode
            }
            if (!test) {
                addDelayedKill(d)
                d.click();
            }
            return [true, d];
        } else if (d && d != null) {
            console.info('RCP: Found ' + d.nodeName + ' with inner text ' + d.innerText + ' not visible, skipping click')
        }
    }

    const b = element.getElementsByTagName('button');


    if (b.length > 0) {
        console.info('RCP: Found ' + b.length + ' buttons to investigate')
        for (const bi of b) {
            var text = null;
            if (bi && bi.childNodes && bi.childNodes.length > 0 && bi.childNodes[0].nodeName === 'SPAN') {
                text = bi.childNodes[0].textContent.toLowerCase().trim();
            } else {
                text = bi.textContent.toLowerCase().trim();
            }
            text = text.replace(/\s\s+/g, ' ');
            for (s of total_acc_remove) {
                text = text.replaceAll(s, '')
            }
            const post_filter = total_acc_l.filter(t => t === text)
            console.info('RCP: Found button \'' + text + '\'')
            if (post_filter.length > 0) {
                console.info('RCP: Found inner text ' + text + ' to click on, postfilter:' + post_filter)
                if (!test) {
                    addDelayedKill(bi)
                    bi.click()
                    finish_rcp()
                }
                return [true, bi];
            } else {
                console.info('RCP: Found inner text ' + text + ' thats not interesting')
            }
        }
    }

    if (element.parentNode && element.parentNode.nodeName !== 'BODY') { // have to go higher up in the ladder
        return click_away_popup(element.parentNode, total_acc_l, test)
    }
    return [false, null];
}


function finish_rcp() {
    console.info('RCP: setting rcp cookie for ' + document.URL);
    chrome.runtime.sendMessage({ function: "setcookie", 'url': document.URL });
}

function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    if (rect.top > -1 && rect.bottom <= window.innerHeight) {
        return true;
    } else {
        return false;
    }
}

function isVisible(elem, headless) {
    if (headless)
        return isElementInViewport(elem);
    if (!(elem instanceof Element)) throw Error('RCP: elem is not an element.');
    const style = getComputedStyle(elem);
    if (style.display === 'none')
        return false;
    if (style.visibility !== 'visible')
        return false;
    if (style.opacity !== '' && style.opacity < 0.1)
        return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    const elemCenter = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0)
        return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth))
        return false;
    if (elemCenter.y < 0)
        return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight))
        return false;
    return true;
}


function evaluate_popup(ps, headless) {
    var i = 0;
    var b = false;
    while (!b && i < ps.snapshotLength) {
        p = ps.snapshotItem(i);
        if (p.nodeName !== 'SCRIPT' && p.nodeName !== 'STYLE' && isVisible(p, headless)) {
            var t = null;
            if (p.nodeName === 'B' || p.nodeName === 'STRONG' || p.nodeName === 'A') {
                t = p.parentNode.textContent
            } else {
                t = p.textContent
            }
            const len = t.split(" ").length;
            if (len >= min_len) {
                b = true;
                console.info('RCP: Found popup ' + p.textContent)
            }
        }
        if (!b) {
            i++;
            p = ps.snapshotItem(i);
        }
    }

    if (b) {
        return p;
    } else {
        return null;
    }
}

function find_popup(t, s, headless) {
    var p = null;
    ps = document.evaluate("//*[" + t + "]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    p = evaluate_popup(ps, headless);
    if (!p || p.snapshotLength <= 0) {
        ps = document.evaluate("//span[" + s + "]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        p = evaluate_popup(ps, headless);
    }
    return p;
}

function find_remove_popup() {
    console.info('RCP: investigating if we can find a popup on ' + document.URL)
    const p = find_popup(popup_or_text, popup_or_span, false);
    if (p) {
        [bo, d] = click_away_popup(p, total_acc, false)
        if (bo) {
            finish_rcp()
            return true;
        }
    } else {
        console.info('RCP: no popup found')
    }
    return false;
}

function construct_contains(popup_array) {
    popup_or_text = popup_array.map((x, index) => {
        const base = "contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + x + "')";
        if (index == 0) {
            return base;
        } else {
            return ' or ' + base;
        }
    }).join('');

    popup_or_span = popup_array.map((x, index) => {
        const base = "contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + x + "')";
        if (index == 0) {
            return base;
        } else {
            return ' or ' + base;
        }
    }).join('');
    return [popup_or_text, popup_or_span];
}

function start_monitor(popup_array, len) {
    [popup_or_text, popup_or_span] = construct_contains(popup_array);
    find_remove_popup()
}

function click_known_site(i) {
    console.info('RCP: click known site, delay ' + i)
    var p = null;
    if (target_csspath && target_csspath != '') {
        var elem = document.body;
        if (target_shadow && target_shadow != '') {
            p = document.querySelector(target_shadow).shadowRoot.querySelector(target_csspath)
            if (p != null) {
                console.info('RCP: found shadow')
            }
        } else {
            p = elem.querySelector(target_csspath);
            if (p != null) {
                console.info('RCP: found css')
            }
        }
        if (p != null) {
            console.info('RCP: found css to push')
        }
    } else {
        ps = document.evaluate(target_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        if (ps.snapshotLength > 0) {
            p = ps.snapshotItem(0)
        }
    }
    if (p) {
        console.info('RCP: found button ' + p.textContent + ', clicking and ending button monitoring')
        p.click()
        finish_rcp()
        return true
    }
    return false
}

chrome.runtime.sendMessage({ function: "beenhere", url: document.URL, host: window.location.host });

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message && request.message == "beenhere") {
            if (request.beenhere) {
                console.info('RCP: has already closed popups on ' + document.URL + ', exiting.')
            } else if ((request.target_xpath && request.target_xpath != '') || (request.target_csspath && request.target_csspath != '')) {
                target_xpath = request.target_xpath;
                target_csspath = request.target_csspath;
                target_shadow = request.target_shadow;
                console.info('RCP: found known site ' + window.location.host + ' waiting to smash button')
                click_known_site()
            } else if (document.documentElement.lang.substr(0, 2).toLocaleLowerCase() === 'sv'
                || document.documentElement.lang.substr(0, 2).toLocaleLowerCase() === 'se'
                || document.documentElement.lang.substr(0, 2).toLocaleLowerCase() === 'en'
                || document.documentElement.lang === '') {
                min_len = 7;
                total_acc = request.total_acc
                total_acc_remove = request.total_acc_remove
                console.info('RCP: starting monitoring ' + document.URL)
                start_monitor(request.popup_array);
            } else {
                console.info('RCP: found site with non-supported language ' + document.documentElement.lang)
            }
        }
    }
);
/* enable when doing unit tests in jest (not implemented in chrome extention unfortonatly)
module.exports = {
    find_popup: find_popup,
    construct_contains: construct_contains,
    click_away_popup: click_away_popup
};
*/