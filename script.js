let storage = { ...localStorage }
console.log(storage)

function updateStorage() {
    Object.keys(storage).forEach(key => {
        localStorage.setItem(key, storage[key])
    })
}

function loadFromStorage() {
    
}

function getRange() {
    //Get blacklist
    //Get Statics
    //Get Range

    updateStorage()
}

function toggleSettings() {
    let elm = document.getElementById("settings");
    if (elm.style.display != 'block') { elm.style.display = 'block' }
    else {
        elm.style.display = 'none'
        let obj = document.getElementById('settings')
        storage['settings'] = obj
        getRange()
    }
}

//todo funcs
function addDiv(target) {
    let elm = document.getElementsByClassName(target)[0]
    let clone = elm.cloneNode(true)
    console.log(clone.childNodes)
    clone.childNodes.forEach((node,idx) => {
        node.localName == 'input' ? clone.childNodes[idx].value = "" : null
    })
    elm.insertAdjacentElement('afterend', clone)
}

// Testing tiles
function onLoad() {

}
loadFromStorage()