window.onload = function(){
    const oName = document.getElementsByClassName('name')[0];
    const oA = oName.getElementsByTagName('a')[0];
    let oTimer = null;
    let iLeft = -90;
    //控制文字闪烁
    function toMove(){
        oTimer = setInterval(function(){
            iLeft+=5;
            if(iLeft === 500){
                iLeft = -90;
                clearInterval(oTimer);
            }
            oA.style.backgroundPosition = iLeft+ "px 0";
        },20)
    }
    toMove();
    setInterval(function(){
        toMove();
    },3200);

};