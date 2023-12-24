chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
async function main() {
    let input = document.querySelector("#max")
    let text = document.querySelector("#max-text")
    let set_button = document.querySelector("#set")
    let current_default = (await chrome.storage.local.get("default_max_open_tabs")).default_max_open_tabs
    current_default = current_default != undefined ? current_default : 20;
    text.textContent = current_default;
    input.value = current_default
    set_button.addEventListener("click", async function () {
        // check if number
        if (/^\d+$/.test(input.value)) {
            let temp = parseInt(input.value)
            if (temp >= 5) {
                await chrome.storage.local.set({default_max_open_tabs: temp})
                console.log("NUMBERS")
            }
            text.textContent = temp
        }
    })
}
main()