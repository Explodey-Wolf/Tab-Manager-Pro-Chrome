chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
console.log("OOOOO")
const default_limit = 20
const dmot = "default_max_open_tabs"
const cmot = "current_max_open_tabs"
let is_open = false
chrome.storage.local.set({[dmot]: default_limit})
function old_main() {
chrome.tabs.onCreated.addListener(function() {
    
    let limit = default_limit;
    chrome.storage.local.set({[dmot]: limit})
    chrome.storage.local.get("default_max_open_tabs").then(result => {
        if (Object.keys(result.length <= 0)) {
            //nothing
        }
        else {
            limit = result.default_max_open_tabs;
        }
        chrome.storage.local.get("current_max_open_tabs").then(result => {
            if (Object.keys(result).length <= 0) {
                //nothing
            }
            else {
                limit = result.current_max_open_tabs;
            }
        
            
        }
        );}
        );
    
})}
async function new_tab() {
    is_open = await chrome.storage.session.get("is_open")
    is_open = is_open.is_open
    if (!is_open) {
        let limit = await chrome.storage.session.get(cmot);
        limit = limit[cmot];
        console.log(limit)
        if (limit == undefined) {
            limit = await chrome.storage.local.get(dmot);
            limit = limit[dmot];
            console.log(limit)
            if (limit == undefined) {
                limit = default_limit;
            }

        }
        let tab_length = await chrome.tabs.query({currentWindow: true})
        tab_length = tab_length.length
        if (tab_length > limit) {
            console.log("Too many tabs!")
            let current_tab_id = await chrome.tabs.query({active: true, currentWindow: true});
            current_tab_id = current_tab_id[0].id
            let tab_create_properties = {
                url: "/Tabs/tab_warning.html",
                openerTabId: current_tab_id
            };
            await chrome.storage.session.set({
                is_open: true
            })
            
            let current_open_tab_id = await chrome.storage.session.get("current_open_tab_id");
            current_open_tab_id = current_open_tab_id.current_open_tab_id ?? -1;
            let tab_exists = true   
            try {
                
                if ((await chrome.tabs.get(current_open_tab_id)) == undefined) {
                    tab_exists = false;
                }
                
            }
            catch (error){
                tab_exists = false;
                console.log("No tab!");
            }
            console.log(tab_exists)
            if (current_open_tab_id == -1 || !tab_exists) {
                let new_tab_id = (await chrome.tabs.create(tab_create_properties)).id;
                await chrome.storage.session.set({
                    current_open_tab_id: new_tab_id
                });
                
            }

            else {
                console.log("Updating...")
                chrome.tabs.update(current_open_tab_id, {active: true, openerTabId: current_tab_id});

            }

            await chrome.storage.session.set({
                is_open: false
            });
    }}
}
new_tab()
chrome.tabs.onCreated.addListener(new_tab);