using System;

namespace PersonalFinanceTracker.Infrastructure.Dtos;

public record TransactionRequest(string Title, decimal Amount, DateTime TransactionDate);

public record TransactionResponse
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public decimal Amount { get; init; }
    public DateTime TransactionDate { get; init; }
    public DateTime CreatedAt { get; init; }
}

public record UserResponse
{
    public Guid Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
}

// Auth Requests
public record RegisterRequest(string FullName, string Email, string Password);
public record LoginRequest(string Email, string Password);

// Profile Requests
public record UpdateProfileRequest(string FullName, string Email, string? Password);
