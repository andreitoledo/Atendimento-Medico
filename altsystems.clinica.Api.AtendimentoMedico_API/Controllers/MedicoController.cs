using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicoController : ControllerBase
    {
        private readonly IMedicoRepository _repository;

        public MedicoController(IMedicoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicoDTO>>> GetMedicos()
        {
            var medicos = await _repository.ObterTodos();
            var result = medicos.Select(m => new MedicoDTO
            {
                Id = m.Id,
                Nome = m.Usuario?.Nome,
                Email = m.Usuario?.Email,
                CRM = m.CRM,
                Especialidade = m.Especialidade
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicoDTO>> GetMedico(int id)
        {
            var m = await _repository.ObterPorId(id);
            if (m == null) return NotFound();

            return Ok(new MedicoDTO
            {
                Id = m.Id,
                Nome = m.Usuario?.Nome,
                Email = m.Usuario?.Email,
                CRM = m.CRM,
                Especialidade = m.Especialidade
            });
        }

        [HttpPost]
        public async Task<ActionResult<MedicoDTO>> CreateMedico(MedicoCreateDTO dto)
        {
            var medico = new Medico
            {
                UsuarioId = dto.UsuarioId,
                CRM = dto.CRM,
                Especialidade = dto.Especialidade
            };

            var created = await _repository.Criar(medico);

            return CreatedAtAction(nameof(GetMedico), new { id = created.Id }, new MedicoDTO
            {
                Id = created.Id,
                Nome = created.Usuario?.Nome,
                Email = created.Usuario?.Email,
                CRM = created.CRM,
                Especialidade = created.Especialidade
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedico(int id, MedicoCreateDTO dto)
        {
            var medico = await _repository.ObterPorId(id);
            if (medico == null) return NotFound();

            medico.CRM = dto.CRM;
            medico.Especialidade = dto.Especialidade;

            await _repository.Atualizar(medico);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedico(int id)
        {
            var deleted = await _repository.Deletar(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}