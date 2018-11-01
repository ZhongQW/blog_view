window.onload = function() {
    var logo = false;
    var user_id;
    //加载文章
    $.ajax({
        type: "post",
        url: "http://localhost:8888/article/getonetext",
        data: {
            id: 1
        },
        success: function(res){
            if(!res.error){
                $('#content').html(res.result[0].articleContent);
                $('#article_name').html(res.result[0].articleTitle);
            }else{
                alert(res.result);
            }
        },
        error: function(res){
            alert("加载失败"+JSON.stringify(res));
        }
    });
    //加载评论
    // $.ajax({
    //     type: "post",
    //     url: "http://localhost:8888/words/getWords",
    //     data: {
    //         articleId: 1
    //     },
    //     success: function(res){
    //         if(!res.error){
    //             for(let i=0;i<res.result.length;i++) {
    //                 let div1 = document.createElement('div');
    //                 let i = document.createElement('i');
    //                 let div2 = document.createElement('div');
    //                 let p = document.createElement('p');
    //                 let div3 = document.createElement('div');
    //                 let span1 = document.createElement('span');
    //                 let span2 = document.createElement('span');
    //                 div1.className = 'person_words';
    //                 div2.className = 'person_content';
    //                 p.innerHTML = res.result[i].wordsContent;
    //                 span1.innerHTML = res.result[i].wordsTime;
    //                 span2.innerHTML = res.result[i].wordsName;
    //                 div3.appendChild(span1);
    //                 div3.appendChild(span2);
    //                 div2.appendChild(p);
    //                 div2.appendChild(div3);
    //                 div1.appendChild(i);
    //                 div1.appendChild(div2);
    //                 if(res.result[i].wordsReply){
    //                     let hr = document.createElement('hr');
    //                     let div4 = document.createElement('div');
    //                     div4.className = 'person_reply';
    //                     let span3 = document.createElement('span');
    //                     let span4 = document.createElement('span');
    //                     div4.appendChild(span3);
    //                     div4.appendChild(span4);
    //                     div1.appendChild(hr);
    //                     div1.appendChild(div4);
    //                 }
    //                 document.getElementById('words_content').appendChild(div1);
    //             }
    //         }else{
    //             alert(res.result);
    //         }
    //     },
    //     error: function(res){
    //         alert("加载失败"+JSON.stringify(res));
    //     }
    // });

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
            for (let i = 0; i < arrImg.length; i++) {
                let src = arrImg[i].match(srcReg);
                srcArr[i] = src[1];
            }
            // strResult：存放的替换后的字符串
            // srcArr[i]：存放所有的src
            // console.log(arr);
            // for(i=0;i<arrImg.length;i++)
            //     console.log(srcArr[i]);
            $.ajax({
                type: "post",
                url: "http://localhost:8888/words/addwords",
                data: {
                    wordsId: user_id,
                    articleId: 1,
                    articleName: document.getElementById('wordsName'),
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
        $.ajax({
            type: "post",
            url: "http://localhost:8888/words/adduser",
            data: {
                wordsName: document.getElementById('wordsName'),
                wordsEmail: document.getElementById('wordsEmail')
            },
            success: function(res){
                if(!res.error){
                    user_id = res.result[0].wordsId;
                    document.getElementById('words_ifon').style.display = 'none';
                    logo = true;
                }else{
                    alert(res.result);
                }
            },
            error: function(res){
                alert("加载失败"+JSON.stringify(res));
            }
        });
    };


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
