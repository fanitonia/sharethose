using Application.Features.Documents.DTOs.Objects;
using Application.Features.Documents.DTOs.Responses;
using AutoMapper;
using Domain.Entities;

namespace Application.Features.Documents.Mappers;

internal class DocumentProfile : Profile
{
    public DocumentProfile()
    {
        CreateMap<Document, DocumentResponse>();
        CreateMap<Page, PageObject>();
    }
}
