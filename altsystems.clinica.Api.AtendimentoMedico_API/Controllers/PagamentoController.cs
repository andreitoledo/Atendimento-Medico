using Microsoft.AspNetCore.Mvc;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Services;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagamentoController : ControllerBase
    {
        private readonly PagamentoService _pagamentoService;

        public PagamentoController(PagamentoService pagamentoService)
        {
            _pagamentoService = pagamentoService;
        }

        [HttpPost("simular")]
        public async Task<IActionResult> SimularPagamento([FromBody] PagamentoDTO dto)
        {
            var result = await _pagamentoService.SimularPagamentoAsync(dto);
            return Ok(result);
        }

        [HttpPost("conciliar/{agendamentoId}")]
        public async Task<IActionResult> ConciliarPagamento(int agendamentoId)
        {
            var result = await _pagamentoService.ConciliarPagamentoAsync(agendamentoId);
            if (!result.Sucesso)
                return NotFound(result);

            return Ok(result);
        }

        [HttpPost("conciliar/faturamento/{faturamentoId}")]
        public async Task<IActionResult> ConciliarFaturamento(int faturamentoId)
        {
            var result = await _pagamentoService.ConciliarFaturamentoAsync(faturamentoId);
            if (!result.Sucesso)
                return NotFound(result);

            return Ok(result);
        }


    }

}