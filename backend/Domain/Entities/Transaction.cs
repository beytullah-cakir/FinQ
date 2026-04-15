using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalFinanceTracker.Domain.Entities;

[Table("transactions")]
public class Transaction
{
    [Column("id")]
    public Guid Id { get; set; }

    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("amount")]
    public decimal Amount { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [Column("category_id")]
    public Guid? CategoryId { get; set; }

    [Column("transaction_date")]
    public DateTime TransactionDate { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
