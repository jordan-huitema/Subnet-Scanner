let storage = { ...localStorage }

function onLoad() { // load all stored id elements
    Object.keys(storage).forEach(key => {
        console.log(`${key}`)
        document.getElementById(key).innerHTML = JSON.parse(storage[key])
    })
}

function updateStorage() { //Wipe storage and replace with relevant elements
    // Map of DOM, Arrays of classes to select
    storage = {
        settings: document.getElementById('settings').innerHTML,
        tiles: document.getElementById('tiles').innerHTML
    }
    Object.keys(storage).forEach(key => {
        localStorage.setItem(key,JSON.stringify([storage[key]]))
    })
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

function addDiv(target) { //Call addDiv("class")
    // Get target Elm and Clone
    let elm = document.getElementsByClassName(target)[0]
    let clone = elm.cloneNode(true)
    console.log(clone.childNodes)
    // Iterate through Elm and Run Conditions
    clone.childNodes.forEach((node,idx) => {
        // Clear Inputs
        node.localName == 'input' ? clone.childNodes[idx].value = "" : null
        // Swap last Add Buttons for X Buttons
        if(node.localName == 'button' && node.innerText == 'Add'){
            let lastElm  =  elm.getElementsByTagName("button")[0]
            console.log(lastElm)
            lastElm.innerText = "X"
            lastElm.setAttribute('onClick',"removeDiv(this.parentNode)")
        }
    })
    elm.insertAdjacentElement('afterend', clone)
    updateStorage()
}

function removeDiv(target){ // Call removeDiv(this.parentNode) or removeDiv(id)
    // If target is object, remove, else find id and remove
    typeof target == 'object' ? target.remove() : document.getElementById(target).remove() 
    updateStorage()
}

//todo funcs
function getRange() {
    //Get blacklist
    //Get Statics
    //Get Range

    updateStorage()
}

onLoad()