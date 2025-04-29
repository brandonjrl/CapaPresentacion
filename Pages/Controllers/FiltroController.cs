using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Pages.Controllers
{
    public class FiltroController : Controller
    {
        // GET: Filtros
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Dinamico()
        {
            return View(); // Usará Views/Filtro/Dinamico.cshtml
        }
    }
}