require([
  "esri/map", 
  "esri/geometry/Point", 
  "esri/symbols/SimpleMarkerSymbol", 
  "esri/graphic", 
  "dojo/_base/array", 
  "dojo/dom-style", 
  "esri/symbols/PictureMarkerSymbol", 
  "esri/geometry/webMercatorUtils", 
  "extra/AMD_ClusterNode", 
  "dojox/layout/FloatingPane",
  "dojo/domReady!"
  ], 
  function(
    Map, 
    Point, 
    SimpleMarkerSymbol, 
    Graphic, 
    arrayUtils, 
    domStyle, 
    PictureMarkerSymbol, 
    webMercatorUtils, 
    ClusterNode,
    FloatingPane
    ) {
    map = new Map("map", {
        basemap: "oceans",
        center: [20, 44],
        zoom: 6,
        minZoom: 2
    });
    map.on("load", mapLoaded);

    function mapLoaded() {
        //points to create a agraphics
        var points = [
            [19.82, 41.33],
            [16.37, 48.21],
            [18.38, 43.85],
            [23.32, 42.7],
            [16, 45.8],
            [19.08, 47.5],
            [12.48, 41.9],
            [21.17, 42.67],
            [21.43, 42],
            [19.26, 42.44],
            [26.1, 44.43],
            [12.45, 43.93],
            [20.47, 44.82],
            [11.387, 44.723],
            [14.155, 44.158]
        ];
        // create the graphics 
        arrayUtils.forEach(points, function(point) {
            var graphic = new Graphic(new Point(point), createSymbol(40, 40));
            map.graphics.add(graphic);
        });
        // add click event to graphics
        map.graphics.on('click', function() {

            pFloatingPane = new FloatingPane({
            title: "A floating pane",
            resizable: true, dockable: true,
            style: "position:absolute;top:0;left:0;width:100px;height:100px;visibility:hidden;",
            id: "pFloatingPane"
          }, dojo.byId("map"));

            pFloatingPane.startup();

        });
    }
    // convert the svg to a url encoded
    function convertSVGToDataURL(SVG_Element) {
        var _svg = SVG_Element;
        var _svgSerialized = new XMLSerializer().serializeToString(_svg);
        var encodedData = 'data:image/svg+xml;base64,' + window.btoa(_svgSerialized);
        return encodedData;
    }
    // data to constract the clusters
    var singlesArray = [{
        jobType: 'inspection'
    }, {
        jobType: 'inspection'
    }, {
        jobType: 'inspection'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'wellServices'
    }, {
        jobType: 'inspection'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'maintinance'
    }, {
        jobType: 'wellServices'
    }, {
        jobType: 'wellServices'
    }, {
        jobType: 'fieldService'
    }];
    // create a picture marker symbol
    function createSymbol(w, h) {
        cn = new ClusterNode(singlesArray, w, h);
        var markerSymbol = new esri.symbol.PictureMarkerSymbol({
            "angle": 0,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriPMS",
            "url": convertSVGToDataURL(cn.createClusterNode()),
            "contentType": "image/svg+xml",
            "width": w,
            "height": h
        });
        return markerSymbol;
    }
});