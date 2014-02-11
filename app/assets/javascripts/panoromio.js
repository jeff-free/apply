/* Modified version of Pamela Fox's markerlight.js and pano_maptypecontrol.js
* In combining these two scripts all comments have been removed so please refer to the originals for the comments.
* Kevin Dixon 2011.01.15
* You need to use this script with a suitable HTML page.
* I have posted explanations and example pages on the Panoramio Bulletin Board at http://www.panoramio.com/forum/viewtopic.php?t=21115
*This version 'single_user_pano2.js' includes the function mk() that was originally on the HTML page.
*/
function mk()
{
document.set1.phid.value=pid;document.set1.desc.value=des;
var latlng = new GLatLng(lat,lon);var mk = new MarkerLight(latlng, {image:"http://mw2.google.com/mw-panoramio/photos/mini_square/"+pid+".jpg"});map.addOverlay(mk)
}
function MarkerLight(latlng, opts) {
this.latlng = latlng;
this.photoid = document.set1.phid.value;
this.photode = document.set1.desc.value;
if (!opts) opts = {};
this.height_ = opts.height || 32;
this.width_ = opts.width || 32;
this.image_ = opts.image;
this.imageOver_ = opts.imageOver;
this.clicked_ = 0;
}
MarkerLight.prototype = new GOverlay();
MarkerLight.prototype.initialize = function(map) {
var me = this;
var div = document.createElement("div");
div.style.border = "1px solid white";
div.style.position = "absolute";
div.style.paddingLeft = "0px";
div.style.cursor = 'pointer';
var img = document.createElement("img");
img.src = me.image_;
img.style.width = me.width_ + "px";
img.style.height = me.height_ + "px";
div.appendChild(img);  
GEvent.addDomListener(div, "click", function(event) {
var html = "<div id='infowin' style='width:120px;height:210px;margin:auto'>" +
 "<p><a href='http://www.panoramio.com/photo/" + me.photoid + "' target='_blank'>" + 
 "<img src='http://www.panoramio.com/img/logo-small.gif' style='margin:auto;width:119px;height:25px;border:none' alt='Panoramio logo' title='Panoramio logo'/><\/a><\/p>" +
 "<p><a href='http://www.panoramio.com/photo/" + me.photoid + "' target='_blank'>" + 
 "<img src='http://mw2.google.com/mw-panoramio/photos/small/" + me.photoid + ".jpg' border='0' width='110px' alt='Panoramio logo'/><\/a><\/p><p>" + me.photode + " (" + me.photoid + ")<\/p><\/div>";
map.openInfoWindowHtml(me.latlng,html, {pixelOffset:new GSize(32,-28)});me.clicked_ = 1;});
map.getPane(G_MAP_MARKER_PANE).appendChild(div);
this.map_ = map;
this.div_ = div;
};
MarkerLight.prototype.remove = function() {
this.div_.parentNode.removeChild(this.div_);
};
MarkerLight.prototype.copy = function() {
var opts = {};
opts.color = this.color_;
opts.height = this.height_;
opts.width = this.width_;
opts.image = this.image_;
opts.imageOver = this.image_;
return new MarkerLight(this.latlng, opts);
};
MarkerLight.prototype.redraw = function(force) {if (!force) return;var divPixel = this.map_.fromLatLngToDivPixel(this.latlng);
this.div_.style.width = this.width_ + "px";
this.div_.style.left = (divPixel.x) + "px"
this.div_.style.height = (this.height_) + "px";
this.div_.style.top = (divPixel.y) - this.height_ + "px";
};
MarkerLight.prototype.getZIndex = function(m) {return GOverlay.getZIndex(marker.getPoint().lat())-m.clicked*10000;}
MarkerLight.prototype.getPoint = function() {return this.latlng;};
MarkerLight.prototype.setStyle = function(style) {for (s in style) {this.div_.style[s] = style[s];}};
MarkerLight.prototype.setImage = function(image) {this.div_.style.background = 'url("' + image + '")';}
/*
* Above is markerlight.js
* Below is pano_maptypecontrol.js.
*/
function PanoMapTypeControl(opt_opts) {this.options = opt_opts || {};}
PanoMapTypeControl.prototype = new GControl();
PanoMapTypeControl.prototype.initialize = function(map) {
var container = document.createElement("div");
var me = this;
var mapDiv = me.createButton_("Map");
var satDiv = me.createButton_("Satellite");
var hybDiv = me.createButton_("Hybrid");
me.assignButtonEvent_(mapDiv, map, G_NORMAL_MAP, [satDiv, hybDiv]);
me.assignButtonEvent_(satDiv, map, G_SATELLITE_MAP, [mapDiv, hybDiv]);
me.assignButtonEvent_(hybDiv, map, G_HYBRID_MAP, [satDiv, mapDiv]);
GEvent.addListener(map, "maptypechanged", function() {
if (map.getCurrentMapType() == G_NORMAL_MAP) {GEvent.trigger(mapDiv, "click");}
else if (map.getCurrentMapType() == G_SATELLITE_MAP) {GEvent.trigger(satDiv, "click");} 
else if (map.getCurrentMapType() == G_HYBRID_MAP) {GEvent.trigger(hybDiv, "click");}
});
container.appendChild(mapDiv);
container.appendChild(satDiv);
container.appendChild(hybDiv);
map.getContainer().appendChild(container);
GEvent.trigger(map, "maptypechanged");
return container;
}
PanoMapTypeControl.prototype.createButton_ = function(text) {
var buttonDiv = document.createElement("div");
this.setButtonStyle_(buttonDiv);
buttonDiv.style.cssFloat = "left";
buttonDiv.style.styleFloat = "left";
var textDiv = document.createElement("div");
textDiv.appendChild(document.createTextNode(text));
textDiv.style.width = "6em";
buttonDiv.appendChild(textDiv);
return buttonDiv;
}
PanoMapTypeControl.prototype.assignButtonEvent_ = function(div, map, mapType, otherDivs) {
var me = this;
GEvent.addDomListener(div, "click", function() {for (var i = 0; i < otherDivs.length; i++) {me.toggleButton_(otherDivs[i].firstChild, false);}
me.toggleButton_(div.firstChild, true);
map.setMapType(mapType);});
}
PanoMapTypeControl.prototype.toggleButton_ = function(div, boolCheck) {
div.style.fontWeight = boolCheck ? "bold" : "";
div.style.border = "1px solid white";
var shadows = boolCheck ? ["Top", "Left"] : ["Bottom", "Right"];
for (var j = 0; j < shadows.length; j++) {
div.style["border" + shadows[j]] = "1px solid #b0b0b0";
}}
PanoMapTypeControl.prototype.getDefaultPosition = function() {return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(7, 7));}
PanoMapTypeControl.prototype.setButtonStyle_ = function(button) {
button.style.color = "#000000";
button.style.backgroundColor = "white";
button.style.font = "small Arial";
button.style.border = "1px solid black";
button.style.padding = "0px";
button.style.margin= "0px";
button.style.textAlign = "center";
button.style.fontSize = "12px";
button.style.cursor = "pointer";
}