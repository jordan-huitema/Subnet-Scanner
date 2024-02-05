let storage = { ...localStorage }
let portRange = [8000, 9000] // Should replace this with a UI option at some point

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
    let ips = {}
    // console.log(storage)
    console.log('Grabbing IP List')
    Object.entries(storage).forEach(([id, idVal]) => {
        // console.log(`- ${id}`)
        Object.entries(idVal).forEach(([cls, clsVal]) => {
            Object.entries(clsVal).forEach(([ip, ipVal]) => {
                console.log(`-- ${ipVal.val} to ${ipVal.val2}`)
                if (typeof ipVal.val2 == 'string') {
                    // ips.push(ipVal.val)
                    ips[ipVal.val] = true
                    // Split Ips for comparison
                    let a = ipVal.val.split('.'), b = ipVal.val2.split('.'), diff = []
                    // console.log('a and b =', a, b)
                    a.forEach((val, idx) => {
                        // calculate diffrence
                        diff.push(b[idx] - val)
                        diff[idx] < 0 ? diff[idx] = diff[idx] + 255 : null
                    })
                    // console.log(diff)
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

                } else ips[ipVal.val] = ipVal.val2
            })
        })
    })
    return ips
}

async function fetchPromise(ip) {
    console.log(ip)
    // Try http first
    return fetch(`http://${ip}/`, { method: 'GET', mode: 'no-cors' })
        .then(rtn => {// success
            return { res: true, ip: `http://${ip}/` }
            // Try https
        }, err => {
            return fetch(`https://${ip}/`, { method: 'GET', mode: 'no-cors' })
                .then(rtn => {// success
                    return { res: true, ip: `https://${ip}/` }
                })
        })
}
// TODO remove awaits so JS can run all querys at once, also add timeout to fetch to avoid hangs on no response
async function fetchIps(listObj) { // INPUT = { "10.1.1.10": 1010, "10.1.1.1": true, "10.1.1.2": true}
    let keys = Object.keys(listObj)
    // Try all urls
    let arr = []
    for (i = 0; i < keys.length; i++) {
        const key = keys[i], val = listObj[keys[i]]
        try {
            // try base url
            await fetchPromise(`${key}`)
                .then(succ => { arr.push(succ); },
                    fail => { // try url with port
                        if (typeof val == 'number') {
                            arr.push(fetchPromise(`${key}:${val}`))
                        } else { // generate ports within range
                            for (j = portRange[0]; j < portRange[1]; j++) {
                                arr.push(fetchPromise(`${key}:${j}`))
                            }
                        }
                    })
        } catch (err) { console.log(err) }
    }
    console.log(arr)
    await Promise.allSettled(arr).then(resArr => {
        console.log(resArr)
        resArr.forEach((val, idx) => {
            console.log(val.value)
        })
    })
}
onLoad()
fetchIps(ipList())