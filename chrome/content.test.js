var chrome = require('jest-chrome')
const fs = require('fs');
const find_popup = require("./content.js").find_popup;
const construct_contains = require("./content.js").construct_contains;
const click_away_popup = require("./content.js").click_away_popup;
const testdata = require('./data/testdata.json').pages;

const popup_array_sv = require('./languages/sv.js').popup_array_sv;
const total_acc_sv = require('./languages/sv.js').total_acc_sv;

const popup_array_en = require('./languages/en.js').popup_array_en;
const total_acc_en = require('./languages/en.js').total_acc_en;

jest.dontMock('fs');



test('smoke test inner', () => {
    debugger;
    [popup_or_text, popup_or_span] = construct_contains([popup_array_en, popup_array_sv].flat());
    const total_a = [total_acc_sv,total_acc_en].flat();
    for (dt of testdata) {
        if (dt.html === '') {
            continue;
        }
        console.info('testing ' + dt.html)
        const html = fs.readFileSync("./data/" + dt.html + ".html", 'utf8');
        document.body.innerHTML = html;
        const p = find_popup(popup_or_text, popup_or_span, true);
        if (dt.popup !== '') {
            var p_tmp = p;
            while (p_tmp && p_tmp.className === '') {
                p_tmp = p_tmp.parentNode;
            }

            expect(dt.html + p_tmp.className).toBe(dt.html + dt.popup);
        } else {
            expect(dt.html + p.id).toBe(dt.html + dt.popupid);
        }

        [bo, btn] = click_away_popup(p, total_a, true);
        if (dt.button !== '') {
            var btn_tmp = btn;
            while (btn_tmp && btn_tmp.className === '') {
                btn_tmp = btn_tmp.parentNode;
            }
            expect(dt.html + btn_tmp.className).toBe(dt.html + dt.button);
        } else {
            expect(dt.html + btn.id).toBe(dt.html + dt.buttonid);
        }
    }
});