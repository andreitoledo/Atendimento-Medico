using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static BCrypt.Net.BCrypt;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
   // [Authorize(Roles = "admin,medico")]
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _repository;

        public UsuarioController(IUsuarioRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarios()
        {
            var usuarios = await _repository.ObterTodos();
            var result = usuarios.Select(u => new UsuarioDTO
            {
                Id = u.Id,
                Nome = u.Nome,
                Email = u.Email,
                Tipo = u.Tipo,
                Ativo = u.Ativo
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetUsuario(int id)
        {
            var usuario = await _repository.ObterPorId(id);
            if (usuario == null) return NotFound();

            return Ok(new UsuarioDTO
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Tipo = usuario.Tipo,
                Ativo = usuario.Ativo
            });
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> CreateUsuario(UsuarioCreateDTO dto)
        {
            var usuario = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                SenhaHash = HashPassword(dto.Senha),
                Tipo = dto.Tipo
            };

            var created = await _repository.Criar(usuario);

            return CreatedAtAction(nameof(GetUsuario), new { id = created.Id }, new UsuarioDTO
            {
                Id = created.Id,
                Nome = created.Nome,
                Email = created.Email,
                Tipo = created.Tipo,
                Ativo = created.Ativo
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, UsuarioCreateDTO dto)
        {
            var usuario = await _repository.ObterPorId(id);
            if (usuario == null) return NotFound();

            usuario.Nome = dto.Nome;
            usuario.Email = dto.Email;
            usuario.Tipo = dto.Tipo;

            await _repository.Atualizar(usuario);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var result = await _repository.Deletar(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}