using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EspecialidadeController : ControllerBase
    {
        private readonly IEspecialidadeRepository _repository;

        public EspecialidadeController(IEspecialidadeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EspecialidadeDTO>>> Get()
        {
            var especialidades = await _repository.ObterTodas();
            return Ok(especialidades.Select(e => new EspecialidadeDTO
            {
                Id = e.Id,
                Titulo = e.Titulo,
                Descricao = e.Descricao
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EspecialidadeDTO>> Get(int id)
        {
            var e = await _repository.ObterPorId(id);
            if (e == null) return NotFound();

            return Ok(new EspecialidadeDTO
            {
                Id = e.Id,
                Titulo = e.Titulo,
                Descricao = e.Descricao
            });
        }

        [HttpPost]
        public async Task<ActionResult<EspecialidadeDTO>> Post(EspecialidadeCreateDTO dto)
        {
            var nova = new Especialidade
            {
                Titulo = dto.Titulo,
                Descricao = dto.Descricao
            };

            var criada = await _repository.Criar(nova);
            return CreatedAtAction(nameof(Get), new { id = criada.Id }, new EspecialidadeDTO
            {
                Id = criada.Id,
                Titulo = criada.Titulo,
                Descricao = criada.Descricao
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EspecialidadeCreateDTO dto)
        {
            var especialidade = await _repository.ObterPorId(id);
            if (especialidade == null) return NotFound();

            especialidade.Titulo = dto.Titulo;
            especialidade.Descricao = dto.Descricao;

            await _repository.Atualizar(especialidade);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var excluido = await _repository.Deletar(id);
            if (!excluido) return NotFound();
            return NoContent();
        }
    }
}