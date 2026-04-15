using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace PersonalFinanceTracker.Features.Profile;

public static class ProfileEndPoints
{
    public static void MapProfileEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/profile")
                       .RequireAuthorization();

        // Profil Bilgilerini Güncelleme
        group.MapPut("/update", async (AppDbContext db, ClaimsPrincipal user, [FromBody] UpdateProfileRequest request) =>
        {
            var userId = GetUserId(user);
            var currentUser = await db.Users.FirstOrDefaultAsync(x => x.Id == userId, System.Threading.CancellationToken.None);

            if (currentUser == null)
            {
                return Results.NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            // Email değişikliği kontrolü
            if (!string.IsNullOrEmpty(request.Email) && currentUser.Email != request.Email)
            {
                var emailExists = await db.Users.AnyAsync(x => x.Email == request.Email, System.Threading.CancellationToken.None);
                if (emailExists)
                {
                    return Results.BadRequest(new { message = "Bu email adresi başka bir kullanıcı tarafından kullanılıyor." });
                }
                currentUser.Email = request.Email;
            }

            // İsim güncelleme
            if (!string.IsNullOrEmpty(request.FullName))
            {
                currentUser.FullName = request.FullName;
            }
            
            await db.SaveChangesAsync(System.Threading.CancellationToken.None);

            return Results.Ok(new 
            { 
                message = "Profil başarıyla güncellendi.",
                user = new { currentUser.FullName, currentUser.Email, currentUser.Id }
            });
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

    private record UpdateProfileRequest(string FullName, string Email, string? Password);
}


