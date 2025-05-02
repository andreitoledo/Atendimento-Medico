using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TriagemController : ControllerBase
    {
        private readonly ITriagemRepository _repository;

        public TriagemController(ITriagemRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TriagemDTO>>> Get()
        {
            var lista = await _repository.ObterTodas();
            return Ok(lista.Select(t => new TriagemDTO
            {
                Id = t.Id,
                AgendamentoId = t.AgendamentoId,
                DataTriagem = t.DataTriagem,
                PressaoArterial = t.PressaoArterial,
                FrequenciaCardiaca = t.FrequenciaCardiaca,
                Temperatura = t.Temperatura,
                SaturacaoOxigenio = t.SaturacaoOxigenio,
                Peso = t.Peso,
                Altura = t.Altura,
                IMC = t.IMC,
                QueixaInicial = t.QueixaInicial,
                Prioridade = t.Prioridade
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TriagemDTO>> Get(int id)
        {
            var t = await _repository.ObterPorId(id);
            if (t == null) return NotFound();

            return Ok(new TriagemDTO
            {
                Id = t.Id,
                AgendamentoId = t.AgendamentoId,
                DataTriagem = t.DataTriagem,
                PressaoArterial = t.PressaoArterial,
                FrequenciaCardiaca = t.FrequenciaCardiaca,
                Temperatura = t.Temperatura,
                SaturacaoOxigenio = t.SaturacaoOxigenio,
                Peso = t.Peso,
                Altura = t.Altura,
                IMC = t.IMC,
                QueixaInicial = t.QueixaInicial,
                Prioridade = t.Prioridade
            });
        }

        [HttpPost]
        public async Task<ActionResult<TriagemDTO>> Post(TriagemCreateDTO dto)
        {
            var nova = new Triagem
            {
                AgendamentoId = dto.AgendamentoId,
                DataTriagem = dto.DataTriagem,
                PressaoArterial = dto.PressaoArterial,
                FrequenciaCardiaca = dto.FrequenciaCardiaca,
                Temperatura = dto.Temperatura,
                SaturacaoOxigenio = dto.SaturacaoOxigenio,
                Peso = dto.Peso,
                Altura = dto.Altura,
                IMC = dto.IMC,
                QueixaInicial = dto.QueixaInicial,
                Prioridade = dto.Prioridade
            };

            var criada = await _repository.Criar(nova);
            return CreatedAtAction(nameof(Get), new { id = criada.Id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, TriagemCreateDTO dto)
        {
            var triagem = await _repository.ObterPorId(id);
            if (triagem == null) return NotFound();

            triagem.DataTriagem = dto.DataTriagem;
            triagem.PressaoArterial = dto.PressaoArterial;
            triagem.FrequenciaCardiaca = dto.FrequenciaCardiaca;
            triagem.Temperatura = dto.Temperatura;
            triagem.SaturacaoOxigenio = dto.SaturacaoOxigenio;
            triagem.Peso = dto.Peso;
            triagem.Altura = dto.Altura;
            triagem.IMC = dto.IMC;
            triagem.QueixaInicial = dto.QueixaInicial;
            triagem.Prioridade = dto.Prioridade;

            await _repository.Atualizar(triagem);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var removido = await _repository.Deletar(id);
            if (!removido) return NotFound();
            return NoContent();
        }
    }
}