//self.moveTo(0,0);
//self.resizeTo(screen.availWidth,screen.availHeight);
var onm = 0; //鼠标按键状态 0是无按键，1是鼠标右键
var x = 0;
var y = 0;
var pagewrite = ""; //签名内容
var ones = 1; //起笔状态
var ispad = 0; //0为pc机，1为pad
var lineWidth = 20;
var beforePage = -1;
var beforePageName = "page";
var pageString = ""
var isClearFlag = false

/***********************************************
 ******************获取http对象*******************
 ************************************************/
function gethttps() {
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

/***********************************************
 ******************获取url变量*******************
 ************************************************/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = location.search.substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}

//获取地址栏指定参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

/***********************************************
 *******************笔迹坐标获取******************
 ************************************************/
function mouseCoords(ev, page) {
    if (ev.offsetX || ev.offsetY) {
        return { x: ev.offsetX, y: ev.offsetY };
    }
    return {
        x: ev.layerX - document.getElementById("page" + page).offsetLeft,
        y: ev.layerY - document.getElementById("page" + page).offsetTop
    };
}

/***********************************************
 ************判断浏览器是否支持html5*************
 ************************************************/

function checkobj() {
    try {
        var b = document.getElementById("page");
        var cxtb = b.getContext("2d");
    } catch (e) {
        document.getElementById("div_book").innerHTML = "您的浏览器还不支持html5，请更换浏览器再试";
        return false;
    }
}

/***********************************************
 ********************初始化对象*****************
 ************************************************/

function init(filename, pagenum) {
    var filename = "pg"; //getUrlParam("FileName");
    var pagenum = 1; //getUrlParam("PageNum");
    var htmlcaons = "";
    for (var i = 0; i < pagenum; i++) {
        htmlcaons += "<canvas id='page" + i + "' width='793.8' height='1160' onmouseout='onm=0;' onmousedown='onm=1;' onmouseup='mup()' onmousemove='sign(event," + i + ")'></canvas>";
    }
    document.getElementById("div_book").innerHTML = htmlcaons;
    for (var i = 0; i < pagenum; i++) {
        var cname = "page" + i;
        var asd = new CanvasDrawr({ id: cname, size: 2 });
        console.log(asd)
        showtxt(i);
        //  showbook(filename, i);
        if (!isClearFlag) {
            setTimeout('initCanvasWithData()', 1000)
        }
    }
}

/***********************************************
 ***************设置预设显示内容*****************
 ************************************************/

function showtxt(page) {
    var b = document.getElementById("page" + page);
    console.log(b);
    var cxtb = b.getContext("2d");
    cxtb.font = "60px impact";
    cxtb.fillStyle = "#CCCCCC";
    cxtb.textAlign = "center";
//     cxtb.fillText('努力加载中。。。', 450, 500, 400);
    cxtb.lineWidth = lineWidth;
    cxtb.restore();
    cxtb.closePath();
}

/***********************************************
 ***************设置显示文档内容*****************
 ************************************************/

function showbook(filename, page) {
    //   var img2 = new Image();
    // img2.src = "./img/circle.png";
    // // console.log(book.src)
    // var div = document.createElement('div');
    // // div.innerHTML = '<img src="/img/circle.png" class="imgSize" onclick="Resetsign()">';
    // div.className = "otherBac";
    // var div2 = document.createElement('div');
    // div2.className = "resign";
    // div2.innerText = "重新签名";
    // div.appendChild(img2);
    // div.appendChild(div2);
    // div.onload = function() {
    //     var b = document.getElementById("page" + page);
    //     var cxtb = b.getContext("2d");
    //     cxtb.lineWidth = lineWidth;
    //     cxtb.drawImage(book, 0, 0, 930, 1440);
    // }
    var book = new Image();
    book.src = "./img/" + filename + "_" + page + ".png";
    book.onload = function() {
        var b = document.getElementById("page" + page);
        var cxtb = b.getContext("2d");
        cxtb.lineWidth = lineWidth;
        cxtb.drawImage(book, 0, 0, 930, 1440);
    }
}

/***********************************************
 *******************手写笔迹******************
 ************************************************/

