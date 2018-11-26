window.onload = function() {
    var storage=window.localStorage;
    // storage.removeItem("user");
    if(storage.user == 'true'){
        // alert('yes');
    }
    else{
        storage.user = false;
    }
    var logo = false;
    var user_id;
    //加载文章
    $.ajax({
        type: "post",
        url: "http://localhost:8888/article/getonetext",
        data: {
            id: sessionStorage.getItem("article_id")
        },
        success: function(res){
            if(!res.error){
                console.log(res.result);
                var navstr = "            <i class=\"fa fa-user-o\" aria-hidden=\"true\"></i>\n" +
                    "            <span>zhongqw</span>\n" +
                    "            <i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>\n" +
                    "            <span>"+ res.result[0].articleTime.split('T')[0] +"</span>\n" +
                    "            <i class=\"fa fa-eye\" aria-hidden=\"true\"></i>\n" +
                    "            <span>浏览量("+ res.result[0].articleVisit +")</span>\n" +
                    "            <i class=\"fa fa-comment-o\" aria-hidden=\"true\"></i>\n" +
                    "            <span>评论("+ res.result[0].articleWordsAmount +")</span>\n" +
                    "            <i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i>\n" +
                    "            <span>喜欢("+ res.result[0].articleLover +")</span>";
                $('#aside_nav').append(navstr);
                console.log(res.result.articleTime);
                $('#content').html(res.result[0].articleContent);
                $('#article_name').html(res.result[0].articleTitle);
                // alert($('#content').height());
                $(".article").height($('#content').height()+270);
                $("#details").height($("#words_content").height() + $(".article").height() + 100);
                var heig = $("#details").height()+ 320;
                $(window.parent.document).find("#blog_").attr("height",heig);
            }else{
                alert(res.result);
            }
        },
        error: function(res){
            alert("加载失败"+JSON.stringify(res));
        }
    });
    //加载评论
    $.ajax({
        type: "post",
        url: "http://localhost:8888/article/getwords",
        data: {
            id: sessionStorage.getItem("article_id")
        },
        success: function(res){
            if(!res.error){
                var j=0;
                if(res.result) {
                    while(j<res.result.length) {
                        let div1 = document.createElement('div');
                        let i = document.createElement('i');
                        let div2 = document.createElement('div');
                        let p = document.createElement('p');
                        let div3 = document.createElement('div');
                        let span1 = document.createElement('span');
                        let span2 = document.createElement('span');
                        div1.className = 'person_words';
                        div2.className = 'person_content';
                        p.innerHTML = res.result[j].wordsContent;
                        span1.innerHTML = res.result[j].wordsTime.split('T')[0];
                        span2.innerHTML = res.result[j].wordsPersonName;
                        div3.appendChild(span1);
                        div3.appendChild(span2);
                        div2.appendChild(p);
                        div2.appendChild(div3);
                        div1.appendChild(i);
                        div1.appendChild(div2);
                        if (res.result[j].wordsReply) {
                            let hr = document.createElement('hr');
                            let div4 = document.createElement('div');
                            div4.className = 'person_reply';
                            let span3 = document.createElement('span');
                            let span4 = document.createElement('span');
                            span3.innerHTML = '作者回复:';
                            span4.innerHTML = res.result[j].wordsReply;
                            div4.appendChild(span3);
                            div4.appendChild(span4);
                            div2.appendChild(hr);
                            div2.appendChild(div4);
                        }
                        document.getElementById('words_content').appendChild(div1);
                        j++;
                    }
                }
                // alert($("#words_content").height());
                $("#words").height($('#words_content').height()+270);
                $("#details").height($("#words_content").height() + $(".article").height()+200);
                var heig = $("#details").height()+ 320;
                $(window.parent.document).find("#blog_").attr("height",heig);
            }else{
            }
        },
        error: function(res){
            alert("加载失败"+JSON.stringify(res));
        }
    });

    //提交评论
    const publish = document.getElementById('publish');
    publish.onclick = function(){
        // console.log(storage.getItem('user')+storage.user_id);
        if(storage.getItem('user')=="true"){ //表示不是第一次登陆，所以直接将发言内容送到后台
            let str = document.getElementById('emojiInput').innerHTML;
            let imgReg = /<img.*?(?:>|\/>)/gi;
            let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
            let strResult = str.replace(imgReg,'emoji_'); //替换后的字符串
            let arrImg = str.match(imgReg); // arr为包含所有img标签的数组
            let srcArr = [];
            // for (let i = 0; i < arrImg.length; i++) {
            //     let src = arrImg[i].match(srcReg);
            //     srcArr[i] = src[1];
            // }
            // strResult：存放的替换后的字符串
            // srcArr[i]：存放所有的src
            // console.log(strResult);
            // for(i=0;i<arrImg.length;i++)
            //     console.log(srcArr[i]);
            $.ajax({
                type: "post",
                url: "http://localhost:8888/words/addarticlewords",
                data: {
                    wordsId: storage.user_id,
                    articleId: sessionStorage.getItem("article_id"),
                    wordsContent: strResult
                },
                success: function(res){
                    if(!res.error){
                        let div1 = document.createElement('div');
                        let i = document.createElement('i');
                        let div2 = document.createElement('div');
                        let p = document.createElement('p');
                        let div3 = document.createElement('div');
                        let span1 = document.createElement('span');
                        let span2 = document.createElement('span');
                        div1.className = 'person_words';
                        div2.className = 'person_content';
                        p.innerHTML = strResult;
                        span1.innerHTML = new Date().toLocaleString();
                        span2.innerHTML = document.getElementById('wordsName');
                        div3.appendChild(span1);
                        div3.appendChild(span2);
                        div2.appendChild(p);
                        div2.appendChild(div3);
                        div1.appendChild(i);
                        div1.appendChild(div2);
                        document.getElementById('words_content').appendChild(div1);
                        location.reload();
                        $("#words").height($("#words_content").height()+270);
                    }else{
                        alert(res.result);
                    }
                },
                error: function(res){
                    alert("加载失败"+JSON.stringify(res));
                }
            });
        }else{ //表示是第一次登陆，所以需要将err框显示
            // console.log(logo);
            $("#words").height($('#words_content').height()+490);
            $("#details").height($("#words_content").height() + $(".article").height()+420);
            document.getElementById('words_ifon').style.display = 'block';

        }
    };
    //提交信息
    const commit =  document.getElementById('commit');
    commit.onclick = function(){
        // console.log(document.getElementById('wordsName').value);
        $.ajax({
            type: "post",
            url: "http://localhost:8888/words/adduser",
            data: {
                wordsName: document.getElementById('wordsName').value,
                wordsEmail: document.getElementById('wordsEmail').value
            },
            success: function(res){
                if(!res.error){
                    user_id = res.result[0].wordsPersonId;
                    $("#words").height($('#words_content').height()+270);
                    $("#details").height($("#words_content").height() + $(".article").height()+200);
                    document.getElementById('words_ifon').style.display = 'none';
                    storage['user'] = 'true';
                    storage['user_id'] = user_id;
                    logo = true;
                    // console.log(user_id);
                }else{
                    alert(res.result);
                }
            },
            error: function(res){
                alert("加载失败"+JSON.stringify(res));
            }
        });
    };

    //ifream页面内部随着外部的滚动而改变top
    $(parent.window).scroll(function(){//外部窗口滚动时，把需要固定的元素的top值跟随改变;
        $('#btn_top').css({
            top : $(parent.window).scrollTop()+300
        });
    });
    //返回顶部和喜欢
    $("#topB").click(function(){
        console.log($('body,html'));
        // $('body,html').animate({scrollTop:0},1000);
        // iframe.contentWindow.window.scrollTo(0,0);
        parent.scrollTo(0,0);
    });
    $('#loveB').click(function(e){
        console.log(e.target);
        e.target.setAttribute('class',"fa fa-heart");
        e.target.style.color = '#FF69B4';
    });


    //生成表情
    var face = document.getElementById('face');
    var emoji =  document.getElementById('emoji');
    for(var i = 1; i < 76; i++) {
        var a = document.createElement("a");
        a.href = "javascript:;";
        if(i < 10) {
            a.innerHTML = '<img class="emojiSvg" src="./img/' + i + '.gif" alt="" />';
        } else {
            a.innerHTML = '<img class="emojiSvg" src="./img/' + i + '.gif" alt="" />';
        }
        face.appendChild(a);
    }
    face.onmouseleave = function(){
        face.style.display = 'none';
    };
    emoji.onclick = function(){
        face.style.display = 'block';
    };
};

//点击插入表情
setTimeout(function() {
    var pickers = face.getElementsByTagName('a');
    var emojiInput = document.getElementById('emojiInput');
    for(var i = 0; i < pickers.length; i++) {
        pickers[i].onclick = function(e) {
            document.getElementById('emojiInput').focus();
            insertHtmlAtCaret(this.innerHTML);
            //    emojiInput.innerHTML+=this.innerHTML;
        }
    }

    function insertHtmlAtCaret(html) {
        var sel, range;
        if(window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if(sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(),
                    node, lastNode;
                while((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                // Preserve the selection
                if(lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if(document.selection && document.selection.type !== "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }
}, 500);
