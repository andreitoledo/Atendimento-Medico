using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatorioFinanceiroController : ControllerBase
    {
        private readonly ClinicaContext _context;

        public RelatorioFinanceiroController(ClinicaContext context)
        {
            _context = context;
        }

        // GET: api/RelatorioFinanceiro/por-paciente/2
        [HttpGet("por-paciente/{pacienteId}")]
        public async Task<IActionResult> GetPorPaciente(int pacienteId)
        {
            var faturamentos = await _context.Faturamentos
                .Where(f => f.PacienteId == pacienteId)
                .OrderByDescending(f => f.Data)
                .ToListAsync();

            var total = faturamentos.Sum(f => f.Valor);

            return Ok(new
            {
                PacienteId = pacienteId,
                Total = total,
                Registros = faturamentos
            });
        }

        // GET: api/RelatorioFinanceiro/por-periodo?inicio=2025-05-01&fim=2025-05-31
        [HttpGet("por-periodo")]
        public async Task<IActionResult> GetPorPeriodo([FromQuery] DateTime inicio, [FromQuery] DateTime fim)
        {
            var faturamentos = await _context.Faturamentos
                .Where(f => f.Data >= inicio && f.Data <= fim)
                .OrderBy(f => f.Data)
                .ToListAsync();

            var total = faturamentos.Sum(f => f.Valor);

            return Ok(new
            {
                PeriodoInicio = inicio,
                PeriodoFim = fim,
                Total = total,
                Registros = faturamentos
            });
        }
    }
}