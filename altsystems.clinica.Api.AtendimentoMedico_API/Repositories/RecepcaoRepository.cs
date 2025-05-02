using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class RecepcaoRepository : IRecepcaoRepository
    {
        private readonly ClinicaContext _context;

        public RecepcaoRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<List<AgendamentoRecepcaoDTO>> ObterAgendamentosDoDia()
        {
            var hoje = DateTime.Today;
            return await _context.Agendamentos
                .Include(a => a.Paciente).ThenInclude(p => p.Usuario)
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .Where(a => a.DataConsulta.Date == hoje)
                .Select(a => new AgendamentoRecepcaoDTO
                {
                    Id = a.Id,
                    PacienteNome = a.Paciente.Usuario.Nome,
                    MedicoNome = a.Medico.Usuario.Nome,
                    DataConsulta = a.DataConsulta,
                    Status = a.Status,
                    CheckIn = a.CheckIn
                })
                .ToListAsync();
        }

        public async Task<bool> MarcarCheckIn(int id)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);
            if (agendamento == null) return false;

            agendamento.CheckIn = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AtualizarStatus(int id, string status)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);
            if (agendamento == null) return false;

            agendamento.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}