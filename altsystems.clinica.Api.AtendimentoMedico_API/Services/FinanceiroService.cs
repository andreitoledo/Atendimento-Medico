using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Services
{
    public class FinanceiroService
    {
        private readonly ClinicaContext _context;

        public FinanceiroService(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<List<FaturamentoResumoDTO>> ListarFaturamentosAsync(FiltroFinanceiroDTO filtro)
        {
            var query = _context.Faturamentos
                .Include(f => f.Paciente).ThenInclude(p => p.Usuario)
                .Include(f => f.Agendamento).ThenInclude(a => a.Medico).ThenInclude(m => m.Usuario)
                .AsQueryable();

            if (filtro.DataInicio.HasValue)
                query = query.Where(f => f.Data >= filtro.DataInicio.Value);

            if (filtro.DataFim.HasValue)
                query = query.Where(f => f.Data <= filtro.DataFim.Value);

            if (!string.IsNullOrEmpty(filtro.FormaPagamento))
                query = query.Where(f => f.FormaPagamento == filtro.FormaPagamento);

            if (!string.IsNullOrEmpty(filtro.StatusPagamento))
                query = query.Where(f => f.StatusPagamento == filtro.StatusPagamento);

            if (filtro.PacienteId.HasValue)
                query = query.Where(f => f.PacienteId == filtro.PacienteId);

            if (filtro.MedicoId.HasValue)
                query = query.Where(f => f.Agendamento.MedicoId == filtro.MedicoId);

            return await query
                .OrderByDescending(f => f.Data)
                .Select(f => new FaturamentoResumoDTO
                {
                    Id = f.Id,
                    Paciente = f.Paciente.Usuario.Nome,
                    Medico = f.Agendamento.Medico.Usuario.Nome,
                    Data = f.Data,
                    Valor = f.Valor,
                    FormaPagamento = f.FormaPagamento,
                    StatusPagamento = f.StatusPagamento
                }).ToListAsync();
        }
    }
}