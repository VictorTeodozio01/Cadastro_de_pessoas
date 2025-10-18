using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cadastro_de_pessoas.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pessoas",
                columns: table => new
                {
                    PessoaId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PessoaNome = table.Column<string>(type: "TEXT", nullable: false),
                    PessoaDataNascimento = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PessoaCPF = table.Column<string>(type: "TEXT", nullable: false),
                    PessoaDataCadastro = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PessoaDataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pessoas", x => x.PessoaId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pessoas_PessoaCPF",
                table: "Pessoas",
                column: "PessoaCPF",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pessoas");
        }
    }
}
