chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
let selected_tab = 0;
let alt_selected_tab = 0;
let alt_selected_tabs = []
let selected_tabs = []
var keys = {};
document.onkeydown = function(e){keys[e.key.toLowerCase()]=true;};
document.onkeyup = function(e){keys[e.key.toLowerCase()]=false;};

async function main() {
    await loaded();
    click_event();
    contextmenu_buttons();
}


async function loaded() {
    let tabs = await chrome.tabs.query({currentWindow: true});
    let tabs_array = [];
    const tabs_table = document.querySelector("#tabs_table")
    const nodes = Array.from(tabs_table.childNodes)
    for (let node of nodes) {
        tabs_table.removeChild(node)
    }
    console.log("Children", tabs_table.childNodes)
    for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        let image = new Image();
        image.src = tab.favIconUrl;
        image.height = 25;
        let title = tab.title;
        let url = tab.url;
        let id = tab.id
        tabs_array.push({image: image, title: title, url: url, id: id});        
    }
    let i = 0;
    for (let item of tabs_array) {
        let tr = document.createElement("tr");
        let tds = [document.createElement("td"), document.createElement("td"), document.createElement("td")];
        const image = item.image;
        let title = document.createElement("span");
        title.textContent = item.title;
        let url = document.createElement("a");
        url.href = item.url;
        let url_text = item.url;
        url_text = (new URL(url_text)).hostname.replace("www.", "");
        url.textContent = url_text;
        
        tds[0].appendChild(image);
        tds[1].appendChild(title);
        tds[2].appendChild(url);
        for (let child of tds) {
            tr.appendChild(child);
        }
        const id_text = `item-${item.id}`
        tr.classList.add("tab", "unselectable")
        tr.id = id_text
        tabs_table.appendChild(tr);
        i++;
    }
    console.log("Loaded")
}

async function click(tab) {
    let id = tab.id.replace("item-", "");
    id = parseInt(id);

    let tabs = document.querySelectorAll(".tab");

    const shift_pressed = keys.shift ?? false;
    const ctrl_pressed = keys.control ?? false;
    const alt_pressed = keys.alt ?? false;
    let tab_children = document.querySelector("#tabs_table").childNodes
    tab_children = Array.from(tab_children)
    id = tab_children.indexOf(tab)
    let selected_tab_id = tab_children.indexOf(selected_tab)
    
    if (ctrl_pressed) {
        selected_tab = tab_children[id]
        //selected_tab = document.querySelector(`#item-${id}`);
        if (!selected_tabs.includes(tab_children[id])) {
            selected_tabs.push(tab_children[id])

        }
        else {
            selected_tabs.splice(selected_tabs.indexOf(tab_children[id]), 1)
            console.log("Sliced!", tab_children[id])
        }
        console.log(selected_tabs)
    }

    else if (alt_pressed) {
        console.log("hALT")
        if ((alt_selected_tab ?? 0) == 0) {
            console.log(alt_selected_tab)
            
            alt_selected_tab = selected_tab ?? tab_children[id];
            alt_selected_tabs = [alt_selected_tab]

            //selected_tab = document.querySelector(`#item-${id}`);

            
        }
        
            console.log("HALT")
            alt_selected_tabs = [];
            //let selected_tab_id = parseInt(selected_tab.id.replace("item-", ""));
            let alt_selected_tab_id = tab_children.indexOf(alt_selected_tab);
            console.log("YAY", alt_selected_tab_id, id)
            let start = Math.min(alt_selected_tab_id, id);
            let end = Math.max(alt_selected_tab_id, id);
            for (let i = start; i <= end; i++) {
                // If tab is not in the list of selected tabs
                console.log(alt_selected_tabs.concat(selected_tabs), alt_selected_tab)
                if ((alt_selected_tabs.concat(selected_tabs)).indexOf(tab_children[i]) == -1) {
                    console.log("I", i)
                    alt_selected_tabs.push(tab_children[i]);
                }
            }
            
        

    }
    else if (!shift_pressed) {
        selected_tab = tab_children[id]
        //selected_tab = document.querySelector(`#item-${id}`);
        selected_tabs = []
        selected_tabs.push(tab_children[id])
        console.log("SEE", selected_tabs, id)
    
    
    }
    else {
        if ((selected_tab ?? 0) == 0) {
            selected_tab = tab_children[id]
            //selected_tab = document.querySelector(`#item-${id}`);
            console.log("EGJ")
            selected_tabs = [selected_tab];
        }
        else {
            selected_tabs = [];
            //let selected_tab_id = parseInt(selected_tab.id.replace("item-", ""));
            
            let start = Math.min(selected_tab_id, id);
            let end = Math.max(selected_tab_id, id);
            for (let i = start; i <= end; i++) {
                selected_tabs.push(tab_children[i]);

            }
            
        }

    }
    console.log(selected_tabs)
    
    change_classes(tabs)
}

