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
            try
            {
                if (ModelState.IsValid)
                {
                    var validUser = (from c in db.user_sign_in_up where c.userName.Equals(s.userName) select c).FirstOrDefault();
                    if (validUser == null)
                    {
                        ViewBag.ErrorMessage = "Login Failed, User does not exist";
                        return View();
                    }

                    bool passwordMatches = Custom_Scrypt.VerifyPassword(s.password, validUser.password);
                    if (!passwordMatches)
                    {
                        ViewBag.ErrorMessage = "Login Failed, Wrong Password";
                        return View();
                    }

                    HttpContext.Session["username"] = validUser.userName;
                    return RedirectToAction("Index", "Home");
                }
            }
            catch (Exception e) { ViewBag.ErrorMessage = e.Message; }

            return View();
        }

        [HttpPost]
        public ActionResult UserSinUp([Bind(Include = "firstName, lastName,userName,email,password,city, address")] user_sign_in_up user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var credential = (from c in db.user_sign_in_up
                                      where c.userName.Equals(user.userName)
                                      select c).SingleOrDefault();
                    var credentialEmail = (from c in db.user_sign_in_up
                                      where c.email.Equals(user.email)
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
                        user.password = Custom_Scrypt.HashPassword(user.password);
                        db.user_sign_in_up.Add(user);
                        db.SaveChanges();

                        return RedirectToAction("UserSinIn", "User_sign_in_up_");

                    }

                }
            }
            catch (Exception ex2)
            {
                ViewBag.ErrorMessage = ex2.Message;
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
