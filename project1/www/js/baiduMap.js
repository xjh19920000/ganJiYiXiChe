/**
 *  A directive which helps you easily show a baidu-map on your page.
 *
 *
 *  Usages:
 *
 *      <baidu-map options='options'></baidu-map>
 *
 *      options: The configurations for the map
 *            .center.longitude[Number]{M}: The longitude of the center point
 *            .center.latitude[Number]{M}: The latitude of the center point
 *            .zoom[Number]{O}:         Map's zoom level. This must be a number between 3 and 19
 *            .navCtrl[Boolean]{O}:     Whether to add a NavigationControl to the map
 *            .scaleCtrl[Boolean]{O}:   Whether to add a ScaleControl to the map
 *            .overviewCtrl[Boolean]{O}: Whether to add a OverviewMapControl to the map
 *            .enableScrollWheelZoom[Boolean]{O}: Whether to enableScrollWheelZoom to the map
 *            .city[String]{M}:         The city name which you want to display on the map
 *            .markers[Array]{O}:       An array of marker which will be added on the map
 *                   .longitude{M}:                The longitude of the marker
 *                   .latitude{M}:                 The latitude of the marker
 *                   .icon[String]{O}:             The icon's url for the marker
 *                   .width[Number]{O}:            The icon's width for the icon
 *                   .height[Number]{O}:           The icon's height for the icon
 *                   .title[String]{O}:            The title on the infowindow displayed once you click the marker
 *                   .content[String]{O}:          The content on the infowindow displayed once you click the marker
 *                   .enableMessage[Boolean]{O}:   Whether to enable the SMS feature for this marker window. This option only available when title/content are defined.
 *
 *  @author      Howard.Zuo
 *  @copyright   Jun 9, 2015
 *  @version     1.2.0
 *
 *  @author fenglin han
 *  @copyright 6/9/2015
 *  @version 1.1.1
 *
 *  Usages:
 *
 *  <baidu-map options='options' ></baidu-map>
 *  comments: An improvement that the map should update automatically while coordinates changes
 *
 *  @version 1.2.1
 *  comments: Accounding to 史魁杰's comments, markers' watcher should have set deep watch equal to true, and previous overlaies should be removed
 *
 */
