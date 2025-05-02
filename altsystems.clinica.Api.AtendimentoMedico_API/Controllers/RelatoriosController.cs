using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatoriosController : ControllerBase
    {
        private readonly ClinicaContext _context;

        public RelatoriosController(ClinicaContext context)
        {
            _context = context;
        }

        [HttpGet("consultas-por-dia")]
        public async Task<ActionResult<IEnumerable<RelatorioConsultaDTO>>> ConsultasPorDia(DateTime inicio, DateTime fim)
        {
            var result = await _context.Agendamentos
                .Where(a => a.DataConsulta.Date >= inicio.Date && a.DataConsulta.Date <= fim.Date)
                .GroupBy(a => a.DataConsulta.Date)
                .Select(g => new RelatorioConsultaDTO
                {
                    Dia = g.Key,
                    TotalConsultas = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("consultas-por-medico")]
        public async Task<ActionResult<IEnumerable<RelatorioConsultaDTO>>> ConsultasPorMedico()
        {
            var result = await _context.Agendamentos
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .GroupBy(a => new { a.Medico.Usuario.Nome })
                .Select(g => new RelatorioConsultaDTO
                {
                    NomeMedico = g.Key.Nome,
                    TotalConsultas = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("consultas-por-especialidade")]
        public async Task<ActionResult<IEnumerable<RelatorioConsultaDTO>>> ConsultasPorEspecialidade()
        {
            var result = await _context.Agendamentos
                .Include(a => a.Medico)
                .GroupBy(a => a.Medico.Especialidade)
                .Select(g => new RelatorioConsultaDTO
                {
                    Especialidade = g.Key,
                    TotalConsultas = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("total-faturado")]
        public async Task<ActionResult<IEnumerable<RelatorioFaturamentoDTO>>> TotalFaturado(DateTime inicio, DateTime fim)
        {
            var result = await _context.Faturamentos
                .Where(f => f.Data >= inicio && f.Data <= fim)
                .GroupBy(f => f.Data.Date)
                .Select(g => new RelatorioFaturamentoDTO
                {
                    Dia = g.Key,
                    Total = g.Sum(f => f.Valor)
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("producao-medica")]
        public async Task<ActionResult<IEnumerable<RelatorioConsultaDTO>>> ProducaoMedica()
        {
            var result = await _context.Agendamentos
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .GroupBy(a => new { a.Medico.Usuario.Nome })
                .Select(g => new RelatorioConsultaDTO
                {
                    NomeMedico = g.Key.Nome,
                    TotalConsultas = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("comparecimentos")]
        public async Task<ActionResult<IEnumerable<RelatorioComparecimentoDTO>>> Comparecimentos()
        {
            var result = await _context.Agendamentos
                .GroupBy(a => a.Status)
                .Select(g => new RelatorioComparecimentoDTO
                {
                    Status = g.Key,
                    Quantidade = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("consultas-por-paciente")]
        public async Task<ActionResult<IEnumerable<RelatorioPacienteDTO>>> ConsultasPorPaciente()
        {
            var result = await _context.Agendamentos
                .Include(a => a.Paciente).ThenInclude(p => p.Usuario)
                .GroupBy(a => a.Paciente.Usuario.Nome)
                .Select(g => new RelatorioPacienteDTO
                {
                    NomePaciente = g.Key,
                    TotalConsultas = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}