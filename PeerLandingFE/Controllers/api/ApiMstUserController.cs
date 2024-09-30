using DAL.DTO.Req.Cash_Flow;
using DAL.DTO.Req.Pagination;
using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req.User;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.api
{
    public class ApiMstUserController : Controller
    {
        private readonly HttpClient _httpClient;
        public ApiMstUserController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers([FromQuery] ReqPaginationQuery paginationQuery)
        {
            Console.WriteLine(paginationQuery);
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"https://localhost:7196/rest/v1/users?pageNumber={paginationQuery.PageNumber}&pageSize={paginationQuery.PageSize}&orderBy={paginationQuery.OrderBy}&orderDirection={paginationQuery.OrderDirection}");

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
        public async Task<IActionResult> GetUserById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User ID cannot be null or empty");
            }
            Console.WriteLine("inside get user by id");
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            Console.WriteLine($"https://localhost:7196/rest/v1/users/{id}");
            var response = await _httpClient.GetAsync($"https://localhost:7196/rest/v1/users/{id}");
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

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.DeleteAsync($"https://localhost:7196/rest/v1/users/{id}");
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
        public async Task<IActionResult> AddUser([FromBody] ReqNewMstUserDto reqNewMstUserDto)
        {
            Console.WriteLine("inside add user");
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var json = JsonSerializer.Serialize(reqNewMstUserDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"https://localhost:7196/rest/v1/users/add-user", content);
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

        [HttpPut]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] ReqMstUserDto reqMstUserDto)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User ID cannot be null or empty");
            }
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var json = JsonSerializer.Serialize(reqMstUserDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"https://localhost:7196/rest/v1/users/{id}", content);
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
        public async Task<IActionResult> GetUserData()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            Console.WriteLine(token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync("https://localhost:7196/rest/v1/users/me");
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
        public async Task<IActionResult> GetUserCashFlow([FromQuery] ReqPaginationQuery paginationQuery)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            Console.WriteLine(token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"https://localhost:7196/rest/v1/users/me/cash-flow?pageNumber={paginationQuery.PageNumber}&pageSize={paginationQuery.PageSize}&orderBy={paginationQuery.OrderBy}&orderDirection={paginationQuery.OrderDirection}");
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
        public async Task<IActionResult> Withdrawal([FromBody] ReqCashFlowDto reqCashFlowDto)
        {
            Console.WriteLine("inside withdrawal");
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            Console.WriteLine(token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var json = JsonSerializer.Serialize(reqCashFlowDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PatchAsync($"https://localhost:7196/rest/v1/users/balances", content);
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
        public async Task<IActionResult> TopUp([FromBody] ReqCashFlowDto reqCashFlowDto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            Console.WriteLine(token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var json = JsonSerializer.Serialize(reqCashFlowDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PatchAsync($"https://localhost:7196/rest/v1/users/balances", content);
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
    }
}