(function(global, factory) {
    'use strict';

    if (typeof exports === 'object') {
        module.exports = factory(require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else {
        factory(global.angular);
    }

}(window, function(angular) {
    'use strict';

    var checkMandatory = function(prop, desc) {
        if (!prop) {
            throw new Error(desc);
        }
    };

    var defaults = function(dest, src) {
        for (var key in src) {
            if (typeof dest[key] === 'undefined') {
                // console.log(dest[key])
                dest[key] = src[key];
            }
        }
    };

    var baiduMapDir = function() {

        // Return configured, directive instance

        return {
            restrict: 'E',
            scope: {
                'options': '='
            },
            link: function($scope, element, attrs) {

                var defaultOpts = {
                    navCtrl: true,
                    scaleCtrl: false,
                    overviewCtrl: false,
                    enableScrollWheelZoom: true,
                    zoom: 10
                };

                var opts = $scope.options;

                defaults(opts, defaultOpts);

                checkMandatory(opts.center, 'options.center must be set');
                checkMandatory(opts.center.longitude, 'options.center.longitude must be set');
                checkMandatory(opts.center.latitude, 'options.center.latitude must be set');
                //checkMandatory(opts.city, 'options.city must be set');

                // create map instance
                var map = new BMap.Map(element.find('div')[0],{enableMapClick:false});
                map.centerAndZoom("长沙",11);




                // 百度地图API功能（关键字提示输入）
                function G(id) {
                    return document.getElementById(id);
                }

                var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                    {"input" : "suggestId"
                        ,"location" : map
                    });
                ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
                    var str = "";
                    var _value = e.fromitem.value;
                    var value = "";
                    if (e.fromitem.index > -1) {
                        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    }
                    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                    value = "";
                    if (e.toitem.index > -1) {
                        _value = e.toitem.value;
                        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    }
                    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                    G("searchResultPanel").innerHTML = str;
                });
                var myValue;
                ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                    var _value = e.item.value;
                    myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                    setPlace();
                });
                function setPlace(){
                    map.clearOverlays();    //清除地图上所有覆盖物
                    function myFun(){
                        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                        map.centerAndZoom(pp, 18);
                        map.addOverlay(new BMap.Marker(pp));    //添加标注
                    }
                    var local = new BMap.LocalSearch(map, { //智能搜索
                        onSearchComplete: myFun
                    });
                    local.search(myValue);
                }

                //var gpsPoint = new BMap.Point(opts.center.longitude, opts.center.latitude);
                //var baiduCenterPoint = null;


                /* BMap.Convertor.translate(gpsPoint,0,function(point){
                 // init map, set central location and zoom level
                 baiduCenterPoint =  point;
                 map.centerAndZoom(point, opts.zoom);
                 search();
                 });*/



                if (opts.navCtrl) {
                    // add navigation control
                    map.addControl(new BMap.NavigationControl({
                        // 靠左上角位置
                        anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                        // LARGE类型
                        type: BMAP_NAVIGATION_CONTROL_SMALL,
                        // 启用显示定位
                        enableGeolocation: true
                    }));
                }
                if (opts.scaleCtrl) {
                    // add scale control
                    map.addControl(new BMap.ScaleControl());
                }
                if (opts.overviewCtrl) {
                    //add overview map control
                    map.addControl(new BMap.OverviewMapControl());
                }
                if (opts.enableScrollWheelZoom) {
                    //enable scroll wheel zoom
                    map.enableScrollWheelZoom();
                }

          /*      map.addEventListener("dragend", function(e){
                    var o_Point_now =  map.getCenter();
                    marker.setPosition(o_Point_now);
                    search();
                });*/

                var marker = new BMap.Marker();
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){

                        map.centerAndZoom(r.point, opts.zoom);

                        marker.setPosition(r.point);
                        marker.enableDragging();
                        /*marker.addEventListener("dragging",function(e){
                         var o_Point_now =  marker.getPosition();
                         map.centerAndZoom(o_Point_now, opts.zoom);
                         });*/
                        marker.addEventListener("dragend", function(e){
                            var center = map.getCenter();

                            //获取覆盖物位置

                            var o_Point_now =  marker.getPosition();

                            var lng = o_Point_now.lng;

                            var lat = o_Point_now.lat;

                            map.centerAndZoom(o_Point_now, opts.zoom);
                 //           search();
                    });
                        //}

                        // add marker to the map
                        map.addOverlay(marker);

                        $scope.$emit('loadMapDone');
          //              search();

                    }},{enableHighAccuracy: true});

                var geolocationCOntrol = new BMap.GeolocationControl({anchor:BMAP_ANCHOR_TOP_RIGHT,enableAutoLocation: true});
                map.addControl(geolocationCOntrol);

                geolocationCOntrol.addEventListener('locationSuccess', function(r){

                    console.log(r);
                    marker.setPosition(r.point);
                    $scope.$emit('loadMapStart');
    //                search();
                });

                // set the city name
                //map.setCurrentCity(opts.city);


                /* if (!opts.markers) {
                 return;
                 }
                 //create markers

                 var previousMarkers = [];*/

                /* var openInfoWindow = function(infoWin) {
                 return function() {
                 this.openInfoWindow(infoWin);
                 };
                 };*/

                /* var mark = function() {

                 var i = 0;

                 for (i = 0; i < previousMarkers.length; i++) {
                 previousMarkers[i].removeEventListener('click', openInfoWindow(infoWindow2));
                 map.removeOverlay(previousMarkers[i]);
                 }
                 previousMarkers.length = 0;

                 for (i = 0; i < opts.markers.length; i++) {

                 var marker = opts.markers[i];
                 var pt = new BMap.Point(marker.longitude, marker.latitude);

                 BMap.Convertor.translate(pt,0,function(pt){
                 var marker2;

                 marker = opts.markers[0];//强制所有图标一样
                 /*if (marker.icon) {
                 var icon = new BMap.Icon(marker.icon, new BMap.Size(marker.width, marker.height));
                 marker2 = new BMap.Marker(pt);
                 marker2.enableDragging();
                 } else {*/
                /*  marker2 = new BMap.Marker(pt);
                 marker2.enableDragging();
                 marker2.addEventListener("dragend", function(e){
                 var center = map.getCenter();

                 //获取覆盖物位置

                 var o_Point_now =  marker2.getPosition();

                 var lng = o_Point_now.lng;

                 var lat = o_Point_now.lat;

                 map.centerAndZoom(o_Point_now, opts.zoom);

                 search();
                 });
                 //}

                 // add marker to the map
                 map.addOverlay(marker2);
                 previousMarkers.push(marker2);

                 if (!marker.title && !marker.content) {
                 return;
                 }
                 var infoWindow2 = new BMap.InfoWindow('<p>' + (marker.title ? marker.title : '') + '</p><p>' + (marker.content ? marker.content : '') + '</p>', {
                 enableMessage: !!marker.enableMessage
                 });
                 //marker2.addEventListener('click', openInfoWindow(infoWindow2));
                 });

                 }


                 };*/
