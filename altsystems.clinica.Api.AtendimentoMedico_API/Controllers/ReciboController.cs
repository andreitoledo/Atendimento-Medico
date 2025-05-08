using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using altsystems.clinica.Api.AtendimentoMedico_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReciboController : ControllerBase
    {
        private readonly IConsultaRepository _consultaRepo;
        private readonly ReciboPdfService _pdfService;

        public ReciboController(IConsultaRepository consultaRepo, ReciboPdfService pdfService)
        {
            _consultaRepo = consultaRepo;
            _pdfService = pdfService;
        }

        //[HttpGet("{id}/pdf")]
        //public async Task<IActionResult> GerarRecibo(int id)
        //{
        //    var dto = await _consultaRepo.ObterReciboPorConsultaIdAsync(id);
        //    if (dto == null) return NotFound();

        //    var pdfBytes = _pdfService.GerarRecibo(dto);
        //    return File(pdfBytes, "application/pdf", $"recibo_{id}.pdf");
        //}

        [HttpGet("faturamento/{id}/pdf")]
        public async Task<IActionResult> GerarReciboPorFaturamento(int id)
        {
            var dto = await _consultaRepo.ObterReciboPorFaturamentoIdAsync(id); // Novo método
            if (dto == null) return NotFound();

            var pdfBytes = _pdfService.GerarRecibo(dto);
            return File(pdfBytes, "application/pdf", $"recibo_{id}.pdf");
        }

    }
}