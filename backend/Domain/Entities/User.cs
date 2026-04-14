using Postgrest.Attributes;
using Postgrest.Models;

namespace PersonalFinanceTracker.Domain.Entities;

[Table("users")]
public class User : BaseModel
{
    [PrimaryKey("id", false)]
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