/*
                var addAddressToList = function(title,address,lat,lng){
                    var str = "<div class='item'><div class='item-content' onclick='angular.element(event.target).scope().setMap("+lat+","+lng+",\""+address+"\" )'><h2>"+title + "</h2><p>" + address+"</p></div></div>";
                    return str;
                }*/
            /*    var search = function(){
                    document.getElementById("r-result").innerHTML =" <button class=\"button button-clear\"><i class=\"icon ion-loading-c\"></i> 加载中，请稍候 </button>";
                    var options = {
                        onSearchComplete: function(results){
                            // 判断状态是否正确
                            document.getElementById("r-result").innerHTML ="";
                            if (local.getStatus() == BMAP_STATUS_SUCCESS){

                                var s = [];

                                var o_Point_now =  marker.getPosition();


                                s.push(addAddressToList('当前位置','当前点默认位置',o_Point_now.lng,o_Point_now.lat));
                                for(var j=0;j < results.length; j++){
                                    for (var i = 0; i < results[j].getCurrentNumPois(); i ++){
                                        var returnResult = new Object();
                                        returnResult = results[j].getPoi(i);

                                        s.push(addAddressToList(returnResult.title,returnResult.address,returnResult.point.lat,returnResult.point.lng));
                                    }
                                    document.getElementById("r-result").innerHTML = s.join("");
                                }
                            }
                        }
                    };
                    var myKeys = ["美食", "小区","超市","药店","银行","停车场","汽车"];
                    var local = new BMap.LocalSearch(map, options);
                    local.searchNearby(myKeys,marker.getPosition(),300);
                };
*/
                // mark();


                /*$scope.$watch('options.center', function(newValue, oldValue) {

                 opts = $scope.options;

                 BMap.Convertor.translate(new BMap.Point(opts.center.longitude, opts.center.latitude),0,function(point){
                 // init map, set central location and zoom level
                 map.centerAndZoom(point, opts.zoom);

                 // mark();
                 });



                 }, true);*/

                /*$scope.$watch('options.markers', function(newValue, oldValue) {
                 //mark();
                 }, true);*/

            },
            template: '<div style="width: 100%; height: 100%;"></div>'
        };
    };

    var baiduMap = angular.module('starter.directive', []);
    baiduMap.directive('baiduMap', [baiduMapDir]);
}));