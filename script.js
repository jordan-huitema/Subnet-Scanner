let storage = { ...localStorage }

//JSON wont stringify sub-objects so i have to make this recurssive strigifyer
function toString(input) {
    let output
    // console.log('IN', input)
    // check type
    let type = typeof input
    type == 'object' && Array.isArray(input) ? type = 'array' : null
    // check for sub objects or arrays
    if (type == 'object') {
        output = {}
        // console.log('type Object', 'length')
        Object.entries(input).forEach(([key, val]) => {
            output[key] = toString(val)
        })
        output = JSON.stringify(output)
    } else if (type == 'array') {
        output = []
        // console.log('type Array')
        input.forEach((elm) => { output.push(tostring(elm)) })
    } else return input
    // console.log('OUT', output)
    return output
}

function toObject(input) {
    try {
        input = JSON.parse(input)
    } catch {
        // console.log('non array or object encountered')
    }
    // console.log('parsed: ', input)
    // check type
    let type = typeof input
    type == 'object' && Array.isArray(input) ? type = 'array' : null
    // check for sub objects or arrays
    if (type == 'object') {
        Object.entries(input).forEach(([key,val])=> {
            input[key] = toObject(val)
        })
    }
    return input
}

function onLoad() { // load all stored id elements
    // Object.keys(storage).forEach(key => {
    //     console.log(`loaded ${key}`)
    //     document.getElementById(key).innerHTML = JSON.parse(storage[key])
    // })
    // buildTiles()
}

function updateStorage() { //Wipe storage and replace with relevant elements
    // Map of DOM, Arrays of classes to select
    storage = {
        ipRanges: document.querySelectorAll('div.rangeInput > button[onclick="removeDiv(this.parentNode)"]'),
        ipWhitelist: document.querySelectorAll(`div.staticIp > button[onclick="removeDiv(this.parentNode)"]`),
        ipBlacklist: document.querySelectorAll(`div.blacklist > button[onclick="removeDiv(this.parentNode)"]`)
    }
    Object.entries(storage).forEach(([key, val]) => {
        if (val.length > 0) {
            let newObj = {}
            Object.entries(val).forEach(([key, val]) => {
                newObj[key] = {
                    innerHTML: val.parentNode.innerHTML,
                    innerText: val.parentNode.innerText
                }
            })
            storage[key] = newObj
            // console.log(newObj)
        } else delete storage[key]
    })
    // localStorage.setItem(key, jsonIsAPain.toString(storage[key]))

    console.log(storage)
    console.log(toString(storage))
    console.log(toObject(toString(storage)))

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
    let elm = document.getElementsByClassName(target)
    elm = elm[elm.length - 1]
    let clone = elm.cloneNode(true)
    //Disable old inputs
    let inputs = elm.getElementsByTagName("input")
    Object.keys(inputs).forEach(key => {
        inputs[key].disabled = true
    })
    // Iterate through Elm and Run Conditions
    clone.childNodes.forEach((node, idx) => {
        // Clear Inputs
        node.localName == 'input' ? clone.childNodes[idx].value = "" : null
        // Swap last Add Buttons for X Buttons
        if (node.localName == 'button' && node.innerText == 'Add') {
            let lastElm = elm.getElementsByTagName("button")[0]
            lastElm.innerText = "X"
            lastElm.setAttribute('onClick', "removeDiv(this.parentNode)")
        }
    })
    elm.insertAdjacentElement('afterend', clone)
    updateStorage()
}

function removeDiv(target) { // Call removeDiv(this.parentNode) or removeDiv(id)
    // If target is object, remove, else find id and remove
    typeof target == 'object' ? target.remove() : document.getElementById(target).remove()
    updateStorage()
}

function buildTiles() {
    // console.log(getIp())
}

function getIp() {
    //ranges
    let ranges = document.getElementsByClassName("rangeInput")
    return ranges
}

onLoad()