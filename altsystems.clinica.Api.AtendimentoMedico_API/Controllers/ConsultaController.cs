using Microsoft.AspNetCore.Mvc;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultaController : ControllerBase
    {
        private readonly IConsultaRepository _repository;

        public ConsultaController(IConsultaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Consulta>>> GetAll()
        {
            var consultas = await _repository.ObterTodos();
            return Ok(consultas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Consulta>> GetById(int id)
        {
            var consulta = await _repository.ObterPorId(id);
            if (consulta == null) return NotFound();
            return Ok(consulta);
        }

        [HttpPost]
        public async Task<ActionResult<Consulta>> Create([FromBody] ConsultaCreateDTO dto)
        {
            var novaConsulta = await _repository.Criar(dto);
            return CreatedAtAction(nameof(GetById), new { id = novaConsulta.Id }, novaConsulta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] ConsultaCreateDTO dto)
        {
            var consulta = await _repository.ObterPorId(id);
            if (consulta == null) return NotFound();

            // Atualiza os campos da consulta
            consulta.AgendamentoId = dto.AgendamentoId;
            consulta.DataConsulta = dto.DataConsulta;
            consulta.Diagnostico = dto.Diagnostico;

            // Atualiza prescrições
            consulta.Prescricoes.Clear();
            if (dto.Prescricoes != null)
            {
                foreach (var p in dto.Prescricoes)
                {
                    consulta.Prescricoes.Add(new Prescricao
                    {
                        Medicamento = p.Medicamento,
                        Posologia = p.Posologia
                    });
                }
            }

            // Atualiza exames solicitados
            consulta.ExamesSolicitados.Clear();
            if (dto.ExamesSolicitados != null)
            {
                foreach (var e in dto.ExamesSolicitados)
                {
                    consulta.ExamesSolicitados.Add(new Exame
                    {
                        Nome = e.Nome,
                        Observacoes = e.Observacoes
                    });
                }
            }

            await _repository.Atualizar(consulta);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var deleted = await _repository.Deletar(id);
            if (!deleted) return NotFound();
            return NoContent();
        }





    }
}
