using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProntuarioClinicoController : ControllerBase
    {
        private readonly IProntuarioClinicoRepository _repository;

        public ProntuarioClinicoController(IProntuarioClinicoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProntuarioClinicoDTO>>> Get()
        {
            var prontuarios = await _repository.ObterTodos();
            var result = prontuarios.Select(p => new ProntuarioClinicoDTO
            {
                Id = p.Id,
                AgendamentoId = p.AgendamentoId,
                NomePaciente = p.Agendamento?.Paciente?.Usuario?.Nome,
                NomeMedico = p.Agendamento?.Medico?.Usuario?.Nome,
                QueixaPrincipal = p.QueixaPrincipal,
                HistoriaDoencaAtual = p.HistoriaDoencaAtual,
                HistoricoMedico = p.HistoricoMedico,
                HistoricoFamiliar = p.HistoricoFamiliar,
                HistoricoSocial = p.HistoricoSocial,
                HistoricoOcupacional = p.HistoricoOcupacional,
                SinaisVitais = p.SinaisVitais,
                ExameFisico = p.ExameFisico,
                HipotesesDiagnosticas = p.HipotesesDiagnosticas,
                SolicitacaoExames = p.SolicitacaoExames,
                Prescricao = p.Prescricao,
                PlanoTerapeutico = p.PlanoTerapeutico,
                EvolucaoClinica = p.EvolucaoClinica,
                Consentimentos = p.Consentimentos,
                ObservacoesEncerramento = p.ObservacoesEncerramento,
                DataCriacao = p.DataCriacao
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProntuarioClinicoDTO>> Get(int id)
        {
            var p = await _repository.ObterPorId(id);
            if (p == null) return NotFound();

            return Ok(new ProntuarioClinicoDTO
            {
                Id = p.Id,
                AgendamentoId = p.AgendamentoId,
                NomePaciente = p.Agendamento?.Paciente?.Usuario?.Nome,
                NomeMedico = p.Agendamento?.Medico?.Usuario?.Nome,
                QueixaPrincipal = p.QueixaPrincipal,
                HistoriaDoencaAtual = p.HistoriaDoencaAtual,
                HistoricoMedico = p.HistoricoMedico,
                HistoricoFamiliar = p.HistoricoFamiliar,
                HistoricoSocial = p.HistoricoSocial,
                HistoricoOcupacional = p.HistoricoOcupacional,
                SinaisVitais = p.SinaisVitais,
                ExameFisico = p.ExameFisico,
                HipotesesDiagnosticas = p.HipotesesDiagnosticas,
                SolicitacaoExames = p.SolicitacaoExames,
                Prescricao = p.Prescricao,
                PlanoTerapeutico = p.PlanoTerapeutico,
                EvolucaoClinica = p.EvolucaoClinica,
                Consentimentos = p.Consentimentos,
                ObservacoesEncerramento = p.ObservacoesEncerramento,
                DataCriacao = p.DataCriacao
            });
        }

        [HttpPost]
        public async Task<ActionResult<ProntuarioClinico>> Post(ProntuarioClinicoCreateDTO dto)
        {
            var prontuario = new ProntuarioClinico
            {
                AgendamentoId = dto.AgendamentoId,
                QueixaPrincipal = dto.QueixaPrincipal,
                HistoriaDoencaAtual = dto.HistoriaDoencaAtual,
                HistoricoMedico = dto.HistoricoMedico,
                HistoricoFamiliar = dto.HistoricoFamiliar,
                HistoricoSocial = dto.HistoricoSocial,
                HistoricoOcupacional = dto.HistoricoOcupacional,
                SinaisVitais = dto.SinaisVitais,
                ExameFisico = dto.ExameFisico,
                HipotesesDiagnosticas = dto.HipotesesDiagnosticas,
                SolicitacaoExames = dto.SolicitacaoExames,
                Prescricao = dto.Prescricao,
                PlanoTerapeutico = dto.PlanoTerapeutico,
                EvolucaoClinica = dto.EvolucaoClinica,
                Consentimentos = dto.Consentimentos,
                ObservacoesEncerramento = dto.ObservacoesEncerramento,
                DataCriacao = DateTime.Now
            };

            var created = await _repository.Criar(prontuario);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ProntuarioClinicoCreateDTO dto)
        {
            var prontuario = await _repository.ObterPorId(id);
            if (prontuario == null) return NotFound();

            prontuario.QueixaPrincipal = dto.QueixaPrincipal;
            prontuario.HistoriaDoencaAtual = dto.HistoriaDoencaAtual;
            prontuario.HistoricoMedico = dto.HistoricoMedico;
            prontuario.HistoricoFamiliar = dto.HistoricoFamiliar;
            prontuario.HistoricoSocial = dto.HistoricoSocial;
            prontuario.HistoricoOcupacional = dto.HistoricoOcupacional;
            prontuario.SinaisVitais = dto.SinaisVitais;
            prontuario.ExameFisico = dto.ExameFisico;
            prontuario.HipotesesDiagnosticas = dto.HipotesesDiagnosticas;
            prontuario.SolicitacaoExames = dto.SolicitacaoExames;
            prontuario.Prescricao = dto.Prescricao;
            prontuario.PlanoTerapeutico = dto.PlanoTerapeutico;
            prontuario.EvolucaoClinica = dto.EvolucaoClinica;
            prontuario.Consentimentos = dto.Consentimentos;
            prontuario.ObservacoesEncerramento = dto.ObservacoesEncerramento;

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