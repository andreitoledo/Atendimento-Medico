using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacienteController : ControllerBase
    {
        private readonly IPacienteRepository _repository;

        public PacienteController(IPacienteRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PacienteDTO>>> GetPacientes()
        {
            var pacientes = await _repository.ObterTodos();
            var result = pacientes.Select(p => new PacienteDTO
            {
                Id = p.Id,
                Nome = p.Usuario?.Nome,
                CPF = p.CPF,
                Genero = p.Genero,
                Telefone = p.Telefone,
                Endereco = p.Endereco,
                DataNascimento = p.DataNascimento
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PacienteDTO>> GetPaciente(int id)
        {
            var p = await _repository.ObterPorId(id);
            if (p == null) return NotFound();

            return Ok(new PacienteDTO
            {
                Id = p.Id,
                Nome = p.Usuario?.Nome,
                CPF = p.CPF,
                Genero = p.Genero,
                Telefone = p.Telefone,
                Endereco = p.Endereco,
                DataNascimento = p.DataNascimento
            });
        }

        [HttpPost]
        public async Task<ActionResult<PacienteDTO>> CreatePaciente(PacienteCreateDTO dto)
        {
            var paciente = new Paciente
            {
                UsuarioId = dto.UsuarioId,
                CPF = dto.CPF,
                Genero = dto.Genero,
                Telefone = dto.Telefone,
                Endereco = dto.Endereco,
                DataNascimento = dto.DataNascimento
            };

            var created = await _repository.Criar(paciente);

            return CreatedAtAction(nameof(GetPaciente), new { id = created.Id }, new PacienteDTO
            {
                Id = created.Id,
                Nome = created.Usuario?.Nome,
                CPF = created.CPF,
                Genero = created.Genero,
                Telefone = created.Telefone,
                Endereco = created.Endereco,
                DataNascimento = created.DataNascimento
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePaciente(int id, PacienteCreateDTO dto)
        {
            var paciente = await _repository.ObterPorId(id);
            if (paciente == null) return NotFound();

            paciente.CPF = dto.CPF;
            paciente.Genero = dto.Genero;
            paciente.Telefone = dto.Telefone;
            paciente.Endereco = dto.Endereco;
            paciente.DataNascimento = dto.DataNascimento;

            await _repository.Atualizar(paciente);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaciente(int id)
        {
            var deleted = await _repository.Deletar(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}