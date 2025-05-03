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

        // original
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<PacienteDTO>>> GetPacientes()
        //{
        //    var pacientes = await _repository.ObterTodos();
        //    var result = pacientes.Select(p => new PacienteDTO
        //    {
        //        Id = p.Id,
        //        Nome = p.Usuario?.Nome,
        //        CPF = p.CPF,
        //        Genero = p.Genero,
        //        Telefone = p.Telefone,
        //        Endereco = p.Endereco,
        //        DataNascimento = p.DataNascimento
        //    });

        //    return Ok(result);
        //}


        //[HttpGet("{id}")]
        //public async Task<ActionResult<PacienteDTO>> GetPaciente(int id)
        //{
        //    var p = await _repository.ObterPorId(id);
        //    if (p == null) return NotFound();

        //    return Ok(new PacienteDTO
        //    {
        //        Id = p.Id,
        //        Nome = p.Usuario?.Nome,
        //        CPF = p.CPF,
        //        Genero = p.Genero,
        //        Telefone = p.Telefone,
        //        Endereco = p.Endereco,
        //        DataNascimento = p.DataNascimento
        //    });
        //}


        [HttpGet]
        public async Task<ActionResult<IEnumerable<PacienteDetalheDto>>> ObterTodos()
        {
            var pacientes = await _repository.ObterTodos();

            var resultado = pacientes.Select(p => new PacienteDetalheDto
            {
                Id = p.Id,
                UsuarioId = p.UsuarioId,
                Nome = p.Usuario?.Nome,
                Email = p.Usuario?.Email,
                CPF = p.CPF,
                Genero = p.Genero,
                Telefone = p.Telefone,
                Endereco = p.Endereco,
                DataNascimento = p.DataNascimento
            });

            return Ok(resultado);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<PacienteDetalheDto>> ObterPorId(int id)
        {
            var paciente = await _repository.ObterPorId(id);
            if (paciente == null) return NotFound();

            var dto = new PacienteDetalheDto
            {
                Id = paciente.Id,
                UsuarioId = paciente.UsuarioId,
                Nome = paciente.Usuario?.Nome,
                Email = paciente.Usuario?.Email,
                CPF = paciente.CPF,
                Genero = paciente.Genero,
                Telefone = paciente.Telefone,
                Endereco = paciente.Endereco,
                DataNascimento = paciente.DataNascimento
            };

            return Ok(dto);
        }



        [HttpPost]
        public async Task<ActionResult<PacienteDetalheDto>> CreatePaciente(PacienteCreateDTO dto)
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

            // Recarrega com include do usuário (ajuste no repositório se necessário)
            var pacienteComUsuario = await _repository.ObterPorId(created.Id);

            var result = new PacienteDetalheDto
            {
                Id = pacienteComUsuario.Id,
                UsuarioId = pacienteComUsuario.UsuarioId,
                Nome = pacienteComUsuario.Usuario?.Nome,
                Email = pacienteComUsuario.Usuario?.Email,
                CPF = pacienteComUsuario.CPF,
                Genero = pacienteComUsuario.Genero,
                Telefone = pacienteComUsuario.Telefone,
                Endereco = pacienteComUsuario.Endereco,
                DataNascimento = pacienteComUsuario.DataNascimento
            };

            return CreatedAtAction(nameof(ObterPorId), new { id = result.Id }, result);
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