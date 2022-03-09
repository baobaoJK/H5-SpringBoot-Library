$(function(){

    //判断用户是否登录过
    var is_login = $.cookie("username");
    if(is_login != null && is_login != "" && is_login != ''){
        window.location.replace("/library/library.html");
    }

    //获取表单组件
    var username = $('.username-text');
    var password = $('.password-text');
    var login_button = $('.login-button');

    //登录按钮点击事件
    login_button.click(function (e) { 
        e.preventDefault();
        //判断输入框
        if(username.val() == ""){
            alert("请输入用户名");
        }
        else if(password.val() == ""){
            alert("请输入密码");
        }
        else{
            //事件执行
            $.ajax({
                type: "post",
                url: ip + "/nav/login",
                data: {"username":username.val(),"password":password.val()},
                dataType: "json",
                success:function(data){
                    //如果后端返回的code值为1则登录成功
                    if(data.code == "1"){
                        alert("登录成功");
                        $.cookie("username",data.username);
                        window.location.replace("/library/library.html");
                    }
                    //如果后端返回的code值为0则登录失败
                    if(data.code == "0"){
                        alert("账号或密码错误");
                    }
                },
                error:function(data){
                    //如果前端与后端交互出问题则报错
                    alert("系统错误");
                }
            });
        }
    });
});