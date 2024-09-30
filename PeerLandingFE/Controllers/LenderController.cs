using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class LenderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult UserFunding()
        {
            return View();
        }

        public IActionResult UserFundingHistory()
        {
            return View();
        }

        public IActionResult DetailLoan(string loanId)
        {
            ViewData["loanId"] = loanId;
            return View();
        }
        public IActionResult UserProfile()
        {
            return View();
        }
    }
}
