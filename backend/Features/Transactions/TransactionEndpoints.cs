using Microsoft.EntityFrameworkCore;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AutoMapper;
using PersonalFinanceTracker.Infrastructure.Dtos;

namespace PersonalFinanceTracker.Features.Transactions;

public static class TransactionEndpoints
{
    public static void MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/transactions")
                       .RequireAuthorization();

        group.MapGet("/", async (AppDbContext db, ClaimsPrincipal user, IMapper mapper) =>
        {
            var userId = GetUserId(user);
            
            var transactions = await db.Transactions
                                       .Where(x => x.UserId == userId)
                                       .ToListAsync(System.Threading.CancellationToken.None);
            
            var response = mapper.Map<List<TransactionResponse>>(transactions);
            return Results.Ok(response);
        });

        
        group.MapPost("/", async (AppDbContext db, ClaimsPrincipal user, IMapper mapper, [FromBody] TransactionRequest request) =>
        {
            var userId = GetUserId(user);
            
            var transaction = mapper.Map<Transaction>(request);
            transaction.UserId = userId;

            db.Transactions.Add(transaction);
            await db.SaveChangesAsync(System.Threading.CancellationToken.None);

            var response = mapper.Map<TransactionResponse>(transaction);
            return Results.Created($"/api/transactions/{transaction.Id}", response);
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