function sign(ev, page) {
    ev = ev || window.event;
    var mousePos = mouseCoords(ev, page);
    if (onm == 1) {
        var b = document.getElementById("page" + page);
        var cxtb = b.getContext("2d");
        cxtb.strokeStyle = "#FF0000";
        cxtb.lineWidth = lineWidth;
        cxtb.miterLimit = 0;
        x = Math.round(mousePos.x);
        y = Math.round(mousePos.y);
        if (ones == 1) {
            cxtb.moveTo(x, y);
            if (beforePage == page) {
                pagewrite += "(" + x + "," + y + "," + cxtb.lineWidth + ";";
            } else {
                if (pagewrite == "") {
                    pagewrite += "<" + page + "," + document.getElementById("page" + page).width + "," + document.getElementById("page" + page).height + "," + cxtb.strokeStyle + "(" + x + "," + y + "," + cxtb.lineWidth + ";";
                } else {
                    pagewrite += "><" + page + "," + document.getElementById("page" + page).width + "," + document.getElementById("page" + page).height + "," + cxtb.strokeStyle + "(" + x + "," + y + "," + cxtb.lineWidth + ";";
                }
            }
        } else {
            pagewrite += x + "," + y + "," + cxtb.lineWidth + ";";
        }
        if (ispad == 0) {
            cxtb.lineTo(x, y);
            cxtb.stroke();
            ones = 0;
        }
        beforePage = page;
    } else {
        x = 0;
        y = 0;
    }
}

/***********************************************
 *******************落笔结束********************
 ************************************************/

function mup() {
    onm = 0;
    ones = 1;
    pagewrite += ")";
}

/***********************************************
 *******************保存笔迹******************
 ************************************************/

function Save() {
    console.log("s")
    if (pagewrite == "") {
        alert("请您签名！")
        return
    }
    pagewrite = pagewrite + ")>";
    pagewrite = pagewrite.replace("))", ")");
    pagewrite = pagewrite.replace("()", "");
    document.getElementById("biji").value = pagewrite;
    var postStr = "SIGN=" + pagewrite + "&tmp=" + Math.random();
    if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
        //非小程序端
        console.log(postStr)
    } else {
        //小程序端
        var msg = "您是否确认提交？";
        if (confirm(msg) == true) {
            var messagePostStr = postStr
            wx.miniProgram.postMessage({
                data: {
                    message: messagePostStr
                }
            })
            wx.miniProgram.navigateBack()
        } else {

        }
    }
}

/**
 * 重写
 */
function clearPageString() {
    isClearFlag = true
    pagewrite = ""
    beforePage = -1;
    init()
        // window.location.reload()
}

/**
 * 如果签名存在，着将原来签名画出
 */
function initCanvasWithData() {
    pageString = getQueryString("page")
    if (pageString != undefined && pageString != null && pageString != "") {
        beforePage = 0
        pageString = pageString.replace(/SIGN=/g, "")
        pageString = pageString.split("&tmp=")[0]
        pagewrite = pageString
        pageAray = pageString.split("#ff0000")
        console.log(pagewrite)
        let pageArayInfoNew = pageAray[1].split("\)")
        var c = document.getElementById("page0");
        var ctx = c.getContext("2d");
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = lineWidth;
        ctx.miterLimit = 0;
        console.log(pageArayInfoNew)
        for (var j = 0; j < pageArayInfoNew.length; j++) {
            let pageArayInfoNewInfo = pageArayInfoNew[j]
            let pageArayInfo = pageArayInfoNewInfo.split(";")
            var info0 = pageArayInfo[0]
            info0 = info0.replace(/</g, "")
            info0 = info0.replace(/>/g, "")
            info0 = info0.replace(/\(/g, "")
            info0 = info0.replace(/\)/g, "")
            let infoArray0 = info0.split(",")
            ctx.moveTo(parseInt(infoArray0[0]), parseInt(infoArray0[1]))
            for (var i = 1; i < pageArayInfo.length - 1; i++) {
                var info1 = pageArayInfo[i]
                info1 = info1.replace(/</g, "")
                info1 = info1.replace(/>/g, "")
                info1 = info1.replace(/\(/g, "")
                info1 = info1.replace(/\)/g, "")
                let infoArray1 = info1.split(",")
                ctx.lineTo(parseInt(infoArray1[0]), parseInt(infoArray1[1]))
            }
        }
        ctx.stroke()
    }
}
