/*
 * @package    oakcms
 * @author     Hryvinskyi Volodymyr <script@email.ua>
 * @copyright  Copyright (c) 2015 - 2017. Hryvinskyi Volodymyr
 * @version    0.0.1
 *
 * angularjs widgetkit map derective
 */

/**
 * Created by Volodymyr Hryvinskyi on 27.01.2017.
 */

'use strict';
angular.module('ngGoogleMapWidgetkit', []).directive('googleMap', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var win = angular.element($window);

            function GmapDir(t, i, r) {
                this.extend(GmapDir, google.maps.OverlayView), this.map_ = t, this.markers_ = [], this.clusters_ = [], this.sizes = [53, 56, 66, 78, 90], this.styles_ = [], this.ready_ = !1;
                var s = r || {};
                this.gridSize_ = s.gridSize || 60, this.minClusterSize_ = s.minimumClusterSize || 2, this.maxZoom_ = s.maxZoom || null, this.styles_ = s.styles || [], this.imagePath_ = s.imagePath || this.MARKER_CLUSTER_IMAGE_PATH_, this.imageExtension_ = s.imageExtension || this.MARKER_CLUSTER_IMAGE_EXTENSION_, this.zoomOnClick_ = !0, void 0 != s.zoomOnClick && (this.zoomOnClick_ = s.zoomOnClick), this.averageCenter_ = !1, void 0 != s.averageCenter && (this.averageCenter_ = s.averageCenter), this.setupStyles_(), this.setMap(t), this.prevZoom_ = this.map_.getZoom();
                var o = this;
                google.maps.event.addListener(this.map_, "zoom_changed", function () {
                    var t = o.map_.getZoom();
                    o.prevZoom_ != t && (o.prevZoom_ = t, o.resetViewport())
                }), google.maps.event.addListener(this.map_, "idle", function () {
                    o.redraw()
                }), i && i.length && this.addMarkers(i, !1)
            }

            function i(t) {
                this.markerClusterer_ = t, this.map_ = t.getMap(), this.gridSize_ = t.getGridSize(), this.minClusterSize_ = t.getMinClusterSize(), this.averageCenter_ = t.isAverageCenter(), this.center_ = null, this.markers_ = [], this.bounds_ = null, this.clusterIcon_ = new r(this, t.getStyles(), t.getGridSize())
            }

            function r(t, e, i) {
                t.getMarkerClusterer().extend(r, google.maps.OverlayView), this.styles_ = e, this.padding_ = i || 0, this.cluster_ = t, this.center_ = null, this.map_ = t.getMap(), this.div_ = null, this.sums_ = null, this.visible_ = !1, this.setMap(this.map_)
            }

            var o = function () {
                return window.mapSettings || (window.mapSettings = $.Deferred(), window.initializeGoogleMapsApi = window.mapSettings.resolve, $.getScript("//maps.google.com/maps/api/js?callback=initializeGoogleMapsApi&key=" + (window.GOOGLE_MAPS_API_KEY || ""))), window.mapSettings.promise()
            };

            o().then(function () {
                var t = $(element),
                    mapData = $("<div data-uk-check-display></div>").attr(t.data()),
                    json = t.find('script[type="angular/map"]').html(),
                    s = JSON.parse(json),
                    markers = s.markers,
                    a,
                    h,
                    center,
                    mapOptions,
                    map,
                    l = [],
                    u = window.MapsMarkerHelper || !1;
                t.replaceWith(mapData);
                Object.keys(s).forEach(function (t) {
                    isNaN(s[t]) || (s[t] = Number(s[t]))
                });

                center = markers.length ? new google.maps.LatLng(markers[0].lat, markers[0].lng) : new google.maps.LatLng(-34.397, 150.644),
                    mapOptions = {
                        zoom: parseInt(s.zoom, 10),
                        center: center,
                        streetViewControl: s.mapctrl,
                        navigationControl: s.mapctrl,
                        scrollwheel: s.zoomwheel,
                        draggable: s.draggable,
                        mapTypeId: google.maps.MapTypeId[s.maptypeid.toUpperCase()],
                        mapTypeControl: s.maptypecontrol,
                        zoomControl: s.zoomcontrol,
                        disableDefaultUI: s.disabledefaultui,
                        mapTypeControlOptions: {
                            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                            mapTypeIds: [
                                "styled_map",
                                google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE
                            ]
                        },
                        zoomControlOptions: {
                            style: s.mapctrl ? google.maps.ZoomControlStyle.DEFAULT : google.maps.ZoomControlStyle.SMALL
                        }
                    };

                map = new google.maps.Map(mapData[0], mapOptions);

                markers.length && s.directions && (
                    a = $('<a target="_blank"></a>').css({
                        padding: "5px 1px",
                        "text-decoration": "none"
                    }),
                        h = t("<div></div>").css({
                            "-webkit-background-clip": "padding-box",
                            padding: "1px 4px",
                            backgroundColor: "white",
                            borderColor: "rgba(0, 0, 0, 0.14902)",
                            borderStyle: "solid",
                            borderWidth: "1px",
                            cursor: "pointer",
                            textAlign: "center",
                            fontFamily: "Roboto, Arial, sans-serif",
                            fontWeight: 500,
                            boxShadow: "rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px",
                            index: 1
                        }),
                        h.html('<span style="color:#000;"><span style="color:blue;">&#8627;</span>' + (s.directionsText || "Get Directions") + "</span>"),
                        a.append(h),
                        a.setHref = function (t, e) {
                            this.attr("href", "http://maps.google.com/?daddr=" + t + "," + e)
                        },
                        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(a[0])
                ), markers.length && s.marker && (markers.forEach(function (t, e) {
                    var r, o = new google.maps.Marker({
                        position: new google.maps.LatLng(t.lat, t.lng),
                        map: map,
                        title: t.title
                    });
                    (u && t.icon || s.marker_icon) && u.setIcon(o, t.icon || s.marker_icon), l.push(o), s.marker >= 1 && (r = new google.maps.InfoWindow({
                        content: t.content,
                        maxWidth: s.popup_max_width ? parseInt(s.popup_max_width, 10) : 300
                    }), google.maps.event.addListener(o, "click", function () {
                        t.content && r.open(map, o), a && (a.setHref(t.lat, t.lng), a.show())
                    }), 0 === e && (3 === s.marker && t.content && r.open(i, o), a && (a.setHref(t.lat, t.lng), a.show())))
                }), map.panTo(new google.maps.LatLng(markers[0].lat, markers[0].lng))), s.markercluster && (this.markerCluster = new e(map, l));

                var rebuild = function (map) {
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter(center);
                };

                google.maps.event.addDomListener(window, 'resize', function () {
                    map.setCenter(center);
                });

                if (!!attrs.rebuildOn) {
                    attrs.rebuildOn.split(' ').forEach(function (eventName) {
                        scope.$on(eventName, function () {
                            rebuild(map)
                        });
                    });
                }

                if (attrs.hasOwnProperty('rebuildOnResize')) {
                    win.on('resize', rebuild(map));
                }

            }), GmapDir.prototype.MARKER_CLUSTER_IMAGE_PATH_ = "https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m", GmapDir.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = "png", GmapDir.prototype.extend = function (t, e) {
                return function (t) {
                    for (var e in t.prototype) this.prototype[e] = t.prototype[e];
                    return this
                }.apply(t, [e])
            }, GmapDir.prototype.onAdd = function () {
                this.setReady_(!0)
            }, GmapDir.prototype.draw = function () {
            }, GmapDir.prototype.setupStyles_ = function () {
                if (!this.styles_.length)
                    for (var t, e = 0; t = this.sizes[e]; e++) this.styles_.push({
                        url: this.imagePath_ + (e + 1) + "." + this.imageExtension_,
                        height: t,
                        width: t
                    })
            }, GmapDir.prototype.fitMapToMarkers = function () {
                for (var t, e = this.getMarkers(), i = new google.maps.LatLngBounds, r = 0; t = e[r]; r++) i.extend(t.getPosition());
                this.map_.fitBounds(i)
            }, GmapDir.prototype.setStyles = function (t) {
                this.styles_ = t
            }, GmapDir.prototype.getStyles = function () {
                return this.styles_
            }, GmapDir.prototype.isZoomOnClick = function () {
                return this.zoomOnClick_
            }, GmapDir.prototype.isAverageCenter = function () {
                return this.averageCenter_
            }, GmapDir.prototype.getMarkers = function () {
                return this.markers_
            }, GmapDir.prototype.getTotalMarkers = function () {
                return this.markers_.length
            }, GmapDir.prototype.setMaxZoom = function (t) {
                this.maxZoom_ = t
            }, GmapDir.prototype.getMaxZoom = function () {
                return this.maxZoom_
            }, GmapDir.prototype.calculator_ = function (t, e) {
                for (var i = 0, r = t.length, s = r; 0 !== s;) s = parseInt(s / 10, 10), i++;
                return i = Math.min(i, e), {
                    text: r,
                    index: i
                }
            }, GmapDir.prototype.setCalculator = function (t) {
                this.calculator_ = t
            }, GmapDir.prototype.getCalculator = function () {
                return this.calculator_
            }, GmapDir.prototype.addMarkers = function (t, e) {
                for (var i, r = 0; i = t[r]; r++) this.pushMarkerTo_(i);
                e || this.redraw()
            }, GmapDir.prototype.pushMarkerTo_ = function (t) {
                if (t.isAdded = !1, t.draggable) {
                    var e = this;
                    google.maps.event.addListener(t, "dragend", function () {
                        t.isAdded = !1, GmapDir.repaint()
                    })
                }
                this.markers_.push(t)
            }, GmapDir.prototype.addMarker = function (t, e) {
                this.pushMarkerTo_(t), e || this.redraw()
            }, GmapDir.prototype.removeMarker_ = function (t) {
                var e = -1;
                if (this.markers_.indexOf) e = this.markers_.indexOf(t);
                else
                    for (var i, r = 0; i = this.markers_[r]; r++)
                        if (i == t) {
                            e = r;
                            break
                        }
                return -1 == e ? !1 : (t.setMap(null), this.markers_.splice(e, 1), !0)
            }, GmapDir.prototype.removeMarker = function (t, e) {
                var i = this.removeMarker_(t);
                return !e && i ? (this.resetViewport(), this.redraw(), !0) : !1
            }, GmapDir.prototype.removeMarkers = function (t, e) {
                for (var i, r = !1, s = 0; i = t[s]; s++) {
                    var o = this.removeMarker_(i);
                    r = r || o
                }
                return !e && r ? (this.resetViewport(), this.redraw(), !0) : void 0
            }, GmapDir.prototype.setReady_ = function (t) {
                this.ready_ || (this.ready_ = t, this.createClusters_())
            }, GmapDir.prototype.getTotalClusters = function () {
                return this.clusters_.length
            }, GmapDir.prototype.getMap = function () {
                return this.map_
            }, GmapDir.prototype.setMap = function (t) {
                this.map_ = t
            }, GmapDir.prototype.getGridSize = function () {
                return this.gridSize_
            }, GmapDir.prototype.setGridSize = function (t) {
                this.gridSize_ = t
            }, GmapDir.prototype.getMinClusterSize = function () {
                return this.minClusterSize_
            }, GmapDir.prototype.setMinClusterSize = function (t) {
                this.minClusterSize_ = t
            }, GmapDir.prototype.getExtendedBounds = function (t) {
                var e = this.getProjection(),
                    i = new google.maps.LatLng(t.getNorthEast().lat(), t.getNorthEast().lng()),
                    r = new google.maps.LatLng(t.getSouthWest().lat(), t.getSouthWest().lng()),
                    s = GmapDir.fromLatLngToDivPixel(i);
                s.x += this.gridSize_, s.y -= this.gridSize_;
                var o = GmapDir.fromLatLngToDivPixel(r);
                o.x -= this.gridSize_, o.y += this.gridSize_;
                var n = GmapDir.fromDivPixelToLatLng(s),
                    a = GmapDir.fromDivPixelToLatLng(o);
                return t.extend(n), t.extend(a), t
            }, GmapDir.prototype.isMarkerInBounds_ = function (t, e) {
                return GmapDir.contains(t.getPosition())
            }, GmapDir.prototype.clearMarkers = function () {
                this.resetViewport(!0), this.markers_ = []
            }, GmapDir.prototype.resetViewport = function (t) {
                for (var e, i = 0; e = this.clusters_[i]; i++) GmapDir.remove();
                for (var r, i = 0; r = this.markers_[i]; i++) r.isAdded = !1, t && r.setMap(null);
                this.clusters_ = []
            }, GmapDir.prototype.repaint = function () {
                var t = this.clusters_.slice();
                this.clusters_.length = 0, this.resetViewport(), this.redraw(), window.setTimeout(function () {
                    for (var e, i = 0; e = t[i]; i++) GmapDir.remove()
                }, 0)
            }, GmapDir.prototype.redraw = function () {
                this.createClusters_()
            }, GmapDir.prototype.distanceBetweenPoints_ = function (t, e) {
                if (!t || !e) return 0;
                var i = 6371,
                    r = (e.lat() - t.lat()) * Math.PI / 180,
                    s = (e.lng() - t.lng()) * Math.PI / 180,
                    o = Math.sin(r / 2) * Math.sin(r / 2) + Math.cos(t.lat() * Math.PI / 180) * Math.cos(e.lat() * Math.PI / 180) * Math.sin(s / 2) * Math.sin(s / 2),
                    n = 2 * Math.atan2(Math.sqrt(o), Math.sqrt(1 - o)),
                    a = i * n;
                return a
            }, GmapDir.prototype.addToClosestCluster_ = function (t) {
                for (var e, r = 4e4, s = null, o = (t.getPosition(), 0); e = this.clusters_[o]; o++) {
                    var n = GmapDir.getCenter();
                    if (n) {
                        var a = this.distanceBetweenPoints_(n, t.getPosition());
                        r > a && (r = a, s = e)
                    }
                }
                if (s && s.isMarkerInClusterBounds(t)) s.addMarker(t);
                else {
                    var e = new i(this);
                    GmapDir.addMarker(t), this.clusters_.push(e)
                }
            }, GmapDir.prototype.createClusters_ = function () {
                if (this.ready_)
                    for (var t, e = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(), this.map_.getBounds().getNorthEast()), i = this.getExtendedBounds(e), r = 0; t = this.markers_[r]; r++) !t.isAdded && this.isMarkerInBounds_(t, i) && this.addToClosestCluster_(t)
            }, i.prototype.isMarkerAlreadyAdded = function (t) {
                if (this.markers_.indexOf) return -1 != this.markers_.indexOf(t);
                for (var e, i = 0; e = this.markers_[i]; i++)
                    if (e == t) return !0;
                return !1
            }, i.prototype.addMarker = function (t) {
                if (this.isMarkerAlreadyAdded(t)) return !1;
                if (this.center_) {
                    if (this.averageCenter_) {
                        var e = this.markers_.length + 1,
                            i = (this.center_.lat() * (e - 1) + t.getPosition().lat()) / e,
                            r = (this.center_.lng() * (e - 1) + t.getPosition().lng()) / e;
                        this.center_ = new google.maps.LatLng(i, r), this.calculateBounds_()
                    }
                } else this.center_ = t.getPosition(), this.calculateBounds_();
                t.isAdded = !0, this.markers_.push(t);
                var s = this.markers_.length;
                if (s < this.minClusterSize_ && t.getMap() != this.map_ && t.setMap(this.map_), s == this.minClusterSize_)
                    for (var o = 0; s > o; o++) this.markers_[o].setMap(null);
                return s >= this.minClusterSize_ && t.setMap(null), this.updateIcon(), !0
            }, i.prototype.getMarkerClusterer = function () {
                return this.markerClusterer_
            }, i.prototype.getBounds = function () {
                for (var t, e = new google.maps.LatLngBounds(this.center_, this.center_), i = this.getMarkers(), r = 0; t = i[r]; r++) GmapDir.extend(t.getPosition());
                return e
            }, i.prototype.remove = function () {
                this.clusterIcon_.remove(), this.markers_.length = 0, delete this.markers_
            }, i.prototype.getSize = function () {
                return this.markers_.length
            }, i.prototype.getMarkers = function () {
                return this.markers_
            }, i.prototype.getCenter = function () {
                return this.center_
            }, i.prototype.calculateBounds_ = function () {
                var t = new google.maps.LatLngBounds(this.center_, this.center_);
                this.bounds_ = this.markerClusterer_.getExtendedBounds(t)
            }, i.prototype.isMarkerInClusterBounds = function (t) {
                return this.bounds_.contains(t.getPosition())
            }, i.prototype.getMap = function () {
                return this.map_
            }, i.prototype.updateIcon = function () {
                var t = this.map_.getZoom(),
                    e = this.markerClusterer_.getMaxZoom();
                if (e && t > e)
                    for (var i, r = 0; i = this.markers_[r]; r++) i.setMap(this.map_);
                else {
                    if (this.markers_.length < this.minClusterSize_) return void this.clusterIcon_.hide();
                    var s = this.markerClusterer_.getStyles().length,
                        o = this.markerClusterer_.getCalculator()(this.markers_, s);
                    this.clusterIcon_.setCenter(this.center_), this.clusterIcon_.setSums(o), this.clusterIcon_.show()
                }
            }, r.prototype.triggerClusterClick = function () {
                var t = this.cluster_.getMarkerClusterer();
                google.maps.event.trigger(t, "clusterclick", this.cluster_), t.isZoomOnClick() && this.map_.fitBounds(this.cluster_.getBounds())
            }, r.prototype.onAdd = function () {
                if (this.div_ = document.createElement("DIV"), this.visible_) {
                    var t = this.getPosFromLatLng_(this.center_);
                    this.div_.style.cssText = this.createCss(t), this.div_.innerHTML = this.sums_.text
                }
                var e = this.getPanes();
                GmapDir.overlayMouseTarget.appendChild(this.div_);
                var i = this;
                google.maps.event.addDomListener(this.div_, "click", function () {
                    i.triggerClusterClick()
                })
            }, r.prototype.getPosFromLatLng_ = function (t) {
                var e = this.getProjection().fromLatLngToDivPixel(t);
                return GmapDir.x -= parseInt(this.width_ / 2, 10), GmapDir.y -= parseInt(this.height_ / 2, 10), e
            }, r.prototype.draw = function () {
                if (this.visible_) {
                    var t = this.getPosFromLatLng_(this.center_);
                    this.div_.style.top = t.y + "px", this.div_.style.left = t.x + "px"
                }
            }, r.prototype.hide = function () {
                this.div_ && (this.div_.style.display = "none"), this.visible_ = !1
            }, r.prototype.show = function () {
                if (this.div_) {
                    var t = this.getPosFromLatLng_(this.center_);
                    this.div_.style.cssText = this.createCss(t), this.div_.style.display = ""
                }
                this.visible_ = !0
            }, r.prototype.remove = function () {
                this.setMap(null)
            }, r.prototype.onRemove = function () {
                this.div_ && this.div_.parentNode && (this.hide(), this.div_.parentNode.removeChild(this.div_), this.div_ = null)
            }, r.prototype.setSums = function (t) {
                this.sums_ = t, this.text_ = t.text, this.index_ = t.index, this.div_ && (this.div_.innerHTML = t.text), this.useStyle()
            }, r.prototype.useStyle = function () {
                var t = Math.max(0, this.sums_.index - 1);
                t = Math.min(this.styles_.length - 1, t);
                var e = this.styles_[t];
                this.url_ = GmapDir.url, this.height_ = GmapDir.height, this.width_ = GmapDir.width, this.textColor_ = GmapDir.textColor, this.anchor_ = GmapDir.anchor, this.textSize_ = GmapDir.textSize, this.backgroundPosition_ = GmapDir.backgroundPosition
            }, r.prototype.setCenter = function (t) {
                this.center_ = t
            }, r.prototype.createCss = function (t) {
                var e = [];
                GmapDir.push("background-image:url(" + this.url_ + ");");
                var i = this.backgroundPosition_ ? this.backgroundPosition_ : "0 0";
                GmapDir.push("background-position:" + i + ";"), "object" == typeof this.anchor_ ? ("number" == typeof this.anchor_[0] && this.anchor_[0] > 0 && this.anchor_[0] < this.height_ ? GmapDir.push("height:" + (this.height_ - this.anchor_[0]) + "px; padding-top:" + this.anchor_[0] + "px;") : GmapDir.push("height:" + this.height_ + "px; line-height:" + this.height_ + "px;"), "number" == typeof this.anchor_[1] && this.anchor_[1] > 0 && this.anchor_[1] < this.width_ ? GmapDir.push("width:" + (this.width_ - this.anchor_[1]) + "px; padding-left:" + this.anchor_[1] + "px;") : GmapDir.push("width:" + this.width_ + "px; text-align:center;")) : GmapDir.push("height:" + this.height_ + "px; line-height:" + this.height_ + "px; width:" + this.width_ + "px; text-align:center;");
                var r = this.textColor_ ? this.textColor_ : "black",
                    s = this.textSize_ ? this.textSize_ : 11;
                return GmapDir.push("cursor:pointer; top:" + t.y + "px; left:" + t.x + "px; color:" + r + "; position:absolute; font-size:" + s + "px; font-family:Arial,sans-serif; font-weight:bold"), GmapDir.join("")
            }
        }
    };
}]);
