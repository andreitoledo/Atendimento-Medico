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
        public DbSet<ProntuarioPsicologo> ProntuariosPsicologo { get; set; }
        public DbSet<Especialidade> Especialidades { get; set; }
        public DbSet<MedicoEspecialidade> MedicoEspecialidades { get; set; }
        public DbSet<Faturamento> Faturamentos { get; set; }
        public DbSet<Triagem> Triagens { get; set; }
        public DbSet<Consulta> Consultas { get; set; }
        public DbSet<Prescricao> Prescricoes { get; set; }
        public DbSet<Exame> Exames { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Mapear entidades para tabelas
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
            modelBuilder.Entity<ProntuarioPsicologo>().ToTable("ProntuariosPsicologo");
            modelBuilder.Entity<Especialidade>().ToTable("Especialidades");
            modelBuilder.Entity<MedicoEspecialidade>().ToTable("MedicoEspecialidades");
            modelBuilder.Entity<Faturamento>().ToTable("Faturamentos");
            modelBuilder.Entity<Triagem>().ToTable("Triagens");
            modelBuilder.Entity<Consulta>().ToTable("Consultas");
            modelBuilder.Entity<Prescricao>().ToTable("Prescricoes");
            modelBuilder.Entity<Exame>().ToTable("Exames");






            // Chave composta para tabela intermediária
            modelBuilder.Entity<MedicoEspecialidade>()
                .HasKey(me => new { me.MedicoId, me.EspecialidadeId });

            modelBuilder.Entity<MedicoEspecialidade>()
                .HasOne(me => me.Medico)
                .WithMany(m => m.MedicoEspecialidades)
                .HasForeignKey(me => me.MedicoId);

            modelBuilder.Entity<MedicoEspecialidade>()
                .HasOne(me => me.Especialidade)
                .WithMany()
                .HasForeignKey(me => me.EspecialidadeId);

            modelBuilder.Entity<Faturamento>()
                .HasOne(f => f.Agendamento)
                .WithMany()
                .HasForeignKey(f => f.AgendamentoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Faturamento>()
                .HasOne(f => f.Paciente)
                .WithMany()
                .HasForeignKey(f => f.PacienteId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
