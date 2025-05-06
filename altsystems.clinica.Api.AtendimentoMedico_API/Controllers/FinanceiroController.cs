using Microsoft.AspNetCore.Mvc;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Services;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinanceiroController : ControllerBase
    {
        private readonly FinanceiroService _financeiroService;

        public FinanceiroController(FinanceiroService financeiroService)
        {
            _financeiroService = financeiroService;
        }

        [HttpPost("faturamentos")]
        public async Task<IActionResult> ListarFaturamentos([FromBody] FiltroFinanceiroDTO filtro)
        {
            var result = await _financeiroService.ListarFaturamentosAsync(filtro);
            return Ok(result);
        }
    }
}