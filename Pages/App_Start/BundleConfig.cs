using System.Web;
using System.Web.Optimization;

namespace Pages
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información. De este modo, estará
            // para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));
            //ADD in proyect 

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                       "~/Content/plugins/jquery/jquery.min.js",
                      "~/Content/plugins/bootstrap/js/bootstrap.bundle.min.js",
                      "~/Content/plugins/datatables/jquery.dataTables.min.js",
                      "~/Content/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js",
                      "~/Content/plugins/datatables-responsive/js/dataTables.responsive.min.js",
                      "~/Content/plugins/datatables-responsive/js/responsive.bootstrap4.min.js",
                      "~/Content/plugins/datatables-buttons/js/dataTables.buttons.min.js",
                      "~/Content/plugins/datatables-buttons/js/buttons.bootstrap4.min.js",
                      "~/Content/plugins/jszip/jszip.min.js",
                      "~/Content/plugins/pdfmake/pdfmake.min.js",
                      "~/Content/plugins/sweetalert2/sweetalert2.min.js",
                      "~/Content/plugins/pdfmake/vfs_fonts.js",
                      "~/Content/plugins/datatables-buttons/js/buttons.html5.min.js",
                      "~/Content/plugins/datatables-buttons/js/buttons.print.min.js",
                      "~/Content/plugins/datatables-buttons/js/buttons.colVis.min.js",
                      "~/Content/dist/js/adminlte.min.js",
                      "~/Content/dist/js/dgac.js"
                       ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                               "~/Content/plugins/fontawesome-free/css/all.min.css",
                               "~/Content/dist/css/dgac.css",
                               "~/Content/dist/css/adminlte.min.css"));

            bundles.Add(new StyleBundle("~/Content/PluginsCSS").Include(
                     "~/Content/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css",
                     "~/Content/plugins/datatables-responsive/css/responsive.bootstrap4.min.css",
                     "~/Content/plugins/datatables-buttons/css/buttons.bootstrap4.min.css",
                     "~/Content/plugins/sweetalert2/sweetalert2.min.css"
                     ));

            bundles.Add(new StyleBundle("~/Content/PluginsJS").Include(
                      "~/Scripts/jquery.validate.min.js"
                     ));
        }
    }
}
