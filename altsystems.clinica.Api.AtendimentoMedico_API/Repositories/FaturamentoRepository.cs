using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class FaturamentoRepository : IFaturamentoRepository
    {
        private readonly ClinicaContext _context;

        public FaturamentoRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Faturamento>> ObterTodos()
        {
            return await _context.Faturamentos
                .Include(f => f.Agendamento)
                    .ThenInclude(a => a.Paciente)
                        .ThenInclude(p => p.Usuario)
                .Include(f => f.Agendamento)
                    .ThenInclude(a => a.Medico)
                        .ThenInclude(m => m.Usuario)
                .ToListAsync();
        }

        public async Task<IEnumerable<Faturamento>> ObterPorPeriodo(DateTime dataInicio, DateTime dataFim)
        {
            return await _context.Faturamentos
                .Include(f => f.Agendamento)
                    .ThenInclude(a => a.Paciente)
                        .ThenInclude(p => p.Usuario)
                .Include(f => f.Agendamento)
                    .ThenInclude(a => a.Medico)
                        .ThenInclude(m => m.Usuario)
                .Where(f => f.Data >= dataInicio && f.Data <= dataFim)
                .ToListAsync();
        }

        public async Task<Faturamento> ObterPorId(int id)
        {
            return await _context.Faturamentos.FindAsync(id);
        }

        public async Task<Faturamento> Criar(Faturamento faturamento)
        {
            _context.Faturamentos.Add(faturamento);
            await _context.SaveChangesAsync();
            return faturamento;
        }

        public async Task<Faturamento> Atualizar(Faturamento faturamento)
        {
            _context.Entry(faturamento).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return faturamento;
        }

        public async Task<bool> Deletar(int id)
        {
            var item = await _context.Faturamentos.FindAsync(id);
            if (item == null) return false;

            _context.Faturamentos.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}