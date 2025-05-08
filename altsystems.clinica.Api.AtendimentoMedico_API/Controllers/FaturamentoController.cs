using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FaturamentoController : ControllerBase
    {
        private readonly IFaturamentoRepository _repository;

        public FaturamentoController(IFaturamentoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FaturamentoDTO>>> Get()
        {
            var lista = await _repository.ObterTodos();
            return Ok(lista.Select(f => new FaturamentoDTO
            {
                Id = f.Id,
                AgendamentoId = f.AgendamentoId,
                PacienteId = f.PacienteId,
                Data = f.Data,
                Valor = f.Valor,
                FormaPagamento = f.FormaPagamento,
                Descricao = f.Descricao,
                StatusPagamento = f.StatusPagamento,
                CodigoTransacao = f.CodigoTransacao,
                PacienteNome = f.Agendamento?.Paciente?.Usuario?.Nome ?? "Desconhecido",
                MedicoNome = f.Agendamento?.Medico?.Usuario?.Nome ?? "Desconhecido"
            }));
        }

        [HttpGet("periodo")]
        public async Task<ActionResult<IEnumerable<FaturamentoDTO>>> GetPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            var lista = await _repository.ObterPorPeriodo(dataInicio, dataFim);
            return Ok(lista.Select(f => new FaturamentoDTO
            {
                Id = f.Id,
                AgendamentoId = f.AgendamentoId,
                PacienteId = f.PacienteId,
                Data = f.Data,
                Valor = f.Valor,
                FormaPagamento = f.FormaPagamento,
                Descricao = f.Descricao,
                PacienteNome = f.Agendamento?.Paciente?.Usuario?.Nome,
                MedicoNome = f.Agendamento?.Medico?.Usuario?.Nome
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FaturamentoDTO>> Get(int id)
        {
            var f = await _repository.ObterPorId(id);
            if (f == null) return NotFound();

            return Ok(new FaturamentoDTO
            {
                Id = f.Id,
                AgendamentoId = f.AgendamentoId,
                PacienteId = f.PacienteId,
                Data = f.Data,
                Valor = f.Valor,
                FormaPagamento = f.FormaPagamento,
                Descricao = f.Descricao
            });
        }

        [HttpPost]
        public async Task<ActionResult<FaturamentoDTO>> Post(FaturamentoCreateDTO dto)
        {
            var novo = new Faturamento
            {
                AgendamentoId = dto.AgendamentoId,
                PacienteId = dto.PacienteId,
                Data = dto.Data,
                Valor = dto.Valor,
                FormaPagamento = dto.FormaPagamento,
                Descricao = dto.Descricao,
                StatusPagamento = string.IsNullOrEmpty(dto.StatusPagamento) ? "Pendente" : dto.StatusPagamento,
                CodigoTransacao = dto.CodigoTransacao // pode vir null
            };

            var criado = await _repository.Criar(novo);

            return CreatedAtAction(nameof(Get), new { id = criado.Id }, new FaturamentoDTO
            {
                Id = criado.Id,
                AgendamentoId = criado.AgendamentoId,
                PacienteId = criado.PacienteId,
                Data = criado.Data,
                Valor = criado.Valor,
                FormaPagamento = criado.FormaPagamento,
                Descricao = criado.Descricao,
                StatusPagamento = criado.StatusPagamento,
                CodigoTransacao = criado.CodigoTransacao
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, FaturamentoCreateDTO dto)
        {
            var item = await _repository.ObterPorId(id);
            if (item == null) return NotFound();

            item.AgendamentoId = dto.AgendamentoId;
            item.PacienteId = dto.PacienteId;
            item.Data = dto.Data;
            item.Valor = dto.Valor;
            item.FormaPagamento = dto.FormaPagamento;
            item.Descricao = dto.Descricao;
            item.StatusPagamento = dto.StatusPagamento;
            item.CodigoTransacao = dto.CodigoTransacao;


            await _repository.Atualizar(item);
            return NoContent();
        }

        [HttpGet("nao-pagos")]
        public async Task<ActionResult> GetAgendamentosNaoPagos()
        {
            var agendamentos = await _repository.ObterAgendamentosNaoPagosAsync();

            return Ok(agendamentos.Select(a => new
            {
                a.Id,
                a.DataConsulta,
                a.CheckIn,
                NomePaciente = a.Paciente.Usuario.Nome,
                NomeMedico = a.Medico.Usuario.Nome
            }));
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deletado = await _repository.Deletar(id);
            if (!deletado) return NotFound();
            return NoContent();
        }
    }
}