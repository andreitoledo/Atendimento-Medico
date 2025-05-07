
using Microsoft.AspNetCore.Mvc;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalaController : ControllerBase
    {
        private readonly ClinicaContext _context;
        public SalaController(ClinicaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get() =>
    Ok(await _context.Salas.ToListAsync());


        [HttpPost]
        public async Task<IActionResult> Post(Sala sala)
        {
            _context.Salas.Add(sala);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = sala.Id }, sala);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Sala atualizada)
        {
            var sala = await _context.Salas.FindAsync(id);
            if (sala == null) return NotFound();

            sala.Nome = atualizada.Nome;
            sala.Descricao = atualizada.Descricao;
            sala.Ativa = atualizada.Ativa;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var sala = await _context.Salas.FindAsync(id);
            if (sala == null)
                return NotFound();

            _context.Salas.Remove(sala);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
