/*
    Create by WebStorm.
    User: ZhongQw
    Date: 2018/10/19
    Time: 17:40
*/
window.onload = function() {
    var logo = false;
    //加载留言
    $.ajax({
        type: "post",
        url: "http://localhost:8888/words/getblogwords",
        data: {
        },
        success: function(res){
            if(!res.error){
                for(let j=0;j<res.result.length;j++){
                    let reply = '';
                    if(res.result[j].wordsReply)
                        reply = "                <div class=\"reply text\">\n" +
                            "                    <span class=\"wordsName\">作者回复：</span>\n" +
                            "                    <span class=\"reply\">"+ res.result[j].wordsReply +"</span>\n" +
                            "                </div>";
                    let str = "        <li>\n" +
                        "            <div class=\"box\">\n" +
                        "                <div class=\"pic\"></div>\n" +
                        "                <div class=\"ico\"></div>\n" +
                        "                <div class=\"content text\">\n" +
                        "                    <span class=\"wordsName\">"+ res.result[j].wordsPersonName +"留：</span>\n" +
                        "                    <span class=\"content\">"+ res.result[j].wordsContent +"</span>\n" +
                        "                    <span class=\"wordsTime\">"+ res.result[j].wordsTime +"留言</span>\n" +
                        "                </div>"+ reply +"</div></li>";
                    $("#messageList").append(str);
                }
                $("#messageList").height($("#words_content").height()+270);
            }else{
                alert(res.result);
            }
        },
        error: function(res){
            alert("加载失败"+JSON.stringify(res));
        }
    });


    //提交评论
    const publish = document.getElementById('publish');
    publish.onclick = function(){
        if(logo){ //表示不是第一次登陆，所以直接将发言内容送到后台
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
            console.log(user_id);
            console.log(strResult);
            $.ajax({
                type: "post",
                url: "http://localhost:8888/words/addblogwords",
                data: {
                    user_id: user_id,
                    wordsContent: strResult
                },
                success: function(res){
                    if(!res.error){
                        let str = "        <li>\n" +
                            "            <div class=\"box\">\n" +
                            "                <div class=\"pic\"></div>\n" +
                            "                <div class=\"ico\"></div>\n" +
                            "                <div class=\"content text\">\n" +
                            "                    <span class=\"wordsName\">"+ document.getElementById('wordsName').value +"</span>\n" +
                            "                    <span class=\"content\">"+ document.getElementById('wordsEmail').value +"</span>\n" +
                            "                    <span class=\"wordsTime\">"+ new Date().toLocaleDateString() +"留言</span>\n" +
                            "                </div>\n" +
                            "            </div>\n" +
                            "        </li>";
                        document.getElementById('messageList').append(str);
                        location.reload();
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
                    logo = true;
                    // alert(user_id);
                }else{
                    alert(res.result);
                }
            },
            error: function(res){
                alert("加载失败"+JSON.stringify(res));
            }
        });
    };



    //插入表情
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
    }
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
        } else if(document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }
}, 500);