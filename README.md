# Subnet-Scanner

I have a lot of services on my home network now, each with their own management page.

This sites purpose is to scan a set subnet range (or spesific address list) and create links to all sites on one page

## Plan

~~There's not much to this so ill just use bullet points of the main components instead of a map~~

Originally I planned on making this a client side application, however, I have run into a dead end with client side fetch requests running into cors issues so i can detect sites/services but i cant actully get an index page.

I have also greatly underestimated JS performance and this program is memery heavy and proccess intensive.

The plan now is to move the site to a server side backend running on a LXC proxmox container on my home server, and a front end that simply caches setttings, tiles and requests the server for info.

<details>
<summary>V1</summary>

![V1](images/V1_example.png "Title")

#### WebGUI Interface

* [X] Hosted by server (Will probably add a webroute on my PiHole LXC)
* [X] Basic scaleable layout, just a page with a settings button and tiles for each discovered address

#### Configurable settings (Cached to browser)

* [X] Select IP range x.x.x.x - x.x.x.x
* [X] Select Spesific IP and optional port
* [X] Blacklisted IP's
  (Might add a blacklist button to tiles, not really needed for my uses)

#### Storage

* [X] Get and Store Settings to browser cache

#### Scanner

* [X] Ping a range of input IP addresses on all ports
* [ ] Fetch detected sites Index Page

#### Tiler

* [X] Use Input index page to grab site tilte and favicon
* [X] Push new site tile to web GUI (showing Favicon, Title and address)

##### Extra

* [X] Add tiles to storage
  * [ ] Add live "up" and "down" connection indicators to tiles
* [ ] Add restrictions to inputs
  * [ ] Input must be valid ip or port
  * [ ] input 1 must be smaller than input 2
* [ ] Add buttons to Tiles
  * [ ] Remove
  * [ ] Blacklist
* [ ] Add Ports to settings
  * [ ] Port Range
  * [ ] Port Blacklist
  * [ ] Port Range Blacklist
* [ ] Make JS Async (no need but why not)

## Notes

To start editing

* Start Sass, sass --watch input.scss styles.css
* Try not to procrastonate

</details>
<details open>
<summary>V2</summary>

## Plan

I planning to use PREACT to create a nodeJS server on my proxmox server. This will run in a linux container and be hosted on scan.local, I will run the scanner api on scan.local/api. I would like to use a mongodb Database for my api but I think ill just use JSON files for now to keep the complexity down.

I will be salvaging some code from V1 but plan on mostly rewriting it now that I have a better idea of what I want.

I am currently unsure if I will combine the PREACT app and the scanning API but for now ill assume I will keep them seperate.

#### GUI
* [ ] Display Tiles for each site or service on local network
  * [ ] Display site title
  * [ ] Display site icon
  * [ ] Display site address
  * [ ] Link to site
  * [ ] Show connection status of site
  * [ ] Display remove button to remove tile and add to blacklist
* [ ] Provide Settings menu
  * [ ] Scan IP range
  * [ ] Mannually set network addresses for tiles
  * [ ] Define port range
  * [ ] Show blacklist
* [ ] Display current api activity (current scan/ what is in progress)

#### HTMX
* [ ] Index
  * [ ] GET status and display in header (I hear websockets are good)
  * [ ] settings template
    * [ ] GET current static ips
    * [ ] POST static ip add
    * [ ] POST static ip del
    * [ ] POST scan request
    * [ ] POST scan range
    * [ ] POST scan range + port restriction
    * [ ] GET current blacklist
    * [ ] POST blacklist add
    * [ ] POST blacklist del
  * [ ] tile template
    * [ ] GET tiles based off static ip settings
    * [ ] GET tile connection status
    * [ ] POST static ip add
    * [ ] POST static ip del
    * [ ] POST blacklist add
    * [ ] POST blacklist del

#### API
* [ ] /scan
  * [ ] ?addr="https://PiHole.local/admin/login","https://10.1.1.10:8006"
        return [{satus, title, icon, address}]
        Accept 1 or more addresses
  * [ ] ?ip="10.1.1.2","10.1.1.5"
        return [{satus, title, icon, address}]
        Accept 1 or more ips
    * [ ] ?ipRange=true
          set 2 ip's as a range to scan between
  * [ ] ?port="5500","8080"
        Set port restriction on scan
    * [ ] portRange=true
          Set 2 ports as a restriction range
* [ ] /list
      return [{satus, title, icon, address}]
      List all known address
  * [ ] ?add="{satus, title, icon, address},{satus, title, icon, address}"
        return 200
  * [ ] ?del="address"
        return 200
* [ ] /blacklist
      return ["10.1.1.0:0000"]
      list all items on blacklist
  * [ ] ?add="address"
        return 200
  * [ ] ?del="address"
        return 200


## Requierments

Ubuntu 22.04
  * git
  * node
  * sass
  * npm

</details>
