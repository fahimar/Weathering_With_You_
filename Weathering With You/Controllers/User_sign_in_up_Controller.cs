using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Weathering_with_You_.Models;

namespace Weathering_with_You_.Controllers
{
    public class User_sign_in_up_Controller : Controller
    {
        // GET: User_sign_in_up_
        public ActionResult UserSinIn()
        {
            return View();
        }
        public ActionResult UserSinUp()
        {
            return View();
        }

        //Shanto
        Weathering_with_youEntities db = new Weathering_with_youEntities();
        // GET: UserLogin

        

        [HttpPost]
        public ActionResult UserSinIn(UserSignIn s)
        {
            var userName_password = s;

            try
            {
                if (ModelState.IsValid == true)
                {
                    //var credential = db.users.Where(model => model.userName == s.userName && model.password == s.password).FirstOrDefault();
                    var validUser = (from c in db.user_sign_in_up where c.userName.Equals(s.userName) select c).FirstOrDefault();
                    // var _password = db.users.Where(model => model.userName == s.userName && model.password == s.password).FirstOrDefault();
                    string password_decode = validUser != null ? Custom_Scrypt.DecodeFrom64(validUser.password) : null;
                    bool check = password_decode != null ? String.Equals(password_decode, Convert.ToString(s.password)) : false;
                    if (validUser == null)
                    {
                        ViewBag.ErrorMessage = "Login Faild,User not exist";
                        return View();
                    }
                    else if (check != true)
                    {
                        ViewBag.ErrorMessage = "Login Faild,Wrong Password";
                        return View();
                    }
                    else
                    {
                        try
                        {
                            if (validUser != null && check == true)
                            {
                                HttpContext.Session["username"] = validUser.userName;
                                // return RedirectToAction("Index", "Home");
                                return RedirectToAction("Index", "Home");
                            }

                        }
                        catch (Exception ex)
                        {

                        }
                    }
                }
            }
            catch (Exception e) { ViewBag.ErrorMessage = e.Message; }

            return View();
        }

       

        [HttpPost]
        public ActionResult UserSinUp([Bind(Include = "firstName, lastName,userName,email,password,city, address")] user_sign_in_up user)
        {
            //ar enn = new ScryptEncoder();
            try
            {
                if (ModelState.IsValid)
                {
                    //return View();
                    var credential = (from c in db.user_sign_in_up
                                      where c.userName.Equals(user.userName)
                                      select c).SingleOrDefault();
                    var credentialEmail = (from c in db.user_sign_in_up
                                      where c.userName.Equals(user.email)
                                      select c).SingleOrDefault();
                    if (credential != null)
                    {
                        ViewBag.ErrorMessage = "This User Name already registered";
                        return View();
                    }else if (credentialEmail != null)
                    {
                        ViewBag.ErrorMessage = "This Email already registered";
                        return View();
                    }
                    else
                    {
                        user.password = Custom_Scrypt.EncodePasswordToBase64(user.password.ToString());
                        db.user_sign_in_up.Add(user);
                        db.SaveChanges();

                        return RedirectToAction("UserSinIn", "User_sign_in_up_");

                    }

                }
            }
            catch (Exception ex2)
            {
                // ViewBag.ErrorMessage = ex2.Message; 
            }
            return View();
        }

        public ActionResult Logout()
        {
            


            Session.Clear();
            Session.Abandon();
            Session.RemoveAll();
            return RedirectToAction("UserSinIn", "User_sign_in_up_");
        }
    }
    //Shanto
}
