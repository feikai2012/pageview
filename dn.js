/*
 * @Author: tanbei
 * @Date:   2016-07-27 10:56:58
 * @Last Modified by:   tanbei
 * @Last Modified time: 2016-07-27 11:18:01
 */
!(function($) {
    'use strict';

    var apkUrlWeixin = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.etouch.ecalendar&g_f=991649&ssy_action=zhwnl-cn-mobile",
        apkUrlWp = "http://www.windowsphone.com/zh-cn/store/app/%E4%B8%AD%E5%8D%8E%E4%B8%87%E5%B9%B4%E5%8E%86/b9cbc8c3-c2a5-4744-9d8e-a2169d5abc4f",
        apkUrlInit = 'http://ustatic.ufile.ucloud.com.cn/zhwnl-latest_2016051674181.apk?t=' + parseInt(new Date().getTime() / 21600000),
        apkUrlAndroid = apkUrlInit,
        apkUrlIphone = "https://lnk0.com/IRBtgk";
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
            //window.location.href = 'https://lkme.cc/KrC/MYALcGFF9';
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
                    apkUrlIphone = data.iphone == "" ? "https://itunes.apple.com/cn/app/zhong-hua-wan-nian-li-ri-li/id494776019?mt=8" : data.iphone;
                    apkUrlInit = data.initialization == "" ? apkUrlInit : data.initialization;
                    apkUrlWp = data.wp == "" ? "http://www.windowsphone.com/zh-cn/store/app/%E4%B8%AD%E5%8D%8E%E4%B8%87%E5%B9%B4%E5%8E%86/b9cbc8c3-c2a5-4744-9d8e-a2169d5abc4f" : data.wp;
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

    //不知道为什么放在这个文件里面，跟下载无关的代码。。。。
    var updateOrientation = function() {
        var orientation = window.orientation;
        switch (orientation) {
            case 90:
                $('.mask').show();
                break;
            case -90:
                $('.mask').show();
                break;
            default:
                $('.mask').hide();
                break;
        }
    };
})(window.jQuery || window.Zepto);
