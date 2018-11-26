function handleClick(e){
    console.log(e.currentTarget.attributes["data-index"].nodeValue);
    sessionStorage.setItem('article_id',e.currentTarget.attributes["data-index"].nodeValue);
    window.location.href = "../articleDetails/details.html";
}
window.onload = function(){
    //获取个人信息
    $.ajax({
        type: "post",
        url: "http://localhost:8888/owner/get",
        data: {

        },
        success: function(res){
            if(!res.error){
                console.log(res.result);
                let span = document.createElement('span');
                span.innerHTML = res.result[0].motto;
                document.getElementById('backbroad').appendChild(span);
                let li_1 = document.createElement('li');
                li_1.innerHTML = '姓名：' + res.result[0].name;
                let li_2 = document.createElement('li');
                li_2.innerHTML = '网名：' + res.result[0].nickname;
                let li_3 = document.createElement('li');
                li_3.innerHTML = '邮箱：' + res.result[0].email;
                let li_4 = document.createElement('li');
                li_4.innerHTML = '现居：' + res.result[0].address;
                let li_5 = document.createElement('li');
                li_5.innerHTML = '职业：' + res.result[0].job;
                let div_content = document.getElementsByClassName('content_f')[0];
                div_content.appendChild(li_1);
                div_content.appendChild(li_2);
                div_content.appendChild(li_3);
                div_content.appendChild(li_4);
                div_content.appendChild(li_5);
            }else{
                alert(res.result);
            }
        },
        error: function(res){
            alert("加载失败"+JSON.stringify(res));
        }
    });

    //获取精选文章
    $.ajax({
        type: "post",
        url: "http://localhost:8888/article/getgoodarticle",
        data: {

        },
        success: function(res){
            if(!res.error){
                console.log(res.result[0]);
                for(var j = 0;j<=1;j++) {
                    let content = res.result[j].articleContent;
                    var dd=content.replace(/<[^>]+>/g,"");//截取html标签
                    var dds=dd.replace(/&nbsp;/ig,"");//截取空格等特殊标签
                    content = dds.substring(0, 200);
                    content = content+'...';
                    var time = res.result[j].articleTime.split('T')[0];
                    var str = " <div class=\"art_1\">\n" +
                        "            <p data-index = \""+ res.result[j].articleId +"\" onclick=\"handleClick(event)\" class=\"title_1\">"+ res.result[j].articleTitle +"</p>\n" +
                        "            <img src=\"../img/blogbgs.png\" class=\"clubs\" />\n" +
                        "            <div class=\"essay\">"+ content +"</div>\n" +
                        "            <img src=\"../img/goodarticle1.jpg\" class=\"inset\" />\n" +
                        "            <div class=\"art_footer\">\n" +
                        "                <ul>\n" +
                        "                    <li>"+ time +"</li>\n" +
                        "                    <li>访问量(" + res.result[j].articleVisit + ")</li>\n" +
                        "                    <li>喜欢(" + res.result[j].articleLover + ")</li>\n" +
                        "                    <li>评论(" + res.result[j].articleWordsAmount + ")</li>\n" +
                        "                </ul>\n" +
                        "            </div>\n" +
                        "        </div>";
                    $(".articleD").append(str);
                    /*鼠标触摸事件*/
                    let article = document.getElementsByClassName('art_1');
                    for(let i=0;i<article.length;i++){
                        article[i].onmouseover = function(){
                            this.getElementsByClassName('clubs')[0].style.left = '500px';
                        };
                        article[i].onmouseout = function(){
                            this.getElementsByClassName('clubs')[0].style.left = '560px';
                        }
                    }
                    $(window.parent.document).find("#blog_").attr("height",1300);
                }
            }else{
                alert(res.result);
            }
        },
        error: function(res){
            alert("加载失败"+JSON.stringify(res));
        }
    });

    //获取最近的七篇文章
    $.ajax({
        type: "post",
        url: "http://localhost:8888/article/getrecentlyarticle",
        data: {

        },
        success: function(res){
            if(!res.error){
                let oTitle = "";
                for(let i=0;i<res.result.length;i++){
                    oTitle = oTitle +" <li data-index = \""+ res.result[i].articleId +"\" onclick=\"handleClick(event)\" >"+ res.result[i].articleTitle.substring(0, 15) +"</li>";
                }
                $('#list').append(oTitle);

                /*琴弦文字*/
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
                                // this.style.top = this.startTop + "px";//初始位置 + 差值
                                for(var j=0;j<aSpan.length;j++){
                                    starMove(aSpan[j],{top:aSpan[j].startTop},500,"elasticOut");
                                }
                            }
                        })(aSpan,j);
                    }
                }
            }else{
                alert(res.result);
            }
        },
        error: function(res){
            alert("加载失败"+JSON.stringify(res));
        }
    });

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

};