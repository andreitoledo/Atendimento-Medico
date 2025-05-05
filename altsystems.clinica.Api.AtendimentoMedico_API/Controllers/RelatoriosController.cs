using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

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
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .Where(a => a.DataConsulta.Date >= inicio.Date && a.DataConsulta.Date <= fim.Date)
                .GroupBy(a => new
                {
                    Dia = a.DataConsulta.Date,
                    Nome = a.Medico.Usuario.Nome,
                    Especialidade = a.Medico.Especialidade
                })      

                .Select(g => new RelatorioConsultaDTO
                {
                    Dia = g.Key.Dia,
                    NomeMedico = g.Key.Nome,
                    Especialidade = g.Key.Especialidade,
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
                .GroupBy(a => new
                {
                    Nome = a.Medico.Usuario.Nome,
                    Especialidade = a.Medico.Especialidade
                })
                .Select(g => new RelatorioConsultaDTO
                {
                    NomeMedico = g.Key.Nome,
                    Especialidade = g.Key.Especialidade,
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
        public async Task<IActionResult> ProducaoMedica()
        {
            var result = await _context.Agendamentos
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .GroupBy(a => new
                {
                    NomeMedico = a.Medico.Usuario.Nome,
                    Especialidade = a.Medico.Especialidade
                })
                .Select(g => new RelatorioConsultaDTO
                {
                    NomeMedico = g.Key.NomeMedico,
                    Especialidade = g.Key.Especialidade,
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

        [HttpGet("agendamentos-por-periodo")]
        public async Task<IActionResult> GetAgendamentosPorPeriodo([FromQuery] DateTime inicio, [FromQuery] DateTime fim)
        {
            var agendamentos = await _context.Agendamentos
                .Include(a => a.Medico).ThenInclude(m => m.Usuario)
                .Include(a => a.Paciente).ThenInclude(p => p.Usuario)
                .Where(a => a.DataConsulta >= inicio && a.DataConsulta <= fim)
                .OrderBy(a => a.DataConsulta)
                .Select(a => new
                {
                    DataConsulta = a.DataConsulta,
                    Paciente = a.Paciente.Usuario.Nome,
                    Medico = a.Medico.Usuario.Nome,
                    Status = a.Status,
                    Plataforma = a.Plataforma
                })
                .ToListAsync();

            return Ok(agendamentos);
        }

        [HttpGet("exportar-csv")]
        public async Task<IActionResult> ExportarCsv([FromQuery] DateTime inicio, [FromQuery] DateTime fim)
        {
            var registros = await _context.Agendamentos
                .Where(a => a.DataConsulta >= inicio && a.DataConsulta <= fim)
                .ToListAsync();

            var sb = new StringBuilder();
            sb.AppendLine("Data,Paciente,Medico");

            foreach (var a in registros)
            {
                sb.AppendLine($"{a.DataConsulta:yyyy-MM-dd},{a.Paciente?.Usuario?.Nome},{a.Medico?.Usuario?.Nome}");
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            var output = new MemoryStream(bytes);

            return File(output, "text/csv", $"agendamentos_{inicio:yyyyMMdd}_{fim:yyyyMMdd}.csv");
        }


    }
}