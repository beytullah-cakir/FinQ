namespace PersonalFinanceTracker.Features.Transactions;

using PersonalFinanceTracker.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

public static class TransactionEndpoints
{
    public static void MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/transactions")
                       .RequireAuthorization() // Bu grup altındaki tüm endpointler artık JWT ister!
                       .WithTags("Transactions");

        // GET: Sadece giriş yapan kullanıcının kendi işlemlerini getirir
        group.MapGet("/", async (Supabase.Client client, ClaimsPrincipal user) =>
        {
            var userId = GetUserId(user);
            var response = await client.From<Transaction>()
                                       .Where(x => x.UserId == userId)
                                       .Get();
            
            return Results.Ok(response.Models);
        });

        // POST: Yeni İşlem Ekleme (UserId'yi JWT'den otomatik alır)
        group.MapPost("/", async (Supabase.Client client, ClaimsPrincipal user, [FromBody] TransactionDto request) =>
        {
            var userId = GetUserId(user);
            
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId, // Manuel gönderim yerine Token'dan gelen güvenli ID kullanılır
                Title = request.Title,
                Amount = request.Amount,
                TransactionDate = request.TransactionDate,
                CreatedAt = DateTime.UtcNow
            };

            var response = await client.From<Transaction>().Insert(transaction);
            
            if (response.ResponseMessage != null && !response.ResponseMessage.IsSuccessStatusCode)
            {
                var error = await response.ResponseMessage.Content.ReadAsStringAsync();
                return Results.BadRequest(new { message = "İşlem kaydedilemedi", error });
            }

            return Results.Created($"/api/transactions/{transaction.Id}", new 
            { 
                Id = transaction.Id,
                Title = transaction.Title,
                Amount = transaction.Amount,
                TransactionDate = transaction.TransactionDate,
                CreatedAt = transaction.CreatedAt
            });
        });

        // DELETE: Sadece kendi işlemini silebilir
        group.MapDelete("/{id:guid}", async (Supabase.Client client, ClaimsPrincipal user, Guid id) =>
        {
            var userId = GetUserId(user);
            
            // Hem ID hem de UserId kontrolü yaparak başkasının verisini silmeyi engelliyoruz
            await client.From<Transaction>()
                        .Where(x => x.Id == id)
                        .Where(x => x.UserId == userId)
                        .Delete();
                        
            return Results.NoContent();
        });
    }

    private static Guid GetUserId(ClaimsPrincipal user)
    {
        var sub = user.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                  ?? user.FindFirst("sub")?.Value;
                  
        return Guid.Parse(sub!);
    }
}

// DTO'da artık UserId'ye gerek kalmadı, çünkü token'dan alıyoruz!
public record TransactionDto(string Title, decimal Amount, DateTime TransactionDate);
