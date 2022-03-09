$(function(){
    //获取图书数据
    $.ajax({
        type: "get", //请求方式
        url: ip + "/nav/books/borrow/find", //请求地址
        dataType: "json", //返回文件格式
        success:function(data){
            //添加数据
            searchBook(data);
        },
        error: function(data){
            alert("系统错误");
        }
    });

    //搜索图书
    var search_button = $('.search-button');
    var isbn = $('#search');

    $(search_button).click(function (e) { 
        e.preventDefault();        
        $.ajax({
            type: "get",
            url: ip + "/nav/books/borrow/find/" + isbn.val(),
            dataType: "json",
            success:function(data){
                $(".book").remove(); //删除原来的书
                searchBook(data); //搜索图书
            },
            error:function(data){
                alert("系统错误");
            }
        });
    });

    //归还图书
    $(document).on('click', '.return', function (e) {
        e.preventDefault();
        $('.return-button').attr("name",$(this).attr("name")); //设置id
        $('.tip').text("确定归还 " + $('#' + $(this).attr("name") + '>td[name="username"]').text() + " 的 " + $('#' + $(this).attr("name") + '>td[name="name"]').text() + " 书吗?");
    });

    $('.return-button').click(function (e){
        e.preventDefault();
        
        returnBook($(this).attr("name"));
    });
});

//显示图书信息函数
function searchBook(data){
    for(var i = 0; i < data.length; i++){
        var text =  "<tr id='" + data[i].id + "' class='book'>" +
                    "<td name='id'>" + data[i].id + "</td>" +
                    "<td name='name'>" + data[i].name + "</td>" +
                    "<td name='isbn'>" + data[i].isbn + "</td>" +
                    "<td name='username'>" + data[i].username + "</td>" +
                    "<td name='id_card'>" + data[i].id_card + "</td>" +
                    "<td name='phone'>" + data[i].phone + "</td>" +
                    "<td name='time'>" + data[i].time.substr(0,10) + "</td>" +
                    "<td name='r_time'>" + data[i].r_time.substr(0,10) + "</td>" +
                    "<td><button class='btn btn-warning btn-sm return' name='" + data[i].id + "' data-toggle='modal' data-target='#return-modal'>归还</button>" +
                    "</tr>";
        $("tbody").append(text);
    }
}

//归还书本函数
function returnBook(id){
    $.ajax({
        type: "delete",
        url: ip + "/nav/books/borrow/return/" + id,
        dataType: "json",
        success: function (data) {
            if(data.resultCode == "-1"){
                alert("服务器错误");
            }
            if(data.resultCode == "0"){
                alert("归还失败");
            }
            if(data.resultCode == "1"){
                alert("归还成功");
                window.location.reload();
            }
        },
        error: function (data){
            alert("错误");
        }
    });
}