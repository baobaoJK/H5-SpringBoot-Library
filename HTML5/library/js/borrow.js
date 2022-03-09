$(function(){
    
    //搜索图书
    var search_button = $(".search-button");

    $(search_button).click(function (e) { 
        e.preventDefault();
    
        var isbn = $(".search-input").val();
        if(isbn != '' && isbn != "" && isbn != null){
            if(isbn.length == 13){
                $.ajax({
                    type: "get",
                    url: ip + "/nav/books/find/isbn/" + isbn,
                    dataType: "json",
                    success:function(data){
                        if(!jQuery.isEmptyObject(data)){
                            $('.book-name').text(data[0].name);
                            $('.book-author').text(data[0].author);
                            $('.book-press').text(data[0].press);
                            $('.book-isbn').text(data[0].isbn);
                            $('.book-quantity').text(data[0].quantity);
                        }
                        else{
                            alert("查无此书");
                        }
                    },
                    error:function(data){
                        alert("系统错误");
                    }
                });
            }
            else{
                alert("请输入正确的ISBN号码");
            }
        }
        else{
            alert("请输入ISBN号码");
        }
    });

    //借阅图书
    var borrow_button = $('.borrow-button');

    $(borrow_button).click(function (e) { 
        e.preventDefault();
        
        var isbn = $('.book-isbn').text();
        var username = $('.username').val();
        var id_card = $('.id-card').val();
        var phone = $('.phone').val();
        
        if(isbn != '' && isbn != "" && isbn != null){
            if(username != '' && username != "" && username != null){
                if(id_card != '' && id_card != "" && id_card != null){
                    if(phone != '' && phone != "" && phone != null){
                        $.ajax({
                            type: "post",
                            url: ip + "/nav/books/borrow",
                            data: {isbn:isbn,username:username,id_card:id_card,phone:phone},
                            dataType: "json",
                            success: function (data) {
                                console.log(data);
                                if(data.resultCode == "-1"){
                                    alert("借阅失败，系统错误");
                                }
                                if(data.resultCode == "0"){
                                    alert("借阅失败，库存不足");
                                }
                                if(data.resultCode == "1"){
                                    alert("借阅成功");
                                    window.location.reload();
                                }
                            },
                            error: function (data){
                                alert("系统错误");
                            }
                        });
                    }
                    else{
                        alert("请输入借阅人手机");
                    }
                }
                else{
                    alert("请输入借阅人卡号");
                }
            }
            else{
                alert("请输入借阅人名字");
            }
        }
        else{
            alert("请先选择书籍！");
        }
    });
});