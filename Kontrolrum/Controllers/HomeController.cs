using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Kontrolrum.Models;
using Microsoft.Extensions.Options;
namespace Kontrolrum.Controllers
{
    public class HomeController : Controller
    {
        //private readonly ConnectionString connection;

        public HomeController()
        {
            //connection = connectionString.Value;   
        }

        public IActionResult Index()
        {
            //var level1 = levels.Level1;
            //var level2 = levels.Level2;

            //return Content($"level1 = {level1}, level2 = {level2}");

            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
