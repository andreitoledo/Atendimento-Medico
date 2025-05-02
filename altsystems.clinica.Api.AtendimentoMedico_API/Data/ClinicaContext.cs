using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Data
{
    public class ClinicaContext : DbContext
    {
        public ClinicaContext(DbContextOptions<ClinicaContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Medico> Medicos { get; set; }
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Agendamento> Agendamentos { get; set; }
        public DbSet<ProntuarioClinico> ProntuariosClinico { get; set; }
        public DbSet<Atestado> Atestados { get; set; }
        public DbSet<CAT> CATs { get; set; }
        public DbSet<Receita> Receitas { get; set; }
        public DbSet<LogUsuario> LogsUsuarios { get; set; }
        public DbSet<ProntuarioPsiquiatra> ProntuariosPsiquiatra { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>().ToTable("Usuarios");
            modelBuilder.Entity<Medico>().ToTable("Medicos");
            modelBuilder.Entity<Paciente>().ToTable("Pacientes");
            modelBuilder.Entity<Agendamento>().ToTable("Agendamentos");
            modelBuilder.Entity<ProntuarioClinico>().ToTable("ProntuariosClinico");
            modelBuilder.Entity<Atestado>().ToTable("Atestados");
            modelBuilder.Entity<CAT>().ToTable("CATs");
            modelBuilder.Entity<Receita>().ToTable("Receitas");
            modelBuilder.Entity<LogUsuario>().ToTable("LogsUsuarios");
            modelBuilder.Entity<ProntuarioPsiquiatra>().ToTable("ProntuariosPsiquiatra");
        }
    }
}