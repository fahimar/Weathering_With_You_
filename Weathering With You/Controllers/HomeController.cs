using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Weathering_with_You_.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (Session["username"] == null)
            {
                return RedirectToAction("UserSinIn", "User_sign_in_up_");
            }
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}