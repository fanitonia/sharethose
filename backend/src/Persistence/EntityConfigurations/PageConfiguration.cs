using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

internal class PageConfiguration : IEntityTypeConfiguration<Page>
{
    public void Configure(EntityTypeBuilder<Page> entity)
    {
        entity.Property(p => p.Name)
            .HasMaxLength(50)
            .IsRequired();

        entity.Property(p => p.Content)
            .IsRequired()
            .HasMaxLength(100000);

        entity.Property(p => p.PageNumber)
            .HasColumnType("smallint")
            .IsRequired();

        entity.ToTable(t => t.HasCheckConstraint("CK_Page_PageNumber", "page_number > 0"));
    }
}
