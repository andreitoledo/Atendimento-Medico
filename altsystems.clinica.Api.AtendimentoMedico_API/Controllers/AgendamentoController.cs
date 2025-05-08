using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgendamentoController : ControllerBase
    {
        private readonly IAgendamentoRepository _repository;

        public AgendamentoController(IAgendamentoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AgendamentoDTO>>> GetAgendamentos([FromQuery] string? status)
        {
            var agendamentos = await _repository.ObterTodos(status);
            var result = agendamentos.Select(a => new AgendamentoDTO
            {
                Id = a.Id,
                MedicoId = a.MedicoId,
                NomeMedico = a.Medico?.Usuario?.Nome,
                PacienteId = a.PacienteId,
                NomePaciente = a.Paciente?.Usuario?.Nome,
                DataConsulta = a.DataConsulta,
                Status = a.Status,
                Plataforma = a.Plataforma,
                LinkVideo = a.LinkVideo,
                CheckIn = a.CheckIn
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AgendamentoDTO>> GetAgendamento(int id)
        {
            var a = await _repository.ObterPorId(id);
            if (a == null) return NotFound();

            return Ok(new AgendamentoDTO
            {
                Id = a.Id,
                MedicoId = a.MedicoId,
                NomeMedico = a.Medico?.Usuario?.Nome,
                PacienteId = a.PacienteId,
                NomePaciente = a.Paciente?.Usuario?.Nome,
                DataConsulta = a.DataConsulta,
                Status = a.Status,
                Plataforma = a.Plataforma,
                LinkVideo = a.LinkVideo,
                CheckIn = a.CheckIn
            });
        }

        [HttpPost]
        public async Task<ActionResult<AgendamentoDTO>> CreateAgendamento(AgendamentoCreateDTO dto)
        {
            var agendamento = new Agendamento
            {
                MedicoId = dto.MedicoId,
                PacienteId = dto.PacienteId,
                DataConsulta = dto.DataConsulta,
                Plataforma = dto.Plataforma,
                LinkVideo = dto.LinkVideo,
                Status = "agendado"
            };

            var created = await _repository.Criar(agendamento);

            return CreatedAtAction(nameof(GetAgendamento), new { id = created.Id }, new AgendamentoDTO
            {
                Id = created.Id,
                MedicoId = created.MedicoId,
                PacienteId = created.PacienteId,
                DataConsulta = created.DataConsulta,
                Status = created.Status,
                Plataforma = created.Plataforma,
                LinkVideo = created.LinkVideo
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAgendamento(int id, AgendamentoCreateDTO dto)
        {
            var agendamento = await _repository.ObterPorId(id);
            if (agendamento == null) return NotFound();

            agendamento.MedicoId = dto.MedicoId;
            agendamento.PacienteId = dto.PacienteId;
            agendamento.DataConsulta = dto.DataConsulta;
            agendamento.Plataforma = dto.Plataforma;
            agendamento.LinkVideo = dto.LinkVideo;
            agendamento.Status = dto.Status;

            await _repository.Atualizar(agendamento);
            return NoContent();
        }

        [HttpPut("{id}/checkin")]
        public async Task<IActionResult> MarcarCheckIn(int id)
        {
            var result = await _repository.MarcarCheckIn(id);
            if (!result) return NotFound();

            return NoContent();
        }

        [HttpGet("nao-atendidos")]
        public async Task<IActionResult> ObterNaoAtendidos()
        {
            var agendamentos = await _repository.ObterNaoAtendidosAsync();
            return Ok(agendamentos);
        }

       
        [HttpGet("nao-pagos")]
        public async Task<IActionResult> ObterNaoPagos()
        {
            var result = await _repository.ObterNaoPagosAsync();
            return Ok(result);

            
        }




        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAgendamento(int id)
        {
            var deleted = await _repository.Deletar(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}