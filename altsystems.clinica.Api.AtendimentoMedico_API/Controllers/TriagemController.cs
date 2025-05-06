using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using altsystems.clinica.Api.AtendimentoMedico_API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TriagemController : ControllerBase
    {      
        private readonly ITriagemRepository _repository;
        private readonly ClinicaContext _context;
        private readonly HistoricoEdicaoService _historicoService;

        public TriagemController(ITriagemRepository repository, ClinicaContext context, HistoricoEdicaoService historicoService)
        {
            _repository = repository;
            _context = context;
            _historicoService = historicoService;
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
            var triagemAtual = await _context.Triagens
                .Include(t => t.Agendamento)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (triagemAtual == null) return NotFound();

            // Snapshot antes
            var triagemAntes = JsonConvert.DeserializeObject<Triagem>(
                JsonConvert.SerializeObject(triagemAtual)
            );

            // Atualizar campos
            triagemAtual.DataTriagem = dto.DataTriagem;
            triagemAtual.PressaoArterial = dto.PressaoArterial;
            triagemAtual.FrequenciaCardiaca = dto.FrequenciaCardiaca;
            triagemAtual.Temperatura = dto.Temperatura;
            triagemAtual.SaturacaoOxigenio = dto.SaturacaoOxigenio;
            triagemAtual.Peso = dto.Peso;
            triagemAtual.Altura = dto.Altura;
            triagemAtual.IMC = dto.IMC;
            triagemAtual.QueixaInicial = dto.QueixaInicial;
            triagemAtual.Prioridade = dto.Prioridade;

            await _context.SaveChangesAsync();

            int usuarioLogadoId = 1; // recuperar do JWT em produção

            await _historicoService.RegistrarAlteracao(
                "Triagem",
                triagemAtual.Agendamento.PacienteId,
                triagemAtual.Id,
                triagemAntes,
                triagemAtual,
                usuarioLogadoId
            );

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