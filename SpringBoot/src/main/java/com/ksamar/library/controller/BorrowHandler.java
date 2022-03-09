package com.ksamar.library.controller;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import com.ksamar.library.entity.Books;
import com.ksamar.library.entity.Borrow;
import com.ksamar.library.entity.Users;
import com.ksamar.library.repository.BooksRepository;
import com.ksamar.library.repository.BorrowRepository;
import com.ksamar.library.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/nav") //请求地址
public class BorrowHandler {

    @Autowired
    private BooksRepository booksRepository;
    @Autowired
    private BorrowRepository borrowRepository;
    @Autowired
    private UsersRepository usersRepository;

    //搜索图书信息
    @GetMapping("/books/borrow/find")
    public List<Borrow> findAll() {
        return borrowRepository.findAll();
    }

    //搜索图书信息 ISBN
    @GetMapping("/books/borrow/find/{isbn}")
    public List<Borrow> findByIsbn(@PathVariable("isbn") String isbn){
        return borrowRepository.findByIsbn(isbn);
    }

    /**
     * 借阅图书
     * -1: 系统错误
     *  0: 库存不足
     *  1: 借阅成功
     */
    @PostMapping("/books/borrow")
    public Object bookBorrow(String isbn, String username, String id_card, String phone){
        JSONObject jsonObject = new JSONObject();

        if(!isbn.equals("") && !username.equals("") && !id_card.equals("") && !phone.equals("")){
            List<Books> booksList = booksRepository.findByIsbn(isbn); //搜索图书
            //判断有没有书
            if(booksList.size() != 0){
                Books books = booksList.get(0);
                if(books.getQuantity() - 1 >= 0){
                    books.setQuantity(books.getQuantity() - 1);

                    Users users = usersRepository.findByPhone(phone); //搜索用户
                    //判断有没有用户 用户信息是否正确
                    if(users != null && users.getUsername().equals(username) && users.getId_card().equals(id_card) && users.getPhone().equals(phone)){

                        TimeZone.setDefault(TimeZone.getTimeZone("GMT")); //设置时区
                        Calendar calendar = Calendar.getInstance(); //获取时间
                        Date nowDate; //借阅时间
                        Date returnDate; //归还时间

                        nowDate = calendar.getTime(); //借阅时间
                        calendar.add(Calendar.DATE, 7); //添加时间
                        returnDate = calendar.getTime(); //归还时间

                        Borrow borrow = new Borrow();
                        borrow.setName(books.getName()); //图书名称
                        borrow.setIsbn(books.getIsbn()); //ISBN号码
                        borrow.setUsername(users.getUsername()); //借阅人名字
                        borrow.setId_card(users.getId_card()); //借阅人ID
                        borrow.setPhone(users.getPhone()); //借阅人手机号
                        borrow.setTime(nowDate); //设置借阅图书时间
                        borrow.setR_time(returnDate); //添加归还书本时间

                        Borrow save = borrowRepository.save(borrow); //保存数据

                        if(save != null){
                            jsonObject.put("resultCode","1");
                        }
                        else{
                            jsonObject.put("resultCode","-1");
                        }
                    }
                    else{
                        jsonObject.put("resultCode","-1");
                    }
                }
                else{
                    jsonObject.put("resultCode","0");
                }
            }
            else{
                jsonObject.put("resultCode","0");
            }
        }
        else{
            jsonObject.put("resultCode","-1");
        }

        return jsonObject;
    }

    /**
     * 归还图书
     * -1:系统错误
     *  0:归还失败
     *  1:归还成功
     */
    @DeleteMapping("/books/borrow/return/{id}")
    public Object bookReturn(@PathVariable("id") int Id){
        JSONObject jsonObject = new JSONObject();;

        Borrow borrow = borrowRepository.getById(Id); //获取借阅信息
        List<Books> booksList = booksRepository.findByIsbn(borrow.getIsbn()); //获取图书

        if(booksList.size() != 0){
            //删除信息
            if(borrowRepository.existsById(Id)){
                borrowRepository.deleteById(Id);
                Books books = booksList.get(0); //获取图书信息
                books.setQuantity(books.getQuantity() + 1); //图书数量加一
                booksRepository.save(books);

                jsonObject.put("resultCode","1");
            }
            else{
                jsonObject.put("resultCode","0");
            }
        }
        else{
            jsonObject.put("resultCode","-1");
        }
        return jsonObject;
    }

    //搜索超时信息
    @GetMapping("/books/overtime/find/{isbn}")
    public List<Borrow> findOverTime(@PathVariable("isbn") String isbn) {
        List<Borrow> oldBorrowList;
        List<Borrow> borrowList = new ArrayList<>();

        TimeZone.setDefault(TimeZone.getTimeZone("GMT")); //设置时区

        if(isbn.equals("0")){
            oldBorrowList = borrowRepository.findAll(); //获取数据
        }
        else{
            oldBorrowList = borrowRepository.findByIsbn(isbn);
        }

        //判断表里有没有数据
        if(oldBorrowList.size() != 0){
            //循环读取数据
            for (Borrow borrow : oldBorrowList) {
                Calendar calendar = Calendar.getInstance();
                if(calendar.getTime().after(borrow.getR_time())){
                    borrowList.add(borrow); //添加超时归还的数据
                }
            }
        }

        return borrowList;
    }
}
