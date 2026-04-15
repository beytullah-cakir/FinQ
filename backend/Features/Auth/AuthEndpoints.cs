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
using AutoMapper;
using PersonalFinanceTracker.Infrastructure.Dtos;

namespace PersonalFinanceTracker.Features.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");

        // register
        group.MapPost("/register", async (AppDbContext db, IMapper mapper, [FromBody] RegisterRequest request) =>
        {
            try 
            {
                // check if user exists
                var existingUser = await db.Users.AnyAsync(x => x.Email == request.Email, 
                System.Threading.CancellationToken.None);
                if (existingUser)
                {
                    return Results.BadRequest(new { message = "Bu email adresi zaten kullanımda." });
                }

                // Şifreyi hashleyerek güvenli hale getiriyoruz
                var salt = BCrypt.Net.BCrypt.GenerateSalt();
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password, salt);
 
                var newUser = mapper.Map<User>(request);
                newUser.PasswordHash = hashedPassword;

                db.Users.Add(newUser);
                await db.SaveChangesAsync(System.Threading.CancellationToken.None);
                return Results.Ok(new { message = "Kayıt başarıyla oluşturuldu." });
            }
            catch (Exception ex)
            {
                 return Results.BadRequest(new { message = $"Veritabanı hatası: {ex.Message}" });
            }
        });

        // 2. GİRİŞ YAPMA (LOGIN)
        group.MapPost("/login", async (AppDbContext db, IConfiguration config, IMapper mapper, [FromBody] LoginRequest request) =>
        {
            // Kullanıcıyı emaili ile arıyoruz
            var user = await db.Users.FirstOrDefaultAsync(x => x.Email == request.Email, System.Threading.CancellationToken.None);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Results.Unauthorized();
            }

            // Giriş başarılı, JWT token'ı manuel olarak üretiyoruz
            var tokenString = GenerateJwtToken(user, config);
 
            var userResponse = mapper.Map<UserResponse>(user);
            return Results.Ok(new 
            { 
                Token = tokenString, 
                User = userResponse
            });
        });
    }

    private static string GenerateJwtToken(User user, IConfiguration config)
    {
        var jwtSecret = config["Supabase:JwtSecret"] ?? throw new Exception("JwtSecret missing");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("sub", user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("full_name", user.FullName)
        };

        var token = new JwtSecurityToken(
            issuer: $"{config["Supabase:Url"]}/auth/v1",
            audience: "authenticated",
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
