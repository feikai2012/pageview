/*
 * @Author: jones
 * @Date:   2017-02-10 19:00:58
 * @Last Modified by:   jones
 * @Last Modified time: 2017-02-10 19:00:58
 */
!(function($) {
    'use strict';

    var apkUrlWeixin = "http://a.app.qq.com/o/simple.jsp?pkgname=****",
        apkUrlWp = "http://www.windowsphone.com/zh-cn/store/app/***",
        apkUrlInit = 'http://ustatic.ufile.ucloud.com.cn/****.apk?t=' + parseInt(new Date().getTime() / 21600000),
        apkUrlAndroid = apkUrlInit,
        apkUrlIphone = "https://itunes.apple.com";
    var channel = GetQueryString("channel");

    var userAgent = navigator.userAgent.toLowerCase();

    var platform = {};
    if ((/iphone/i).test(userAgent) || (/ipad/i).test(userAgent) || (/ios/i).test(userAgent)) {
        platform.ios = true;
    } else if ((/windows phone/i).test(userAgent)) {
        platform.wp = true;
    } else {
        platform.web = true;
        $('.click_download').click(function() {
            window.location.href = apkUrlInit;
        });
    }

    var browser = {};
    if ((/micromessenger/i).test(userAgent)) {
        browser.wechat = true;
    } else if ((/kuaima/i).test(userAgent)) {
        browser.kuaima = true;
    }


    $(document).ready(function() {
        if (channel != "") {
            initApkUrls(channel);
        }

        updateOrientation();
        window.addEventListener("orientationchange", updateOrientation, false);

        $('.click_download').tap(function() {
            if (browser.wechat) {
                if (_hmt && channel != '') {
                    if ((/kuaima0/i).test(channel) || (/kuaimai0/i).test(channel)) {
                        _hmt.push(['_trackEvent', channel, 'click', 'wechat download']);
                    }
                }
                window.location.href = apkUrlWeixin;
            } else {
                window.location.href = platform.ios ? apkUrlIphone : apkUrlAndroid;
            }
            
        });
    });


    function initApkUrls(channel) {
        $.ajax({
            type: "GET",
            url: "http://alliance.etouch.cn/suishen_alliance/api/channel/resource/urls?callback=callbackUrls&channel=" + channel,
            dataType: "jsonp",
            jsonpCallback: "callbackUrls",
            success: function(data) {
                if (data) {
                    apkUrlAndroid = data.android == "" ? apkUrlInit : data.android;
                    apkUrlIphone = data.iphone == "" ? "https://itunes.apple.com/cn/app/****" : data.iphone;
                    apkUrlInit = data.initialization == "" ? apkUrlInit : data.initialization;
                    apkUrlWp = data.wp == "" ? "http://www.windowsphone.com/zh-cn/store/****" : data.wp;
                    var todownload = typeof(data.toDownload) == "undefined" ? 0 : data.toDownload;

                    //非快马浏览器，开启自动下载，三秒之后自动下载
                    if (todownload == 1 && !browser.kuaima) {
                        setTimeout(function() {
                            if (browser.wechat) {
                                if (_hmt) {
                                    if ((/kuaima0/i).test(channel) || (/kuaimai0/i).test(channel)) {
                                        _hmt.push(['_trackEvent', channel, 'auto', 'wechat auto download']);
                                    }
                                }
                                window.location.href = apkUrlWeixin;
                            } else {
                                window.location.href = platform.android ? apkUrlAndroid :
                                    platform.ios ? apkUrlIphone : apkUrlInit;
                            }
                        }, 3000);
                    }
                }

                if (platform.android) {
                    $("#apkUrlTop").attr("href", apkUrlAndroid);
                    $("#apkUrlBottom").attr("href", apkUrlAndroid);
                } else if (platform.ios) {
                    $("#apkUrlTop").attr("href", apkUrlIphone);
                    $("#apkUrlBottom").attr("href", apkUrlIphone);
                }
            }
        });
    }

    //获取url参数值
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    
})(window.jQuery || window.Zepto);
