function handleClick(e){
    // console.log(e.currentTarget.parentNode.attributes["data-index"].nodeValue);
    sessionStorage.setItem('article_id',e.currentTarget.parentNode.attributes["data-index"].nodeValue);
    window.location.href = "../articleDetails/details.html";
}
window.onload = function(){
    //加载所有文章
    $.ajax({
        type: "post",
        url: "http://47.94.97.26:8888/article/getall",
        data: {

        },
        success: function(res){
            if(!res.error){
                // console.log(res.result);
                for(let j=0;j<res.result.length;j++){
                    let title = res.result[j].articleTitle;
                    let content = res.result[j].articleContent;
                    var dd=content.replace(/<[^>]+>/g,"");//截取html标签
                    var dds=dd.replace(/&nbsp;/ig,"");//截取空格等特殊标签
                    // console.log(dds);
                    content = dds.substring(0, 150);
                    content = content+'...';
                    let str = "        <li class=\"li_\" data-index=\""+ res.result[j].articleId +"\">\n" +
                        "             <i class=\"fa fa-envira\" aria-hidden=\"true\"></i><p onclick=\"handleClick(event)\">"+title+"</p>\n" +
                        "            <div class=\"content_\">\n" +
                        "                <div class=\"img_wrap\">\n" +
                        "                    <img src=\"../img/essay.jpg\" />\n" +
                        "                </div>\n" +
                        "                <div class=\"ess\">"+ content +"</div>\n" +
                        "                <div class=\"bottom\">\n" +
                        "                    <i class=\"fa fa-user-o\" aria-hidden=\"true\"></i>\n" +
                        "                    <span>zhongqw</span>\n" +
                        "                    <i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>\n" +
                        "                    <span>2018-9-19</span>\n" +
                        "                    <i class=\"fa fa-eye\" aria-hidden=\"true\"></i>\n" +
                        "                    <span>浏览量(0)</span>\n" +
                        "                    <i class=\"fa fa-comment-o\" aria-hidden=\"true\"></i>\n" +
                        "                    <span>评论(0)</span>\n" +
                        "                    <i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i>                    <span>喜欢(0)</span>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "        </li>";
                    // console.log($(".li_"));
                    // $(".li_").attr("data-index", res.result[j].articleId);
                    $("#article_title").append(str);
                }
                let oLi = document.getElementById('article_title').getElementsByClassName('li_');
                for (let i = 0; i < oLi.length; i++) {
                    console.log(oLi);
                    oLi[i].onmouseover = function () {
                        this.getElementsByTagName("img")[0].style.transform = 'scale(1.2)';
                    };
                    oLi[i].onmouseout = function () {
                        this.getElementsByTagName("img")[0].style.transform = 'scale(1)';
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


};