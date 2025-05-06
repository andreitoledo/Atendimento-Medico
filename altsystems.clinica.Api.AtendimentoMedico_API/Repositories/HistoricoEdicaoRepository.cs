using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class HistoricoEdicaoRepository : IHistoricoEdicaoRepository
    {
        private readonly ClinicaContext _context;

        public HistoricoEdicaoRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task Registrar(HistoricoEdicao log)
        {
            _context.HistoricoEdicoes.Add(log);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<HistoricoEdicao>> ObterPorPaciente(int pacienteId)
        {
            return await _context.HistoricoEdicoes
                .Where(h => h.PacienteId == pacienteId)
                .OrderByDescending(h => h.DataAlteracao)
                .ToListAsync();
        }
    }
}