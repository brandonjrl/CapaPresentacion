using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Pages.Controllers
{
    public class LoginController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(string Codigo, string clave)
        {
            if(Codigo == null && clave == null)
            {
                ViewBag.Error = "Usuario o contraseña incompleta";
                return View();
            }
            // lógica de autenticación
            return RedirectToAction("Index", "Home"); ;
        }

    }

}
