package com.ksamar.library.controller;

import com.alibaba.fastjson.JSONObject;
import com.ksamar.library.entity.Books;
import com.ksamar.library.entity.Users;
import com.ksamar.library.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/nav") //这里是请求地址如 果要用这个类的方法就需要使用 http:// ip /nav 请求地址
public class UsersHandler {

    @Autowired
    private UsersRepository usersRepository; //用户存储库 用来装用户的数据

    //获取所有用户数据
    @GetMapping("/users")
    public List<Users> findAll(){
        return usersRepository.findAll();
    }

    //获取用户数据 Id
    @GetMapping("/users/find/{id}")
    public Optional<Users> findById(@PathVariable("id") int Id){
        return usersRepository.findById(Id);
    }

    //获取用户数据 Name
    @GetMapping("/users/find")
    public List<Users> findByUsernameLike(String name){
        return usersRepository.findByUsernameLike("%" + name + "%");
    }

    //用户登录
    @PostMapping("/login") //这里是登录的请求地址和上面一样在 /nav 后面加上 /login 就能请求了
    public Object findOne(Users users){
        Example<Users> userExample = Example.of(users) ; //封装表单传过来的数据
        Optional<Users> userOptional = usersRepository.findOne(userExample); //与数据库交互 去寻找表单所提交的用户存不存在
        JSONObject jsonObject = new JSONObject(); //创建一个空JSONObject 对象

        //0代表登录失败 1代表登录成功
        //判断这个用户是否存在
        if (userOptional.isPresent()){
            Users userTemp = userOptional.get(); //获取用户数据

            //判断这个用户是不是管理组的
            if(userTemp.getGroups().equals("admin")){
                //判断用户提交的用户名和数据库的是否一致
                if(users.getUsername().equals(userTemp.getUsername())){
                    //判断用户提交的密码和数据库的是否一致
                    if(users.getPassword().equals(userTemp.getPassword())){
                        jsonObject.put("code","1");
                        jsonObject.put("username",userTemp.getUsername());
                    }
                    else{
                        jsonObject.put("code","0");

                    }
                }
                else{
                    jsonObject.put("code","0");
                }
            }
            else{
                jsonObject.put("code","0");
            }
        }
        else{
            jsonObject.put("code","0");
        }
        return jsonObject;
    }

    /**
     * 添加用户
     * -1：错误，添加失败
     * 0：存在，添加失败
     * 1：添加成功
     */
    @PostMapping("/users/save")
    public Object save(Users users){
        Users user1 = usersRepository.findByPhone(users.getPhone()); //搜索手机号是否存在
        JSONObject jsonObject = new JSONObject(); //创建一个空JSONObject 对象

        if(user1 == null){
            Users result = usersRepository.save(users); //保存书籍
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
     * 修改用户
     * -1：错误，修改失败
     * 0：修改后的手机号存在，修改失败
     * 1：修改成功
     */
    @PutMapping("/users/update/{id}")
    public Object update(Users users){
        JSONObject jsonObject = new JSONObject();
        Users users1 = usersRepository.findByPhone(users.getPhone()); //搜索isbn是否存在

        //存在
        if(users1 != null){
            int oldId = users.getId(); //获取旧id
            int newId = users1.getId(); //获取新id

            //判断要修改的书的id是否和原来的书id一致
            if(oldId == newId){
                Users save = usersRepository.save(users);
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
        else if(users1 == null){
            usersRepository.save(users);
            jsonObject.put("resultCode","1");
        }
        //其他情况
        else{
            jsonObject.put("resultCode","0");
        }

        return jsonObject;
    }

    /**
     * 删除用户
     * -1：删除失败
     * 1：删除成功
     */
    @DeleteMapping("/users/delete/{id}")
    public Object deleteById(@PathVariable("id") Integer Id){
        JSONObject jsonObject = new JSONObject();
        if(usersRepository.existsById(Id)){
            usersRepository.deleteById(Id);
            jsonObject.put("resultCode","1");
        }
        else{
            jsonObject.put("resultCode","-1");
        }

        return jsonObject;
    }
}