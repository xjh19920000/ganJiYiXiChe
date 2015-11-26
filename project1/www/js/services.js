angular.module('starter.services', [])

.factory('Places', function() {
   return [{
       place: '北京'
   }, {
       place: '上海'
   }, {
       place: '武汉'
   }, {
       place: '深圳'
   }, {
       place: '广州'
   },{
       place: '广西'
   }, {
       place: '南京'
   }]
})
.factory('PackageInfo',function(){
    var packageInfos = [{
        id: 0,
        img: 'img/home/q.png',
        text: '洗车+打蜡套餐'
    }, {
        id: 1,
        img: 'img/home/s.png',
        text: '内饰深清套餐'
    }, {
        id: 2,
        img: 'img/home/t.png',
        text: '打蜡去虫胶套餐'
    }, {
        id: 3,
        img: 'img/home/w.png',
        text: '去虫胶套餐'
    }];
    return {
        all: function() {
            return packageInfos;
        },
        remove: function(packageInfo) {
            packageInfos.splice(packageInfos.indexOf(packageInfo), 1);
        },
        get: function(packageInfoId) {
            for (var i = 0; i < packageInfos.length; i++) {
                if (packageInfos[i].id === parseInt(packageInfoId)) {
                    return packageInfos[i];
                }
            }
            return null;
        }
    };
})

    .service('MapService',function() {
        var service = {
            lat: 0,
            lng: 0,
            address: '您当前位置'
        }
        return service;
    })
