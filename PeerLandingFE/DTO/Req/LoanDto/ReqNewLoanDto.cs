using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.DTO.Req.LoanDto
{
    public class ReqNewLoanDto
    {
        public decimal Amount { get; set; }
        public decimal InterestRate { get; set; }
        public int Duration { get; set; }
    }
}
