using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class AgendamentoRepository : IAgendamentoRepository
    {
        private readonly ClinicaContext _context;
        public AgendamentoRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Agendamento>> ObterTodos()
        {
            return await _context.Agendamentos               
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .Include(a => a.Paciente).ThenInclude(p => p.Usuario)
                .ToListAsync();
        }

        public async Task<Agendamento> ObterPorId(int id)
        {
            return await _context.Agendamentos
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .Include(a => a.Paciente).ThenInclude(p => p.Usuario)
                .FirstOrDefaultAsync(a => a.Id == id);
                //.ToListAsync();
        }

        public async Task<Agendamento> Criar(Agendamento agendamento)
        {
            _context.Agendamentos.Add(agendamento);
            await _context.SaveChangesAsync();
            return agendamento;
        }

        public async Task<Agendamento> Atualizar(Agendamento agendamento)
        {
            _context.Entry(agendamento).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return agendamento;
        }

        public async Task<bool> Deletar(int id)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);
            if (agendamento == null) return false;
            _context.Agendamentos.Remove(agendamento);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarcarCheckIn(int id)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);
            if (agendamento == null) return false;

            agendamento.CheckIn = true;

            _context.Entry(agendamento).Property(a => a.CheckIn).IsModified = true;

            await _context.SaveChangesAsync();
            return true;
        }

    }
}