function change_classes(tabs) {
    for (let tab of tabs) {
        tab.classList.remove("selected")
    }
    for (let tab of selected_tabs) {
        tab.classList.add("selected")
    }
}
async function reset_tabs() {
    tabs = document.querySelector("#tabs_parent")
    /*console.log(tabs.scrollTop)
    let scroll_down = tabs.scrollTop
    let scroll_right = tabs.scrollLeft

    console.log("Loading!")
    console.log(scroll_down, scroll_right)
    console.log(document.querySelector("#tabs_parent").scrollTop)
    tabs.style.overflowY = "hidden";
    console.log("S", tabs.scrollHeight)
    setTimeout(async function() {
        await loaded()
    console.log(document.querySelector("#tabs_parent").scrollTop)   
    console.log(scroll_down, scroll_right)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            tabs.style.overflowY = "auto";
            tabs.scrollTo(scroll_right, scroll_down);
            console.log(document.querySelector("#tabs_parent").scrollTop);
        });
    });
    setTimeout(() => {
        console.log(tabs.scrollTop)
        console.log("S", tabs.scrollHeight)
    }, 1000);
    }, 1000)
    */
   await loaded()
    
    
    click_event()
}

async function contextmenu_buttons() {
    let contextmenu = document.querySelector("#context-menu");
    let close = contextmenu.querySelector("#close");
    let window = contextmenu.querySelector("#window");
    close.addEventListener("click", async () => {
        let tabs = selected_tabs.concat(alt_selected_tabs)
            let tab_ids = []
            for (let tab of tabs) {
                tab_ids.push(parseInt(tab.id.replace("item-", "")))
            }
            /*current_index = tabs.indexOf((tab_children[await chrome.tabs.query({active: true, currentWindow: true})[0].id]))
            //if (current_index != -1)
            tabs.splice(current_index, 1)
            
            for (let tab of tabs) {
                // not needed 
                // tab_id = chrome.tabs.query({})
                console.log("Deleting!")
                console.log("1")
                if (parseInt(tab.id.replace("item-", "")) == (()) {
                    console.log("2")
                    setTimeout(() => {
                        chrome.tabs.remove(parseInt(tab.id.replace("item-", "")));
                        reset_tabs()
                    },
                    1000
                    )
                    continue;
                }
                else {
                    chrome.tabs.remove(parseInt(tab.id.replace("item-", "")));
                }
            }*/
            chrome.tabs.remove(tab_ids)
            reset_tabs()
    });
    document.addEventListener("keyup", async (e) => {
        if (e.key == "Delete") {
            let tabs = selected_tabs.concat(alt_selected_tabs)
            let tab_ids = []
            for (let tab of tabs) {
                tab_ids.push(parseInt(tab.id.replace("item-", "")))
            }
            /*current_index = tabs.indexOf((tab_children[await chrome.tabs.query({active: true, currentWindow: true})[0].id]))
            //if (current_index != -1)
            tabs.splice(current_index, 1)
            
            for (let tab of tabs) {
                // not needed 
                // tab_id = chrome.tabs.query({})
                console.log("Deleting!")
                console.log("1")
                if (parseInt(tab.id.replace("item-", "")) == (()) {
                    console.log("2")
                    setTimeout(() => {
                        chrome.tabs.remove(parseInt(tab.id.replace("item-", "")));
                        reset_tabs()
                    },
                    1000
                    )
                    continue;
                }
                else {
                    chrome.tabs.remove(parseInt(tab.id.replace("item-", "")));
                }
            }*/
            chrome.tabs.remove(tab_ids)
            reset_tabs()
        }
    })
    window.addEventListener("click", async function() {
        let urls = []
        for (let tab of selected_tabs) {
            let tab_id = parseInt(tab.id.replace("item-", ""))
            let temp = await chrome.tabs.get(tab_id);
            if (temp.url == "about:newtab") {
                continue
            }
            urls.push(temp.url)
            
        }
        let window_info = {
            url: urls
        }

        console.log(window_info.url)
        chrome.windows.create(window_info)
        for (let tab of selected_tabs) {
            chrome.tabs.remove(parseInt(tab.id.replace("item-", "")))
        }

        reset_tabs()
    })
    
}

async function click_event() {
    const menu = document.querySelector("#context-menu");
    let contextmenu = menu
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault()
        for (let i of menu.children) {
            i.style.visibility = 'visible';
        }
        menu.style.visibility = "visible";
        let x_offset = event.pageX;
        let y_offset = event.pageY;
        menu.style.left = `${x_offset}px`;
        menu.style.top = `${y_offset}px`;
    })
    document.addEventListener('click', (e) => {
        let event = e.target;
        if (!Array.from(document.querySelector("#tabs_table").querySelectorAll("*")).concat(Array.from(contextmenu.querySelectorAll("*")), contextmenu).includes(event) && contextmenu.style.visibility == "hidden") {
            console.log(contextmenu.style.visibility)
            selected_tab = 0;
            selected_tabs = []
            change_classes(document.querySelectorAll(".tab"))
            console.log("EEE", Array.from(document.querySelector("#tabs_table").querySelectorAll("*")).concat(Array.from(contextmenu.querySelectorAll("*")), contextmenu), "EEEE", event)
        }

        for (let i of menu.children) {
            i.style.visibility = 'hidden';
        }
        menu.style.visibility = 'hidden';
    })



    const tabs = document.querySelectorAll(".tab");
    for (let i of tabs) {
        i.addEventListener("click", () => {
            click(i);
            
        });
        
    }
    document.addEventListener("keyup", (e) => {
        if (e.key == "Escape") {
            selected_tab = 0;
            selected_tabs = []
            change_classes(document.querySelectorAll(".tab"))
        }
    })
    
    /*
    const tab_table = document.querySelectorAll("#tabs_table *")
    for (let thing of tab_table) {
        thing.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            // Your code here
            selected_tab = 0;
            selected_tabs = [];
            change_classes(document.querySelectorAll(".tab"));
        });
    }*/
    
}

main()


