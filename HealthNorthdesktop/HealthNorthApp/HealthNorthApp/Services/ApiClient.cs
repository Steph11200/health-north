using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace HealthNorthApp.Services
{
    public class ApiClient
    {
        private readonly HttpClient _http = new HttpClient();
        public string? Token { get; private set; }

        public ApiClient(string baseUrl)
        {
            _http.BaseAddress = new System.Uri(baseUrl);
        }

        public void SetToken(string token)
        {
            Token = token;
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public async System.Threading.Tasks.Task<T> PostJsonAsync<T>(string path, object body)
        {
            var json = JsonSerializer.Serialize(body);
            var res = await _http.PostAsync(path,
                new StringContent(json, Encoding.UTF8, "application/json"));

            res.EnsureSuccessStatusCode();

            var txt = await res.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(txt, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
        }

        public async System.Threading.Tasks.Task<T> GetJsonAsync<T>(string path)
        {
            var res = await _http.GetAsync(path);
            res.EnsureSuccessStatusCode();

            var txt = await res.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(txt, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
        }
    }
}