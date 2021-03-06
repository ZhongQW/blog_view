window.onload = function()
{
    var oList = document.getElementById('list');
    var oLis = oList.getElementsByTagName('li');
    var aLiHeight = oLis[0].offsetHeight;
    for(var i=0;i<oLis.length;i++)
    {
        var sHtml = oLis[i].innerHTML;
        oLis[i].innerHTML = "";
        for(var j=0;j<sHtml.length;j++)
        {
            //将每一个文字都变为<span>文字</span>
            oLis[i].innerHTML += "<span>"+sHtml[j]+"</span>"
        }
        var aSpan = oLis[i].childNodes;
        for(var j=0;j<aSpan.length;j++)
        {
            aSpan[j].style.left = aSpan[j].offsetLeft+"px";
            aSpan[j].style.top = aSpan[j].offsetTop+"px";
            aSpan[j].startTop = aSpan[j].offsetTop;
        }
        for(var j=0;j<aSpan.length;j++)
        {
            aSpan[j].style.position = "absolute";
            (function(aSpan,num2){
                var iStart = 0;//元素起始位置
                var aSpanHeight = aSpan[0].offsetHeight;
                aSpan[num2].onmouseover = function(e)
                {
                    iStart = e.clientY; // span 的初始位置
                };
                aSpan[num2].onmousemove = function(e)
                {
                    var iDis = e.clientY - iStart; //需要移动的距离：鼠标移动和初始值的差
                    var iNum = iDis>0?1:-1;//小于0时，表示向上移动；大于0时，向下移动
                    var moveY = this.startTop + iDis; //当前距离 li 顶部的距离：移动的距离 + 距离 li 顶部的距离，当向上移动时为负，向下移动时为正
                    var moveYDist2 = aLiHeight - aSpanHeight; // 除去 span 的高度，li 的高度 - span 的高度
                    if(moveY >= 0 && moveY < moveYDist2 ) { //span距离li的距离不能小于0，span距离li

                        for(var j=0;j<aSpan.length;j++) {

                            if (Math.abs(iDis) > Math.abs(num2 - j)) { //当第j个元素与第num2的位置相差 < iDist时，便移动
                                aSpan[j].style.top = aSpan[j].startTop + (Math.abs(iDis) - Math.abs(num2 - j)) * iNum + "px";
                            }else{ //当第j个元素与第num2的位置相差 > iDist时，便不再移动，让元素保持最初状态
                                aSpan[j].style.top = aSpan[j].startTop + "px";
                            }
                        }
                    }
                };
                aSpan[num2].onmouseout = function(e)
                {
                    for(var j=0;j<aSpan.length;j++){
                        starMove(aSpan[j],{top:aSpan[j].startTop},500,"elasticOut");
                    }
                }
            })(aSpan,j);
        }
    }
    function animate(obj, json, interval, sp, fn) {
        clearInterval(obj.timer);
        function getStyle(obj, arr) {
            if(obj.currentStyle){
                return obj.currentStyle[arr];  //针对ie
            } else {
                return document.defaultView.getComputedStyle(obj, null)[arr];
            }
        }
        obj.timer = setInterval(function(){
            //j ++;
            var flag = true;
            for(var arr in json) {
                var icur = 0;
                //k++;
                if(arr == "opacity") {
                    icur = Math.round(parseFloat(getStyle(obj, arr))*100);
                } else {
                    icur = parseInt(getStyle(obj, arr));
                }
                var speed = (json[arr] - icur) * sp;
                speed = speed > 0 ? Math.ceil(speed): Math.floor(speed);
                if(icur != json[arr]){
                    flag = false;
                }
                if(arr == "opacity"){
                    obj.style.filter = "alpha(opacity : '+(icur + speed)+' )";
                    obj.style.opacity = (icur + speed)/100;
                }else {
                    obj.style[arr] = icur + speed + "px";
                }
            }

            if(flag){
                clearInterval(obj.timer);
                if(fn){
                    fn();
                }
            }
        },interval);
    }

}