using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoricoEdicaoController : ControllerBase
    {
        private readonly IHistoricoEdicaoRepository _repo;

        public HistoricoEdicaoController(IHistoricoEdicaoRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("paciente/{pacienteId}")]
        public async Task<IActionResult> ObterPorPaciente(int pacienteId)
        {
            var lista = await _repo.ObterPorPaciente(pacienteId);
            var dtos = lista.Select(h => new HistoricoEdicaoDTO
            {
                Id = h.Id,
                Entidade = h.Entidade,
                RegistroId = h.RegistroId,
                SnapshotAnterior = h.SnapshotAnterior,
                SnapshotNovo = h.SnapshotNovo,
                UsuarioId = h.UsuarioId,
                UsuarioNome = "—",
                DataAlteracao = h.DataAlteracao
            });

            return Ok(dtos);
        }
    }
}