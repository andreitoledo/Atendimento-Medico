using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class AgendamentoRepository : IAgendamentoRepository
    {
        private readonly ClinicaContext _context;
        public AgendamentoRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Agendamento>> ObterTodos(string? status = null)
        {
            var query = _context.Agendamentos               
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .Include(a => a.Paciente).ThenInclude(p => p.Usuario)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(a => a.Status == status);
            }

            return await query.ToListAsync();
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

        public async Task<IEnumerable<Agendamento>> ObterNaoPagosAsync()
        {
            // IDs de agendamentos que já estão faturados e pagos
            var agendamentosPagos = await _context.Faturamentos
                .Where(f => f.StatusPagamento == "Pago")
                .Select(f => f.AgendamentoId)
                .ToListAsync();

            // Retorna os agendamentos com check-in, que não foram pagos ainda
            return await _context.Agendamentos
                .Include(a => a.Paciente).ThenInclude(p => p.Usuario)
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .Where(a => a.CheckIn && !agendamentosPagos.Contains(a.Id))
                .ToListAsync();
        }

        public async Task<IEnumerable<Agendamento>> ObterNaoAtendidosAsync()
        {
            return await _context.Agendamentos
                .Include(a => a.Paciente).ThenInclude(p => p.Usuario)
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .Where(a => !a.Atendido)
                .ToListAsync();
        }

        public async Task<EspecialidadeDTO?> ObterEspecialidadePorAgendamentoAsync(int agendamentoId)
        {
            var agendamento = await _context.Agendamentos
                .Include(a => a.Medico)
                    .ThenInclude(m => m.MedicoEspecialidades)
                        .ThenInclude(me => me.Especialidade)
                .FirstOrDefaultAsync(a => a.Id == agendamentoId);

            var especialidade = agendamento?.Medico?.MedicoEspecialidades
                .Select(me => me.Especialidade)
                .FirstOrDefault();

            if (especialidade == null) return null;

            return new EspecialidadeDTO
            {
                Id = especialidade.Id,
                EspecialidadeId = especialidade.Id, // se ainda precisar desse campo duplicado
                Titulo = especialidade.Titulo,
                Descricao = especialidade.Descricao
            };
        }



    }
}