using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using altsystems.clinica.Api.AtendimentoMedico_API.Services;
using Microsoft.AspNetCore.Mvc;
using static BCrypt.Net.BCrypt;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepo;
        private readonly JwtService _jwtService;

        public AuthController(IUsuarioRepository usuarioRepo, JwtService jwtService)
        {
            _usuarioRepo = usuarioRepo;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var usuario = (await _usuarioRepo.ObterTodos()).FirstOrDefault(u => u.Email == dto.Email);
            if (usuario == null || !Verify(dto.Senha, usuario.SenhaHash))
                return Unauthorized("Usuário ou senha inválidos.");

            var token = _jwtService.GerarToken(usuario);
            return Ok(new { token });
        }
    }
}