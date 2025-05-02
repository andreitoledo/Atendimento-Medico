using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecepcaoController : ControllerBase
    {
        private readonly IRecepcaoRepository _repository;

        public RecepcaoController(IRecepcaoRepository repository)
        {
            _repository = repository;
        }


        [HttpGet("hoje")]
        public async Task<ActionResult<List<AgendamentoRecepcaoDTO>>> ObterAgendamentosDoDia()
        {
            var agendamentos = await _repository.ObterAgendamentosDoDia();
            return Ok(agendamentos);
        }

        [HttpPut("checkin/{id}")]
        public async Task<IActionResult> MarcarCheckIn(int id)
        {
            var resultado = await _repository.MarcarCheckIn(id);
            return resultado ? Ok() : NotFound();
        }

        [HttpPut("status/{id}")]
        public async Task<IActionResult> AtualizarStatus(int id, [FromBody] string novoStatus)
        {
            var resultado = await _repository.AtualizarStatus(id, novoStatus);
            return resultado ? Ok() : NotFound();
        }
    }
}