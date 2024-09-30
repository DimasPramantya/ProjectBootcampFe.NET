using DAL.DTO.Req.Pagination;
using DAL.DTO.Res.RepaymentDto;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req.LoanDto;
using PeerLandingFE.DTO.Req.User;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.api
{
    public class ApiMstLoanController : Controller
    {
        private readonly HttpClient _httpClient;
        public ApiMstLoanController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        [HttpGet]
        public async Task<IActionResult> GetUserLoans([FromQuery] ReqPaginationQuery paginationQuery, [FromQuery] string status)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"https://localhost:7196/rest/v1/loans/users/me?pageNumber={paginationQuery.PageNumber}&pageSize={paginationQuery.PageSize}&orderBy={paginationQuery.OrderBy}&orderDirection={paginationQuery.OrderDirection}&status={status}");
            Console.WriteLine(response);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to get users.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLoans([FromQuery] ReqPaginationQuery paginationQuery, [FromQuery] string status)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"https://localhost:7196/rest/v1/loans?pageNumber={paginationQuery.PageNumber}&pageSize={paginationQuery.PageSize}&orderBy={paginationQuery.OrderBy}&orderDirection={paginationQuery.OrderDirection}&status={status}");
            Console.WriteLine(response);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to get users.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetLoanById([FromQuery] string loanId)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"https://localhost:7196/rest/v1/loans/{loanId}");
            Console.WriteLine(response);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to get users.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddLoan([FromBody] ReqNewLoanDto reqNewLoanDto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var json = JsonSerializer.Serialize(reqNewLoanDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"https://localhost:7196/rest/v1/loans", content);
            Console.WriteLine(response);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return BadRequest(responseData);
            }
        }

        [HttpPost]
        public async Task<IActionResult> FundLoan([FromQuery] string loanId)
        {
            Console.WriteLine(loanId);
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.PostAsync($"https://localhost:7196/rest/v1/loans/{loanId}/fund", null);
            Console.WriteLine(response);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return BadRequest(responseData);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetLoanRepayment(
            [FromQuery] ReqPaginationQuery paginationQuery, 
            [FromQuery] string loanId, 
            [FromQuery] string status
        )
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"https://localhost:7196/rest/v1/repayments/loans/{loanId}?pageNumber={paginationQuery.PageNumber}&pageSize={paginationQuery.PageSize}&orderBy={paginationQuery.OrderBy}&orderDirection={paginationQuery.OrderDirection}&status={status}");
            Console.WriteLine(response);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to get users.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> PayLoan([FromBody] ReqPaymentLoanDto reqPaymentLoanDto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var json = JsonSerializer.Serialize(reqPaymentLoanDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"https://localhost:7196/rest/v1/repayments/loans",content);
            Console.WriteLine(response);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return BadRequest(responseData);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserFunding([FromQuery] ReqPaginationQuery paginationQuery, [FromQuery] string status)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"https://localhost:7196/rest/v1/loans/fund/users/me?pageNumber={paginationQuery.PageNumber}&pageSize={paginationQuery.PageSize}&orderBy={paginationQuery.OrderBy}&orderDirection={paginationQuery.OrderDirection}&status={status}");
            Console.WriteLine(response);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to get users fundings.");
            }
        }
    }
}
