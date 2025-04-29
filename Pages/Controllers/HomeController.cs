using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Pages.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Salir()
        {
            Session.Clear();      // Elimina todos los valores
            Session.Abandon();    //finaliza la sesion
            return RedirectToAction("Index", "Login");
        }
    }
}