$(function(){
    //获取用户数据
    $.ajax({
        type: "get", //请求方式
        url: ip + "/nav/users", //请求地址
        dataType: "json", //返回文件格式
        success:function(data){
            //添加数据
            searchUser(data);
        },
        error: function(data){
            alert("系统错误");
        }
    });

    //搜索用户
    var search_button = $('.search-button');
    var input_text = $('#search');

    $(search_button).click(function (e) { 
        e.preventDefault();        
        $.ajax({
            type: "get",
            url: ip + "/nav/users/find",
            data: {name:input_text.val()},
            dataType: "json",
            success:function(data){
                $(".users").remove(); //删除原来的用户
                searchUser(data); //搜索用户
            },
            error:function(data){
                alert("系统错误");
            }
        });
    });

    //表单组件
    var user_title = $('#users-modal .modal-title'); //标题栏
    var user_form = $('.users-form'); //表单
    var operate_button = $('.operate-button'); //添加用户按钮

    //添加用户
    var add_button = $('.add-button'); //添加按钮
    $(add_button).click(function (e) { 
        e.preventDefault();
        user_title.text("添加用户"); //设置标题栏
        user_form[0].reset(); //重置表单
        operate_button.text("添加"); //设置按钮文本
    });

    //编辑用户
    $(document).on('click', '.edit', function (e) { 
        e.preventDefault();
        user_title.text("编辑用户"); //设置标题
        user_form[0].reset(); //重置表单
        operate_button.text("编辑"); //设置按钮文本
        operate_button.attr("name",$(this).attr("name")); //设置id
        getUser($(this).attr("name")); //获取用户信息
    });

    //删除用户
    $(document).on('click', '.delete', function (e) {
        e.preventDefault();
        $('.delete-button').attr("name",$(this).attr("name")); //设置id
        $('.tip').text("确定删除" + $('#' + $(this).attr("name") + '>td[name="username"]').text() + "?");
    });

    $('.delete-button').click(function (e){
        e.preventDefault();
        deleteUser($(this).attr("name"));
    });

    //用户操作
    $(operate_button).click(function (e) { 
        e.preventDefault();
        
        if(user_title.text() == "添加用户"){
            addUser(user_form);
        }
        if(user_title.text() == "编辑用户"){
            editUser($(this).attr("name"), user_form);
        }
    });
});

//显示用户信息函数
function searchUser(data){
    for(var i = 0; i < data.length; i++){
        var text =  "<tr id='" + data[i].id + "' class='users'>" +
                    "<td name='id'>" + data[i].id + "</td>" +
                    "<td name='groups'>" + data[i].groups + "</td>" +
                    "<td name='username'>" + data[i].username + "</td>" +
                    "<td name='password'>" + data[i].password + "</td>" +
                    "<td name='gender'>" + data[i].gender + "</td>" +
                    "<td name='id_card'>" + data[i].id_card + "</td>" +
                    "<td name='phone'>" + data[i].phone + "</td>" +
                    "<td name='identity'>" + data[i].identity + "</td>" +
                    "<td><button class='btn btn-success btn-sm edit' name='" + data[i].id + "' data-toggle='modal' data-target='#users-modal'>编辑</button><button class='btn btn-danger btn-sm delete' name='" + data[i].id + "' data-toggle='modal' data-target='#delete-modal'>删除</button></td>" +
                    "</tr>";
        $("tbody").append(text);
    }
}

//检查表单函数
function checkForm(){
    var group = $('#groups');
    var username = $('#username');
    var password = $('#password');
    var gender = $('#gender');
    var id_card = $('#id_card');
    var phone = $('#phone');
    var identity = $('#identity');

    if(group.val() == '' || group.val() == "" || group.val() == null){
        alert("请输入用户组名");
    }
    else if(username.val() == '' || username.val() == "" || username.val() == null){
        alert("请输入用户名称");
    } 
    else if(password.val() == '' || password.val() == "" || password.val() == null){
        alert("请输入用户密码");
    } 
    else if(gender.val() == '' || gender.val() == "" || gender.val() == null){
        alert("请输入性别");
    } 
    else if(id_card.val() == '' || id_card.val() == "" || id_card.val() == null){
        alert("请输入借书卡号");
    } 
    else if(phone.val() == '' || phone.val() == "" || phone.val() == null){
        alert("请输入手机号");
    } 
    else if(identity.val() == '' || identity.val() == "" || identity.val() == null){
        alert("请输入身份");
    } 
    else if(id_card.val().length != 8){
        alert("请输入正确的借阅卡号");
    }
    else if(phone.val().length != 11){
        alert("请输入正确的手机号");
    }
    else{
        return true;
    }
    
    return false;
}

//添加用户函数
function addUser(user_form){
    //判断表单，返回false不能添加，返回true能添加
    if(checkForm() != false){
        $.ajax({
            type: "post",
            url: ip + "/nav/users/save",
            data: user_form.serialize(),
            dataType: "json",
            success:function(data){
                if(data.resultCode == '-1'){
                    alert("添加失败，服务器错误");
                }
                if(data.resultCode == '0'){
                    alert("添加失败，此用户已存在");
                }
                if(data.resultCode == '1'){
                    alert("添加成功");
                    window.location.reload();
                }
            },
            error:function(data){
                alert("错误");
            }
        });
    }
}

//获取用户信息
function getUser(id){
    $.ajax({
        type: "get",
        url: ip + "/nav/users/find/" + id,
        dataType: "json",
        success: function (data) {
            $('#groups').val(data.groups);
            $('#username').val(data.username);
            $('#password').val(data.password);
            $('#gender').val(data.gender);
            $('#id_card').val(data.id_card);
            $('#phone').val(data.phone);
            $('#identity').val(data.identity);
        },
        error: function (data){
            alert("错误");
        }
    });
}

//编辑用户信息
function editUser(id, user_form){
    if(checkForm() == true){
        $.ajax({
            type: "put",
            url: ip + "/nav/users/update/" + id,
            data: user_form.serialize(),
            dataType: "json",
            success: function (data) {
                if(data.resultCode == "-1"){
                    alert("修改失败，服务器错误");
                }
                if(data.resultCode == "0"){
                    alert("修改失败，要修改的ISBN号码已存在");
                }
                if(data.resultCode == "1"){
                    alert("修改成功");
                    window.location.reload();
                }
            },
            error: function (data) {
                alert("错误")
            }
        });
    }
}

//删除用户函数
function deleteUser(id){
    $.ajax({
        type: "delete",
        url: ip + "/nav/users/delete/" + id,
        dataType: "json",
        success: function (data) {
            if(data.resultCode == "-1"){
                alert("服务器错误");
            }
            if(data.resultCode == "1"){
                alert("删除成功");
                window.location.reload();
            }
        },
        error: function (data){
            alert("错误");
        }
    });
}