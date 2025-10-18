using cadastro_de_pessoas.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace cadastro_de_pessoas.Server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Pessoa> Pessoas { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pessoa>()
                .HasIndex(p => p.PessoaCPF)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}