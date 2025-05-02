using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProntuarioPsiquiatraController : ControllerBase
    {
        private readonly IProntuarioPsiquiatraRepository _repository;

        public ProntuarioPsiquiatraController(IProntuarioPsiquiatraRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProntuarioPsiquiatraDTO>>> Get()
        {
            var prontuarios = await _repository.ObterTodos();
            var result = prontuarios.Select(p => new ProntuarioPsiquiatraDTO
            {
                Id = p.Id,
                AgendamentoId = p.AgendamentoId,
                NomePaciente = p.Agendamento?.Paciente?.Usuario?.Nome,
                NomeMedico = p.Agendamento?.Medico?.Usuario?.Nome,
                QueixaPrincipal = p.QueixaPrincipal,
                DuracaoSintomas = p.DuracaoSintomas,
                ImpactoVida = p.ImpactoVida,
                HistoriaDoencaAtual = p.HistoriaDoencaAtual,
                TratamentosAnteriores = p.TratamentosAnteriores,
                HistoricoMedico = p.HistoricoMedico,
                HistoricoPsiquiatrico = p.HistoricoPsiquiatrico,
                HistoricoFamiliar = p.HistoricoFamiliar,
                HistoriaPessoalSocial = p.HistoriaPessoalSocial,
                ExameEstadoMental = p.ExameEstadoMental,
                Diagnostico = p.Diagnostico,
                CID10 = p.CID10,
                PlanoTerapeutico = p.PlanoTerapeutico,
                EvolucaoClinica = p.EvolucaoClinica,
                Prescricao = p.Prescricao,
                SolicitacaoExames = p.SolicitacaoExames,
                Consentimentos = p.Consentimentos,
                DataCriacao = p.DataCriacao
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProntuarioPsiquiatraDTO>> Get(int id)
        {
            var p = await _repository.ObterPorId(id);
            if (p == null) return NotFound();

            return Ok(new ProntuarioPsiquiatraDTO
            {
                Id = p.Id,
                AgendamentoId = p.AgendamentoId,
                NomePaciente = p.Agendamento?.Paciente?.Usuario?.Nome,
                NomeMedico = p.Agendamento?.Medico?.Usuario?.Nome,
                QueixaPrincipal = p.QueixaPrincipal,
                DuracaoSintomas = p.DuracaoSintomas,
                ImpactoVida = p.ImpactoVida,
                HistoriaDoencaAtual = p.HistoriaDoencaAtual,
                TratamentosAnteriores = p.TratamentosAnteriores,
                HistoricoMedico = p.HistoricoMedico,
                HistoricoPsiquiatrico = p.HistoricoPsiquiatrico,
                HistoricoFamiliar = p.HistoricoFamiliar,
                HistoriaPessoalSocial = p.HistoriaPessoalSocial,
                ExameEstadoMental = p.ExameEstadoMental,
                Diagnostico = p.Diagnostico,
                CID10 = p.CID10,
                PlanoTerapeutico = p.PlanoTerapeutico,
                EvolucaoClinica = p.EvolucaoClinica,
                Prescricao = p.Prescricao,
                SolicitacaoExames = p.SolicitacaoExames,
                Consentimentos = p.Consentimentos,
                DataCriacao = p.DataCriacao
            });
        }

        [HttpPost]
        public async Task<ActionResult<ProntuarioPsiquiatra>> Post(ProntuarioPsiquiatraCreateDTO dto)
        {
            var prontuario = new ProntuarioPsiquiatra
            {
                AgendamentoId = dto.AgendamentoId,
                QueixaPrincipal = dto.QueixaPrincipal,
                DuracaoSintomas = dto.DuracaoSintomas,
                ImpactoVida = dto.ImpactoVida,
                HistoriaDoencaAtual = dto.HistoriaDoencaAtual,
                TratamentosAnteriores = dto.TratamentosAnteriores,
                HistoricoMedico = dto.HistoricoMedico,
                HistoricoPsiquiatrico = dto.HistoricoPsiquiatrico,
                HistoricoFamiliar = dto.HistoricoFamiliar,
                HistoriaPessoalSocial = dto.HistoriaPessoalSocial,
                ExameEstadoMental = dto.ExameEstadoMental,
                Diagnostico = dto.Diagnostico,
                CID10 = dto.CID10,
                PlanoTerapeutico = dto.PlanoTerapeutico,
                EvolucaoClinica = dto.EvolucaoClinica,
                Prescricao = dto.Prescricao,
                SolicitacaoExames = dto.SolicitacaoExames,
                Consentimentos = dto.Consentimentos,
                DataCriacao = DateTime.Now
            };

            var created = await _repository.Criar(prontuario);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ProntuarioPsiquiatraCreateDTO dto)
        {
            var prontuario = await _repository.ObterPorId(id);
            if (prontuario == null) return NotFound();

            prontuario.QueixaPrincipal = dto.QueixaPrincipal;
            prontuario.DuracaoSintomas = dto.DuracaoSintomas;
            prontuario.ImpactoVida = dto.ImpactoVida;
            prontuario.HistoriaDoencaAtual = dto.HistoriaDoencaAtual;
            prontuario.TratamentosAnteriores = dto.TratamentosAnteriores;
            prontuario.HistoricoMedico = dto.HistoricoMedico;
            prontuario.HistoricoPsiquiatrico = dto.HistoricoPsiquiatrico;
            prontuario.HistoricoFamiliar = dto.HistoricoFamiliar;
            prontuario.HistoriaPessoalSocial = dto.HistoriaPessoalSocial;
            prontuario.ExameEstadoMental = dto.ExameEstadoMental;
            prontuario.Diagnostico = dto.Diagnostico;
            prontuario.CID10 = dto.CID10;
            prontuario.PlanoTerapeutico = dto.PlanoTerapeutico;
            prontuario.EvolucaoClinica = dto.EvolucaoClinica;
            prontuario.Prescricao = dto.Prescricao;
            prontuario.SolicitacaoExames = dto.SolicitacaoExames;
            prontuario.Consentimentos = dto.Consentimentos;

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