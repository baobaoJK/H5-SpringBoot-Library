$(function(){
    //获取图书数据
    $.ajax({
        type: "get", //请求方式
        url: ip + "/nav/books", //请求地址
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
    var input_text = $('#search');

    $(search_button).click(function (e) { 
        e.preventDefault();        
        $.ajax({
            type: "get",
            url: ip + "/nav/books/find",
            data: {book:input_text.val()},
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

    //表单组件
    var book_title = $('#book-modal .modal-title'); //标题栏
    var book_form = $('.book-form'); //表单
    var operate_button = $('.operate-button'); //添加图书按钮

    //添加图书
    var add_button = $('.add-button'); //添加按钮
    $(add_button).click(function (e) { 
        e.preventDefault();
        book_title.text("添加图书"); //设置标题栏
        book_form[0].reset(); //重置表单
        operate_button.text("添加"); //设置按钮文本
    });

    //编辑图书
    $(document).on('click', '.edit', function (e) { 
        e.preventDefault();
        book_title.text("编辑图书"); //设置标题
        book_form[0].reset(); //重置表单
        operate_button.text("编辑"); //设置按钮文本
        operate_button.attr("name",$(this).attr("name")); //设置id
        getBook($(this).attr("name")); //获取图书信息
    });

    //删除图书
    $(document).on('click', '.delete', function (e) {
        e.preventDefault();
        $('.delete-button').attr("name",$(this).attr("name")); //设置id
        $('.tip').text("确定删除" + $('#' + $(this).attr("name") + '>td[name="name"]').text() + "?");
    });

    $('.delete-button').click(function (e){
        e.preventDefault();
        
        deleteBook($(this).attr("name"));
    });

    //图书操作
    $(operate_button).click(function (e) { 
        e.preventDefault();
        
        if(book_title.text() == "添加图书"){
            addBook(book_form);
        }
        if(book_title.text() == "编辑图书"){
            editBook($(this).attr("name"), book_form);
        }
    });
});

//显示图书信息函数
function searchBook(data){
    for(var i = 0; i < data.length; i++){
        var text =  "<tr id='" + data[i].id + "' class='book'>" +
                    "<td name='id'>" + data[i].id + "</td>" +
                    "<td name='groups'>" + data[i].groups + "</td>" +
                    "<td name='name'>" + data[i].name + "</td>" +
                    "<td name='author'>" + data[i].author + "</td>" +
                    "<td name='press'>" + data[i].press + "</td>" +
                    "<td name='price'>" + data[i].price + "</td>" +
                    "<td name='quantity'>" + data[i].quantity + "</td>" +
                    "<td name='isbn'>" + data[i].isbn + "</td>" +
                    "<td><button class='btn btn-success btn-sm edit' name='" + data[i].id + "' data-toggle='modal' data-target='#book-modal'>编辑</button><button class='btn btn-danger btn-sm delete' name='" + data[i].id + "' data-toggle='modal' data-target='#delete-modal'>删除</button></td>" +
                    "</tr>";
        $("tbody").append(text);
    }
}

//检查表单函数
function checkForm(){
    var group = $('#groups');
    var name = $('#name');
    var author = $('#author');
    var press = $('#press');
    var price = $('#price');
    var quantity = $('#quantity');
    var isbn = $('#isbn');

    if(group.val() == '' || group.val() == "" || group.val() == null){
        alert("请输入图书组名");
    }
    else if(name.val() == '' || name.val() == "" || name.val() == null){
        alert("请输入图书名称");
    } 
    else if(author.val() == '' || author.val() == "" || author.val() == null){
        alert("请输入作者名称");
    } 
    else if(press.val() == '' || press.val() == "" || press.val() == null){
        alert("请输入出版社名称");
    } 
    else if(price.val() == '' || price.val() == "" || price.val() == null){
        alert("请输入价格（人民币）");
    } 
    else if(quantity.val() == '' || quantity.val() == "" || quantity.val() == null){
        alert("请输入数量（本）");
    } 
    else if(isbn.val() == '' || isbn.val() == "" || isbn.val() == null){
        alert("请输入ISBN号码");
    } 
    else if(isbn.val().length != 13){
        alert("请输入正确的ISBN号码");
    }
    else{
        return true;
    }
    
    return false;
}

//添加图书函数
function addBook(book_form){
    //判断表单，返回false不能添加，返回true能添加
    if(checkForm() != false){
        $.ajax({
            type: "post",
            url: ip + "/nav/books/save",
            data: book_form.serialize(),
            dataType: "json",
            success:function(data){
                if(data.resultCode == '-1'){
                    alert("添加失败，服务器错误");
                }
                if(data.resultCode == '0'){
                    alert("添加失败，此书已存在");
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

//获取图书信息
function getBook(id){
    $.ajax({
        type: "get",
        url: ip + "/nav/books/find/" + id,
        dataType: "json",
        success: function (data) {
            $('#groups').val(data.groups);
            $('#name').val(data.name);
            $('#author').val(data.author);
            $('#press').val(data.press);
            $('#price').val(data.price);
            $('#quantity').val(data.quantity);
            $('#isbn').val(data.isbn);
        },
        error: function (data){
            alert("错误");
        }
    });
}

//编辑图书信息
function editBook(id, book_form){
    if(checkForm() == true){
        $.ajax({
            type: "put",
            url: ip + "/nav/books/update/" + id,
            data: book_form.serialize(),
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

//删除书本函数
function deleteBook(id){
    $.ajax({
        type: "delete",
        url: ip + "/nav/books/delete/" + id,
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