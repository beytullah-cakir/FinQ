using Microsoft.EntityFrameworkCore;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PersonalFinanceTracker.Features.Transactions;

public static class TransactionEndpoints
{
    public static void MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/transactions")
                       .RequireAuthorization();

        group.MapGet("/", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = GetUserId(user);
            
            var transactions = await db.Transactions
                                       .Where(x => x.UserId == userId)
                                       .ToListAsync(System.Threading.CancellationToken.None);
            
            return Results.Ok(transactions);
        });

        
        group.MapPost("/", async (AppDbContext db, ClaimsPrincipal user, [FromBody] TransactionDto request) =>
        {
            var userId = GetUserId(user);
            
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = request.Title,
                Amount = request.Amount,
                TransactionDate = DateTime.SpecifyKind(request.TransactionDate, DateTimeKind.Utc),
                CreatedAt = DateTime.UtcNow
            };

            db.Transactions.Add(transaction);
            await db.SaveChangesAsync(System.Threading.CancellationToken.None);

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
        group.MapDelete("/{id:guid}", async (AppDbContext db, ClaimsPrincipal user, Guid id) =>
        {
            var userId = GetUserId(user);
            
            var transaction = await db.Transactions
                                      .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, System.Threading.CancellationToken.None);

            if (transaction == null)
            {
                return Results.NotFound();
            }

            db.Transactions.Remove(transaction);
            await db.SaveChangesAsync(System.Threading.CancellationToken.None);
                        
            return Results.NoContent();
        });
    }

    private static Guid GetUserId(ClaimsPrincipal user)
    {
        var sub = user.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                  ?? user.FindFirst("sub")?.Value;
                  
        if (string.IsNullOrEmpty(sub))
        {
            throw new Exception("Unauthorized: User ID not found in token.");
        }

        return Guid.Parse(sub);
    }
}

public record TransactionDto(string Title, decimal Amount, DateTime TransactionDate);
