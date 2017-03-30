var page = require('webpage').create(),
    fs = require('fs'),
    keyword = require('system'),
    d = new Object(),
    setAll,
    name,
    wd;
if (keyword.args.length === 1 && keyword.args.length === 2) {
    console.log("请输入关键字和设备名称");
    phantom.exit(1);
} else {
    wd = keyword.args[1];
    name = keyword.args[2];
    var t = Date.now();
    var file = fs.open('config.txt', 'r');
    var txt = file.read().split(/[\r\n]/);
    file.close();
    for (var j = 0; j < txt.length; j++) {
        setAll = txt[j].split(name).length > 1 ? txt[j].split(',') : "";
        if (setAll !== "") {
            break;
        }
    }
    page.settings.userAgent = setAll.ua;
    page.viewportSize = {
        width: setAll.width,
        height: setAll.height
    };
    page.open('https://www.baidu.com/s?wd=' + wd, function (status) {//打开页面

        if (status !== 'success') {
            d.code = 0;
            d.msg = "抓取失败";
            d.word = wd;
            t = Date.now() - t;
            d.time = t;
            console.log(JSON.stringify(d));
        }
        else {
            t = Date.now();
            console.log(page.evaluate(function (d,t,wd,name) {
                d.code = 1;
                d.msg = "抓取成功";
                d.word = wd;
                d.time = t;
                d.Device = name;
                var c = document.getElementById('content_left');
                var items = c.querySelectorAll('.result.c-container ');
                var dataLists = [];
                d.dataLists = dataLists;
                for (var i = 0; i < items.length; i++) {
                    var h1 = items[i].childNodes[0].firstChild.innerHTML;
                    h1 = h1.replace(/<em>|<\/em>|<span.*>|<\/span>/g, "");

                    var info1 = items[i].querySelectorAll('.c-abstract')[0].innerHTML;
                    info1 = info1.replace(/<em>|<\/em>|<span.*>|<\/span>/g, "");

                    var link1 = items[i].querySelector('a').href;

                    var pic1 = items[i].querySelector('img')?items[i].querySelector('img').src:"";

                    dataLists.push({ title: h1, info: info1, link: link1, pic: pic1 });
                }
                t = Date.now() - t;
                return JSON.stringify(d);
            },d,t,wd,name));
        }
        phantom.exit();
    });
}
