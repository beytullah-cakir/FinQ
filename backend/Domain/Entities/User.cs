using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalFinanceTracker.Domain.Entities;

[Table("users")]
public class User
{
    [Column("id")]
    public Guid Id { get; set; }

    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
