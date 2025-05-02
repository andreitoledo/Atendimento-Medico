using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProntuarioPsicologoController : ControllerBase
    {
        private readonly IProntuarioPsicologoRepository _repository;

        public ProntuarioPsicologoController(IProntuarioPsicologoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProntuarioPsicologoDTO>>> Get()
        {
            var prontuarios = await _repository.ObterTodos();
            var result = prontuarios.Select(p => new ProntuarioPsicologoDTO
            {
                Id = p.Id,
                AgendamentoId = p.AgendamentoId,
                NomePaciente = p.Agendamento?.Paciente?.Usuario?.Nome,
                NomePsicologo = p.Agendamento?.Medico?.Usuario?.Nome,
                CRP = p.CRP,
                QueixaPrincipal = p.QueixaPrincipal,
                ObjetivosTerapia = p.ObjetivosTerapia,
                HistoricoProblema = p.HistoricoProblema,
                HistoriaDeVida = p.HistoriaDeVida,
                ResultadosAvaliacoes = p.ResultadosAvaliacoes,
                EvolucaoAtendimento = p.EvolucaoAtendimento,
                Encaminhamentos = p.Encaminhamentos,
                Encerramento = p.Encerramento,
                DocumentosAnexos = p.DocumentosAnexos,
                DataCriacao = p.DataCriacao
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProntuarioPsicologoDTO>> Get(int id)
        {
            var p = await _repository.ObterPorId(id);
            if (p == null) return NotFound();

            return Ok(new ProntuarioPsicologoDTO
            {
                Id = p.Id,
                AgendamentoId = p.AgendamentoId,
                NomePaciente = p.Agendamento?.Paciente?.Usuario?.Nome,
                NomePsicologo = p.Agendamento?.Medico?.Usuario?.Nome,
                CRP = p.CRP,
                QueixaPrincipal = p.QueixaPrincipal,
                ObjetivosTerapia = p.ObjetivosTerapia,
                HistoricoProblema = p.HistoricoProblema,
                HistoriaDeVida = p.HistoriaDeVida,
                ResultadosAvaliacoes = p.ResultadosAvaliacoes,
                EvolucaoAtendimento = p.EvolucaoAtendimento,
                Encaminhamentos = p.Encaminhamentos,
                Encerramento = p.Encerramento,
                DocumentosAnexos = p.DocumentosAnexos,
                DataCriacao = p.DataCriacao
            });
        }

        [HttpPost]
        public async Task<ActionResult<ProntuarioPsicologo>> Post(ProntuarioPsicologoCreateDTO dto)
        {
            var prontuario = new ProntuarioPsicologo
            {
                AgendamentoId = dto.AgendamentoId,
                CRP = dto.CRP,
                QueixaPrincipal = dto.QueixaPrincipal,
                ObjetivosTerapia = dto.ObjetivosTerapia,
                HistoricoProblema = dto.HistoricoProblema,
                HistoriaDeVida = dto.HistoriaDeVida,
                ResultadosAvaliacoes = dto.ResultadosAvaliacoes,
                EvolucaoAtendimento = dto.EvolucaoAtendimento,
                Encaminhamentos = dto.Encaminhamentos,
                Encerramento = dto.Encerramento,
                DocumentosAnexos = dto.DocumentosAnexos,
                DataCriacao = DateTime.Now
            };

            var created = await _repository.Criar(prontuario);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ProntuarioPsicologoCreateDTO dto)
        {
            var prontuario = await _repository.ObterPorId(id);
            if (prontuario == null) return NotFound();

            prontuario.CRP = dto.CRP;
            prontuario.QueixaPrincipal = dto.QueixaPrincipal;
            prontuario.ObjetivosTerapia = dto.ObjetivosTerapia;
            prontuario.HistoricoProblema = dto.HistoricoProblema;
            prontuario.HistoriaDeVida = dto.HistoriaDeVida;
            prontuario.ResultadosAvaliacoes = dto.ResultadosAvaliacoes;
            prontuario.EvolucaoAtendimento = dto.EvolucaoAtendimento;
            prontuario.Encaminhamentos = dto.Encaminhamentos;
            prontuario.Encerramento = dto.Encerramento;
            prontuario.DocumentosAnexos = dto.DocumentosAnexos;

            await _repository.Atualizar(prontuario);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repository.Deletar(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}