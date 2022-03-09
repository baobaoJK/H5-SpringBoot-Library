package com.ksamar.library.controller;

import com.alibaba.fastjson.JSONObject;
import com.ksamar.library.entity.Books;
import com.ksamar.library.repository.BooksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/nav") //请求地址
public class BooksHandler {

    @Autowired
    private BooksRepository booksRepository;

    //搜索全部
    @GetMapping("/books") //请求地址
    public List<Books> findAll() {
        return booksRepository.findAll();
    }

    //搜索单本图书
    @GetMapping("/books/find")
    public List<Books> findByNameLike(String book){
        return booksRepository.findByNameLike("%" + book + "%");
    }

    //搜索单本图书 id
    @GetMapping("/books/find/{id}")
    public Optional<Books> findById(@PathVariable("id") Integer id){
        return booksRepository.findById(id);
    }

    //搜索单本图书 ISBN
    @GetMapping("/books/find/isbn/{isbn}")
    public List<Books> findByIsbn(@PathVariable("isbn") String isbn) {
        return booksRepository.findByIsbn(isbn);
    }

    /**
     * 添加图书
     * -1：错误，添加失败
     * 0：存在，添加失败
     * 1：添加成功
     */
    @PostMapping("/books/save")
    public Object save(Books books){
        List<Books> book1 = booksRepository.findByIsbn(books.getIsbn()); //搜索书籍是否存在
        JSONObject jsonObject = new JSONObject(); //创建一个空JSONObject 对象

        if(book1.size() == 0){
            Books result = booksRepository.save(books); //保存书籍
            if(result != null){
                jsonObject.put("resultCode","1");
            }
            else{
                jsonObject.put("resultCode","-1");
            }
        }
        else{
            jsonObject.put("resultCode","0");
        }

        return jsonObject;
    }

    /**
     * 修改图书
     * -1：错误，修改失败
     * 0：修改后的isbn存在，修改失败
     * 1：修改成功
     */
    @PutMapping("/books/update/{id}")
    public Object update(Books books){
        JSONObject jsonObject = new JSONObject();
        List<Books> booksList = booksRepository.findByIsbn(books.getIsbn()); //搜索isbn是否存在

        //存在
        if(booksList.size() == 1){
            int oldId = books.getId(); //获取旧id
            int newId = booksList.get(0).getId(); //获取新id

            //判断要修改的书的id是否和原来的书id一致
            if(oldId == newId){
                Books save = booksRepository.save(books);
                if(save != null){
                    jsonObject.put("resultCode","1");
                }
                else{
                    jsonObject.put("resultCode","-1");
                }
            }
            else{
                jsonObject.put("resultCode","0");
            }
        }
        //不存在
        else if(booksList.size() == 0){
            booksRepository.save(books);
            jsonObject.put("resultCode","1");
        }
        //其他情况
        else{
            jsonObject.put("resultCode","0");
        }

        return jsonObject;
    }

    /**
     * 删除图书
     * -1：删除失败
     * 1：删除成功
     */
    @DeleteMapping("/books/delete/{id}")
    public Object deleteById(@PathVariable("id") Integer Id){
        JSONObject jsonObject = new JSONObject();
        if(booksRepository.existsById(Id)){
            booksRepository.deleteById(Id);
            jsonObject.put("resultCode","1");
        }
        else{
            jsonObject.put("resultCode","-1");
        }

        return jsonObject;
    }
}
