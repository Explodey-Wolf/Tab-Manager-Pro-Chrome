chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
const dmot = "default_max_open_tabs"
const cmot = "current_max_open_tabs"

async function close() {
    let current_tab = await chrome.tabs.query({active: true, currentWindow: true});
    current_tab = current_tab[0]

    let current_tab_id = current_tab.id;
    let opener_tab_id = current_tab.openerTabId;
    
    chrome.tabs.update(opener_tab_id, {active: true});
    chrome.tabs.remove(current_tab_id);
    await chrome.storage.session.set({
        current_open_tab_id: -1
    });

}

async function snooze() {
    let snooze_amount = document.querySelector("#snooze_spin");
    let current = await chrome.storage.session.get(cmot);
    current = current[cmot];
    if (current == undefined) {
        current = await chrome.storage.local.get(dmot);
        current = current[dmot];
        if (current == undefined) {
            current = 20;
        }
    }
    snooze_amount = snooze_amount.valueAsNumber;
    chrome.storage.session.set({[cmot]: current + snooze_amount});
    close();

}

async function deal() {
    /*let tab_create_properties = {
        url: "/Tabs/deal_with_it.html",
        openerTabId: (await chrome.tabs.query({currentWindow: true, active: true})).openerTabId
    };

    let new_tab_id = (await chrome.tabs.create(tab_create_properties)).id;
    await chrome.storage.session.set({
        current_open_tab_id: new_tab_id
    });*/
    window.location.href = "/Tabs/deal_with_it.html"
}

document.querySelector("#snooze_btn").addEventListener("click", snooze);
document.querySelector("#tab_deal").addEventListener("click", deal);