using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using System;
using Microsoft.EntityFrameworkCore;

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

        public async Task<ConciliacaoResultadoDTO> ConciliarPagamentoAsync(int agendamentoId)
        {
            var faturamento = await _context.Faturamentos
                .Where(f => f.AgendamentoId == agendamentoId && f.StatusPagamento == "Aguardando")
                .FirstOrDefaultAsync();

            if (faturamento == null)
            {
                return new ConciliacaoResultadoDTO
                {
                    Sucesso = false,
                    Mensagem = "Pagamento não encontrado ou já conciliado."
                };
            }

            faturamento.StatusPagamento = "Pago";
            await _context.SaveChangesAsync();

            return new ConciliacaoResultadoDTO
            {
                Sucesso = true,
                Mensagem = "Pagamento conciliado com sucesso.",
                FaturamentoId = faturamento.Id,
                Valor = faturamento.Valor
            };
        }

        public async Task<ConciliacaoResultadoDTO> ConciliarFaturamentoAsync(int faturamentoId)
        {
            var faturamento = await _context.Faturamentos
                .FirstOrDefaultAsync(f => f.Id == faturamentoId && f.StatusPagamento == "Aguardando");

            if (faturamento == null)
            {
                return new ConciliacaoResultadoDTO
                {
                    Sucesso = false,
                    Mensagem = "Faturamento não encontrado ou já pago."
                };
            }

            faturamento.StatusPagamento = "Pago";
            await _context.SaveChangesAsync();

            return new ConciliacaoResultadoDTO
            {
                Sucesso = true,
                Mensagem = "Pagamento conciliado com sucesso.",
                FaturamentoId = faturamento.Id,
                Valor = faturamento.Valor
            };
        }

    }

    public class ConciliacaoResultadoDTO
    {
        public bool Sucesso { get; set; }
        public string Mensagem { get; set; } = null!;
        public int? FaturamentoId { get; set; }
        public decimal? Valor { get; set; }
    }



}
