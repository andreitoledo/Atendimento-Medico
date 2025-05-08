using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using altsystems.clinica.Api.AtendimentoMedico_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReceitaController : ControllerBase
    {
        private readonly IConsultaRepository _consultaRepo;
        private readonly ReceitaPdfService _pdfService;

        public ReceitaController(IConsultaRepository consultaRepo, ReceitaPdfService pdfService)
        {
            _consultaRepo = consultaRepo;
            _pdfService = pdfService;
        }

        [HttpGet("{consultaId}/pdf")]
        public async Task<IActionResult> GerarReceitaPdf(int consultaId)
        {
            var dto = await _consultaRepo.ObterReceitaPorConsultaIdAsync(consultaId);
            if (dto == null) return NotFound();

            var pdfBytes = _pdfService.GerarPdf(dto);
            return File(pdfBytes, "application/pdf", $"receita_{consultaId}.pdf");
        }
    }

}
