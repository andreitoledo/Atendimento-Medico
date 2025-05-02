using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicoEspecialidadeController : ControllerBase
    {
        private readonly IMedicoEspecialidadeRepository _repository;

        public MedicoEspecialidadeController(IMedicoEspecialidadeRepository repository)
        {
            _repository = repository;
        }

        // GET: api/MedicoEspecialidade/5
        [HttpGet("{medicoId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetEspecialidadesDoMedico(int medicoId)
        {
            var especialidades = await _repository.ObterEspecialidadesDoMedico(medicoId);
            var result = especialidades.Select(e => new
            {
                e.Id,
                e.Titulo,
                e.Descricao
            });

            return Ok(result);
        }

        // POST: api/MedicoEspecialidade/5
        [HttpPost("{medicoId}")]
        public async Task<IActionResult> AtribuirEspecialidades(int medicoId, [FromBody] List<int> especialidadesIds)
        {
            var sucesso = await _repository.AtribuirEspecialidades(medicoId, especialidadesIds);
            if (!sucesso)
                return BadRequest("Erro ao atribuir especialidades.");
            return NoContent();
        }
    }
}
