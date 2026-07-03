using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialBaseDesign : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "documents",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    edit_key_hash = table.Column<string>(type: "text", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: true),
                    expire_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_documents", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pages",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    page_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    content = table.Column<string>(type: "character varying(100000)", maxLength: 100000, nullable: false),
                    page_number = table.Column<short>(type: "smallint", nullable: false),
                    document_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_pages", x => x.id);
                    table.CheckConstraint("CK_Page_PageNumber", "page_number > 0");
                    table.ForeignKey(
                        name: "fk_pages_documents_document_id",
                        column: x => x.document_id,
                        principalTable: "documents",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "documents",
                columns: new[] { "id", "created_at", "edit_key_hash", "expire_at", "password_hash", "title" },
                values: new object[] { "sample1", new DateTime(2026, 8, 1, 0, 0, 0, 0, DateTimeKind.Utc), "samplekey", new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Sample Document" });

            migrationBuilder.InsertData(
                table: "pages",
                columns: new[] { "id", "content", "created_at", "document_id", "page_name", "page_number" },
                values: new object[,]
                {
                    { 1, "# A Title\n\nThis is the content of the first page.", new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc), "sample1", "Introduction", (short)1 },
                    { 2, "- This is the content of the second page.", new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc), "sample1", "Second Page", (short)2 }
                });

            migrationBuilder.CreateIndex(
                name: "ix_pages_document_id_page_number",
                table: "pages",
                columns: new[] { "document_id", "page_number" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "pages");

            migrationBuilder.DropTable(
                name: "documents");
        }
    }
}
