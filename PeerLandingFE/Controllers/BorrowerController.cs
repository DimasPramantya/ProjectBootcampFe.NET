using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class BorrowerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult DetailLoan(string loanId)
        {
            ViewData["loanId"] = loanId;
            return View();
        }

        public IActionResult RepaidLoan(string loanId)
        {
            ViewData["loanId"] = loanId;
            return View();
        }

        public IActionResult LoanHistory()
        {
            return View();
        }

        public IActionResult UserProfile()
        {
            return View();
        }
    }
}
