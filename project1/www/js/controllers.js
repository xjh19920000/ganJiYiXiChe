angular.module('starter.controllers', ['ionic','ngCordova'])
    
    //二级菜单隐藏底部栏（ion-tabs）
 .directive('hideTabs', function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                scope.$on('$ionicView.beforeEnter', function() {
                    scope.$watch(attributes.hideTabs, function(value){
                        $rootScope.hideTabs = value;
                    });
                });

                scope.$on('$ionicView.beforeLeave', function() {
                    $rootScope.hideTabs = false;
                });
            }
        };
    })

.controller('GuidePageCtrl', function($scope, $ionicModal, $state, $timeout) {
        $scope.guideFlag = 'a';
        $scope.guideSure = function () {
            $state.go('tab.home');
            window.localStorage['first'] = '1';
        };

        $scope.onSwipeLeft = function () {
            var obj = document.getElementById('guide-wrapper');
            var ulObj = document.getElementById('guide-arrow');
            var w = obj.children[0].offsetWidth;
            var totalW = w * (obj.children.length - 1);
            var totalWe = w * (obj.children.length - 2)
            if (Math.abs(obj.dataset.value) >= totalW) {
                return;
            }
            ;
            if (Math.abs(obj.dataset.value) >= totalWe) {
                $scope.guideFlag = 'b';
            }
            ;
            var g = obj.dataset.value - w;
            obj.style.webkitTransform = 'translateX(' + g + 'px)' + 'translateZ(0)';
            obj.style.transform = 'translateX(' + g + 'px)' + 'translateZ(0)';
            ulObj.children[Math.abs(g / w) - 1].className = '';
            ulObj.children[Math.abs(g / w)].className = 'active';
            obj.dataset.value = g;
        };

        $scope.onSwipeRight = function () {
            $scope.guideFlag = 'a';
            var obj = document.getElementById('guide-wrapper');
            var w = obj.children[0].offsetWidth;
            var totalW = w * (obj.children.length - 1);
            if (Math.abs(obj.dataset.value) == 0) {
                return;
            }
            ;
            var g = parseInt(obj.dataset.value) + parseInt(w);
            obj.style.webkitTransform = 'translateX(' + g + 'px)' + 'translateZ(0)';
            obj.style.transform = 'translateX(' + g + 'px)' + 'translateZ(0)';
            $timeout(function () {
                var ulObj = document.getElementById('guide-arrow');
                ulObj.children[Math.abs(g / w) + 1].className = '';
                ulObj.children[Math.abs(g / w)].className = 'active';
                if (Math.abs(g / w) == ulObj.children.length - 2) {
                    ulObj.children[0].className = '';
                }
            });
            obj.dataset.value = g;
        };
    })

.controller('HomeCtrl', ['$scope', 'Places','$state','PackageInfo',function($scope, Places,$state,PackageInfo) {
		$scope.places = Places;
        $scope.packageInfos=PackageInfo.all();

        $scope.doRefresh = function () {
            $scope.$broadcast("scroll.refreshComplete");
        }

        $scope.goDiscountPackage=function(){
            $state.go('home.discountPackage');
        }

   
 }
])
 .controller('DiscountPackageCtrl', function($scope, $stateParams, PackageInfo,$state) {
        $scope.packageInfo = PackageInfo.get($stateParams.packageInfoId);
        $scope.goBuyNow=function(){
            $state.go('home.buyNow');
        }
    })

 .controller('BuyNowCtrl', function($scope, $stateParams, PackageInfo) {
        $scope.packageInfo = PackageInfo.get($stateParams.packageInfoId);
    })

.controller('OrderCtrl', function($ionicLoading,$scope,$timeout,MapService,$ionicHistory,BMap) {
        $ionicLoading.show({
            template: '定位中，请稍候...',duration:5000
        });

      /*  function initdata(){ //页面初始化
            if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(showPosition,showError);//HTML5获取GPS设备地理位置信息
            }else{
                document.getElementById("mapView").innerHTML="Geolocation is not supported by this browser.";
            }
        }*/
        function showPosition(position){
            var x=position.coords.latitude;//获取纬度
            var y=position.coords.longitude;//获取经度
            //转为百度地图坐标
            //注意点：1、coords的经度、纬度顺序（可多组坐标转换，以；（分号）隔开）。2、from与to的准确性。3、callback为回调函数
            var positionUrl = "http://api.map.baidu.com/geoconv/v1/?cords="+y+","+x+"&from=1&to=5&ak=kCFolSujTRu27ZHTqNWHandN&callback=getMap";
            var script = document.createElement('script');
            script.src = positionUrl;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        function getMap(data){
            //返回的状态码，0为正常；1为内部错误；21为from非法；22为to非法；24为coords格式非法；25为coords个数非法，超过限制
            if(data.status!=0){
                alert("地图坐标转换出错");
                return ;
            }
            //result为数组
            var result = data.result;
            var lon = result[0].x;//经度
            var lat = result[0].y;//纬度

            // 百度地图API功能
            var map = new BMap.Map("mapView");            // 创建Map实例
            var point = new BMap.Point(lon,lat);
            map.centerAndZoom(point, 14);
            map.addControl(new BMap.ZoomControl());          //添加地图缩放控件
            var marker1 = new BMap.Marker(point);  // 创建标注
            map.addOverlay(marker1);              // 将标注添加到地图中
            //创建信息窗口
            var infoWindow1 = new BMap.InfoWindow("您当前所处的位置,经度:"+lon+";纬度:"+lat);
            marker1.addEventListener("click", function(){this.openInfoWindow(infoWindow1);});
        }
        //HTML5获取地理位置信息错误处理
        function showError(error)
        {
            switch(error.code)
            {
                case error.PERMISSION_DENIED:
                    document.getElementById("allmap").innerHTML="User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    document.getElementById("allmap").innerHTML="Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    document.getElementById("allmap").innerHTML="The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    document.getElementById("allmap").innerHTML="An unknown error occurred."
                    break;
            }
        }

       /* $scope.markerAdded = false;
        $scope.defMarker = false;
        $scope.loadXY = false;
        var posOptions = {timeout: 10000, enableHighAccuracy: true};

        $scope.setMap = function(lat,lng,address){
            MapService.lat = lat;
            MapService.lng = lng;
            MapService.address = address;
            $ionicHistory.goBack();
        }

        $scope.mapOptions = {
            center: {
                longitude: 121.506191,
                latitude: 31.245554
            },
            zoom: 15,
            city: 'ShangHai',
            markers: [
                {
                    longitude: 121.506191,
                    latitude: 31.245554,
                    icon: 'img/mappiont.png',
                    width: 32,
                    height: 32,
                    title: 'Where',
                    content: 'Put description here'
                }
            ]
        };*/
        $scope.$on('loadMapDone', function(event, mass) {
            $ionicLoading.hide();
        });
    })

.controller('TaskCtrl', function($scope) {})

.controller('MyCtrl', function($scope) {});