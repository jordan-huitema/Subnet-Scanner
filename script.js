let storage = { ...localStorage }
let portRange = [1000, 9999] // Should replace this with a UI option at some point

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
                cls == 'staticIp' ? addTile(`${nodeVal.val}`) : null
                addDiv(cls, false)
            })
        })
    })
}

function updateStorage() { //Wipe storage and replace with relevant elements
    // Map of DOM, Arrays of classes to select
    storage = {
        ipWhitelist: document.querySelectorAll(`div.staticIp > input[disabled]`),
        ipBlacklist: document.querySelectorAll(`div.blacklist > input[disabled]`)
    }
    // console.log(storage)
    // Find all used input fields in listed storage object, Build new entry and update
    Object.entries(storage).forEach(([key, val]) => {
        if (val.length > 0) {
            let newObj = {}
            Object.entries(val).forEach(([key, val]) => {
                // Create new key for class if none exists
                newObj[`${val.parentNode.className}`] ? null : newObj[`${val.parentNode.className}`] = {}
                // Create new input node entry
                newObj[`${val.parentNode.className}`][key] = {
                    name: val.tagName,
                    val: val.value,
                    class: val.className
                }
            })
            storage[key] = newObj
            localStorage.setItem(key, toString(newObj))
        } else delete storage[key]
    })
    // console.log(storage)
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
    // console.log(elm)
    clone.childNodes.forEach((node, idx) => {
        // Clear Inputs
        if (node.localName == 'input') {
            clone.childNodes[idx].value = ""
            if (idx == 3 && elm.children[2].value.length > 0) {
                elm.children[0].value = `${elm.children[0].value}:${elm.children[2].value}`
            }
        }
        // Add input fields together
        // Swap last Add Buttons for X Buttons
        if (node.localName == 'button' && node.innerText == 'Add') {
            // Remove text and input nodes, change button node
            elm.children[1].remove()
            elm.children[1].remove()
            elm.children[1].innerText = "X"
            elm.children[1].setAttribute('onClick', "removeDiv(this.parentNode)")
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

function ipList() {
    let ips = {}, inputA = document.getElementById("inputA").value, inputB = document.getElementById("inputB").value
    // console.log(`-- ${inputA} to ${inputB}`)
    if (typeof inputB == 'string') {
        ips[inputA] = true
        // Split Ips for comparison
        let a = inputA.split('.'), b = inputB.split('.'), diff = []
        // console.log('a and b =', a, b)
        a.forEach((val, idx) => {
            // calculate diffrence
            diff.push(b[idx] - val)
            diff[idx] < 0 ? diff[idx] = diff[idx] + 255 : null
        })
        // Itterate through diff arr and check diffs
        // If there is a diffrence in range
        if (diff.reduce((a, c) => a + c) !== 0) {
            // Itterate through diff and add any ips between differing ranges
            const recurssive = (diffIdx = 0, add = false) => { // input [0.0.1.0]
                // Check if shift is active
                if (add && diffIdx < 4) {
                    // loop through index of a and itterate until 255
                    while (a[diffIdx] < 256) {
                        // Each itteration, add currect ip and callback to itterate to itterate subnets
                        ips[a.join('.')] = true
                        recurssive(diffIdx + 1, true)
                        a[diffIdx]++
                    }
                    a[diffIdx] = 0
                } else {
                    // Check for diffrence, if no move to next idx
                    if (diff[diffIdx] == 0) {
                        recurssive(++diffIdx)
                    } else {
                        // If idx has diffrence, callback with add until diff = 0
                        while (diff[diffIdx] > 0) {
                            recurssive(diffIdx + 1, true)
                            a[diffIdx]++
                            ips[a.join('.')] = true
                            diff[diffIdx]--
                        }
                    }
                }
            }
            recurssive()
        }

    } else ips[inputA] = inputB
    return ips
}

function addTile(ip) {
    console.log('addTile', ip)
    let tile = document.getElementsByClassName('tile')[0]
    tile.setAttribute('href', ip)
    tile.children[0].src = `http://${ip}/favicon.ico`
    tile.children[1].innerText = ip
    addDiv('tile', false)
}

function fetchPromise(ip) {
    // Try http first
    return fetch(`http://${ip}/`, { method: 'GET', mode: 'no-cors' })
        .then(succ => { // If response received, set new static ip and add tile card
            document.querySelectorAll(`div.staticIp > input:not([disabled])`)[0].value = ip
            addTile(ip)
            addDiv('staticIp')
        })
}

async function fetchIps(listObj) { // INPUT = { "10.1.1.10": 1010, "10.1.1.1": true, "10.1.1.2": true}
    let keys = Object.keys(listObj)
    // Try all urls
    let arr = []
    let scanLog = document.getElementById('scanText')
    for (i = 0; i < keys.length; i++) {
        const key = keys[i], val = listObj[keys[i]]
        try {
            // try base url
            scanLog.innerText = `Scanning: ${key}`
            console.log('trying ', key)
            arr.push(fetchPromise(`${key}`)
                .then(succ => { },
                    async fail => { // try url with port
                        if (typeof val == 'number') {
                            // console.log('port')
                            arr.push(fetchPromise(`${key}:${val}`).catch(err => { }))
                        } else { // generate ports within range
                            // console.log('no port')
                            for (j = portRange[0]; j < portRange[1]; j++) {
                                // console.log('trying ', `${key}:${j}`)
                                scanLog.innerText = `Scanning: ${key}:${j}`
                                await new Promise(r => setTimeout(r, 1));
                                arr.push(fetchPromise(`${key}:${j}`).catch(err => { }))
                            }
                        }
                    }))
            console.log('awaiting promises', key)
            await Promise.allSettled(arr)
            arr = []
        } catch (err) { console.log(err) }
    }
    scanLog.innerText = `Scanning: Done`
}
onLoad()