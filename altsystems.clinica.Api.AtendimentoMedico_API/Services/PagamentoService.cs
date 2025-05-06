using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Services
{
    public class PagamentoService
    {
        private readonly ClinicaContext _context;

        public PagamentoService(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<object> SimularPagamentoAsync(PagamentoDTO dto)
        {
            var codigoTransacao = Guid.NewGuid().ToString();
            var status = dto.FormaPagamento.ToLower() switch
            {
                "pix" => "Aguardando",
                "cartao" => "Aprovado",
                "dinheiro" => "Pago",
                _ => "Indefinido"
            };

            var faturamento = new Faturamento
            {
                AgendamentoId = dto.AgendamentoId,
                PacienteId = dto.PacienteId,
                Data = DateTime.Now,
                Valor = dto.Valor,
                FormaPagamento = dto.FormaPagamento,
                Descricao = dto.Descricao ?? "Pagamento simulado",
                CodigoTransacao = codigoTransacao,
                StatusPagamento = status
            };

            _context.Faturamentos.Add(faturamento);
            await _context.SaveChangesAsync();

            return new
            {
                faturamento.Id,
                faturamento.Valor,
                faturamento.FormaPagamento,
                faturamento.StatusPagamento,
                faturamento.CodigoTransacao
            };
        }
    }
}