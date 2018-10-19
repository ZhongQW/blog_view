/*
    Create by WebStorm.
    User: ZhongQw
    Date: 2018/10/19
    Time: 17:40
*/
window.onload = function() {
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