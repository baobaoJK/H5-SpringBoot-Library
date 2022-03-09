$(function(){
    //获取cookie 判断用户登录状态
    var is_login = $.cookie("username");
    if(is_login == null || is_login == "" || is_login == ''){
        alert("请登录！");
        window.location.replace("/index.html");
    }

    //侧边栏激活状态
    $("ul>li").click(function (e) { 
        $("li").removeClass("active");
        $(this).addClass("active");
    });

    //退出系统
    $(".exit").click(function (e) { 
        var exit = $.removeCookie('username', { path: '/' });
        if(exit){
            window.location.replace("/index.html");
            alert("您已退出系统");
        }
        else{
            alert("系统错误");
        }
    });
});