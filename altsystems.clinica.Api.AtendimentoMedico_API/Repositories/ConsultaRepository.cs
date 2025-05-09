using Microsoft.EntityFrameworkCore;
using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class ConsultaRepository : IConsultaRepository
    {
        private readonly ClinicaContext _context;

        public ConsultaRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Consulta>> ObterTodos()
        {
            return await _context.Consultas
                .Include(c => c.Prescricoes)
                .Include(c => c.ExamesSolicitados)
                .Include(c => c.Agendamento)
                    .ThenInclude(a => a.Medico)
                        .ThenInclude(m => m.Usuario)
                .Include(c => c.Agendamento)
                    .ThenInclude(a => a.Paciente)
                        .ThenInclude(p => p.Usuario)
                .ToListAsync();
        }


        public async Task<Consulta> ObterPorId(int id)
        {
            return await _context.Consultas
                .Include(c => c.Prescricoes)
                .Include(c => c.ExamesSolicitados)
                .Include(c => c.Agendamento)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        //public async Task<Consulta> Criar(ConsultaCreateDTO dto)
        //{
        //    var consulta = new Consulta
        //    {
        //        AgendamentoId = dto.AgendamentoId,
        //        DataConsulta = DateTime.UtcNow,
        //        Diagnostico = dto.Diagnostico,
        //        Prescricoes = dto.Prescricoes?.Select(p => new Prescricao
        //        {
        //            Medicamento = p.Medicamento,
        //            Posologia = p.Posologia
        //        }).ToList(),
        //        ExamesSolicitados = dto.ExamesSolicitados?.Select(e => new Exame
        //        {
        //            Nome = e.Nome,
        //            Observacoes = e.Observacoes
        //        }).ToList()
        //    };

        //    _context.Consultas.Add(consulta);

        //    // Marca o agendamento como atendido ANTES do SaveChanges
        //    var agendamento = await _context.Agendamentos.FindAsync(dto.AgendamentoId);
        //    if (agendamento != null)
        //    {
        //        agendamento.Atendido = true;
        //    }

        //    await _context.SaveChangesAsync(); // Tudo salvo de uma vez

        //    return consulta;
        //}

        public async Task<Consulta> Criar(ConsultaCreateDTO dto)
        {
            var consulta = new Consulta
            {
                AgendamentoId = dto.AgendamentoId,
                DataConsulta = DateTime.UtcNow,
                Diagnostico = dto.Diagnostico,
                Prescricoes = new List<Prescricao>(),
                ExamesSolicitados = new List<Exame>()
            };

            // Adiciona prescrições
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

            // Adiciona exames
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

            _context.Consultas.Add(consulta);

            // Marca como atendido
            var agendamento = await _context.Agendamentos
                .Include(a => a.Medico)
                .ThenInclude(m => m.MedicoEspecialidades)
                .FirstOrDefaultAsync(a => a.Id == dto.AgendamentoId);

            if (agendamento != null)
            {
                agendamento.Atendido = true;
            }

            await _context.SaveChangesAsync();

            return consulta;
        }



        public async Task Atualizar(Consulta consulta)
        {
            // Atualiza a consulta
            _context.Consultas.Update(consulta);

            // Marca o agendamento como atendido
            var agendamento = await _context.Agendamentos.FindAsync(consulta.AgendamentoId);
            if (agendamento != null)
            {
                agendamento.Atendido = true;
                _context.Entry(agendamento).Property(a => a.Atendido).IsModified = true;
            }

            // Persiste tudo de uma vez
            await _context.SaveChangesAsync();
        }


        public async Task<bool> Deletar(int id)
        {
            var consulta = await _context.Consultas
                .Include(c => c.Prescricoes)
                .Include(c => c.ExamesSolicitados)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (consulta == null) return false;

            // Remove dependências primeiro
            _context.Prescricoes.RemoveRange(consulta.Prescricoes);
            _context.Exames.RemoveRange(consulta.ExamesSolicitados);

            // Agora pode remover a consulta
            _context.Consultas.Remove(consulta);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<ReciboDTO?> ObterReciboPorConsultaIdAsync(int consultaId)
        {
            var dto = await (
                from consulta in _context.Consultas
                where consulta.Id == consultaId
                join faturamento in _context.Faturamentos
                    on consulta.AgendamentoId equals faturamento.AgendamentoId into fatGroup
                from fat in fatGroup.DefaultIfEmpty() // LEFT JOIN
                select new ReciboDTO
                {
                    NomePaciente = consulta.Agendamento.Paciente.Usuario.Nome,
                    NomeMedico = consulta.Agendamento.Medico.Usuario.Nome,
                    DataConsulta = consulta.DataConsulta,
                    Valor = fat != null ? fat.Valor : 0,
                    Observacoes = consulta.Diagnostico
                }
            ).FirstOrDefaultAsync();

            return dto;
        }

        public async Task<ReciboDTO?> ObterReciboPorFaturamentoIdAsync(int faturamentoId)
        {
            return await _context.Faturamentos
                .Where(f => f.Id == faturamentoId)
                .Select(f => new ReciboDTO
                {
                    NomePaciente = f.Paciente.Usuario.Nome,
                    NomeMedico = f.Agendamento.Medico.Usuario.Nome,
                    DataConsulta = f.Data,
                    Valor = f.Valor,
                    Observacoes = f.Descricao
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ReceitaDTO?> ObterReceitaPorConsultaIdAsync(int consultaId)
        {
            var consulta = await _context.Consultas
                .Include(c => c.Agendamento)
                    .ThenInclude(a => a.Paciente).ThenInclude(p => p.Usuario)
                .Include(c => c.Agendamento)
                    .ThenInclude(a => a.Medico).ThenInclude(m => m.Usuario)
                .Include(c => c.Prescricoes)
                .FirstOrDefaultAsync(c => c.Id == consultaId);

            if (consulta == null) return null;

            return new ReceitaDTO
            {
                NomePaciente = consulta.Agendamento.Paciente.Usuario.Nome,
                NomeMedico = consulta.Agendamento.Medico.Usuario.Nome,
                DataConsulta = consulta.DataConsulta,
                Medicamentos = consulta.Prescricoes.Select(p => $"{p.Medicamento} - {p.Posologia}").ToList(),
                Orientacoes = consulta.Observacoes ?? ""
            };
        }





    }
}
