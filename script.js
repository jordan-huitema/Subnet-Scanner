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
        Object.entries(input).forEach(([key, val]) => {
            input[key] = toObject(val)
        })
    }
    return input
}

function onLoad() { // load all stored elements
    storage = toObject(storage)
    // console.log(storage)
    Object.entries(storage).forEach(([id, idVal]) => {
        // console.log(id, idVal)
        Object.entries(idVal).forEach(([cls, clsVal]) => {
            // console.log(cls, clsVal)
            Object.entries(clsVal).forEach(([node, nodeVal]) => {
                // E.g find all nodes matching (#ipRanges .rangeInput input) and set their value based on the current node index
                let nodeSearch = document.querySelectorAll(`#${id} .${cls} ${nodeVal.name}`)
                nodeSearch[node].value = nodeVal.val
                node++
                nodeSearch[node].value = nodeVal.val2
                addDiv(cls, false)
            })
        })
    })
    buildTiles()
}

function updateStorage() { //Wipe storage and replace with relevant elements
    // Map of DOM, Arrays of classes to select
    storage = {
        ipRanges: document.querySelectorAll('div.rangeInput > input[disabled]'),
        ipWhitelist: document.querySelectorAll(`div.staticIp > input[disabled]`),
        ipBlacklist: document.querySelectorAll(`div.blacklist > input[disabled]`)
    }
    // Find all used input fields in listed storage object, Build new entry and update
    Object.entries(storage).forEach(([key, val]) => {
        if (val.length > 0) {
            let newObj = {}
            Object.entries(val).forEach(([key, val]) => {
                // Create new key for class if none exists
                newObj[`${val.parentNode.className}`] ? null : newObj[`${val.parentNode.className}`] = {}
                // Create new input node entry
                if ((key % 2) == 1) {
                    // add every other value to the previous key
                    newObj[`${val.parentNode.className}`][key - 1].val2 = val.value
                } else {
                    newObj[`${val.parentNode.className}`][key] = {
                        name: val.tagName,
                        val: val.value,
                        class: val.className
                    }
                }
            })
            storage[key] = newObj
            localStorage.setItem(key, toString(newObj))
        } else delete storage[key]
    })
    // console.log(toObject(toString(storage)))
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

function addDiv(target, store = true) { //Call addDiv("class")
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
    store ? updateStorage() : null
}

function removeDiv(target) { // Call removeDiv(this.parentNode) or removeDiv(id)
    // If target is object, remove, else find id and remove
    typeof target == 'object' ? target.remove() : document.getElementById(target).remove()
    updateStorage()
}

function buildTiles() {
    // console.log(getIp())
}

function ipList() {
    let ips = []
    console.log(storage)
    console.log('Grabbing IP List')
    Object.entries(storage).forEach(([id, idVal]) => {
        console.log(`- ${id}`)
        Object.entries(idVal).forEach(([cls, clsVal]) => {
            Object.entries(clsVal).forEach(([ip, ipVal]) => {
                console.log(`-- ${ipVal.val} to ${ipVal.val}`)
                
                

            })
        })
    })
}

onLoad()
ipList()