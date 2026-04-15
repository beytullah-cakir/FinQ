using AutoMapper;
using PersonalFinanceTracker.Domain.Entities;
using PersonalFinanceTracker.Infrastructure.Dtos;

namespace PersonalFinanceTracker.Infrastructure.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Transaction Mapping
        CreateMap<Transaction, TransactionResponse>();
        CreateMap<TransactionRequest, Transaction>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.TransactionDate, opt => opt.MapFrom(src => DateTime.SpecifyKind(src.TransactionDate, DateTimeKind.Utc)));

        // User Mapping
        CreateMap<User, UserResponse>();
        CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
    }
}
