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
    }
}