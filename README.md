# Subnet-Scanner

I have a lot of services on my home network now, each with their own management page.

This sites purpose is to scan a set subnet range (or spesific address list) and create links to all sites on one page

## Plan

There's not much to this so ill just use bullet points of the main components instead of a map

#### WebGUI Interface

* Hosted by server, Will probably add a webroute on my PiHole
* Basic scaleable layout, just a page with a settings button and tiles for each discovered address

#### Configurable settings (Cached to browser)

* Select IP range x.x.x.x - x.x.x.x
* Select Spesific IP and optional port
* Blacklisted IP's
  (Might add a blacklist button to tiles, not really needed for my uses)

#### Storage

* Get and Store Settings to browser cache

#### Scanner

* Ping a range of input IP addresses on all ports
* Fetch detected sites Index Page

#### Tiler

Use Input index page to grab site tilte and favicon

Push new site tile to web GUI (showing Favicon, Title and address)

###### Extra

* Add tiles to storage
  * Add live "up" and "down" connection indicators to tiles
* Add buttons to Tiles
  * Remove
  * Blacklist
* Add Ports to settings
  * Port Range
  * Port Blacklist
  * Port Range Blacklist

## TODO

* Add Fetch JS
* Add Tiles JS
* Fix browser caching (forgot i need to store as json)
* Complete get range func
