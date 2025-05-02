using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class ProntuarioClinicoRepository : IProntuarioClinicoRepository
    {
        private readonly ClinicaContext _context;

        public ProntuarioClinicoRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProntuarioClinico>> ObterTodos()
        {
            return await _context.ProntuariosClinico
                .Include(p => p.Agendamento)
                .ThenInclude(a => a.Paciente).ThenInclude(p => p.Usuario)
                .Include(p => p.Agendamento)
                .ThenInclude(a => a.Medico).ThenInclude(m => m.Usuario)
                .ToListAsync();
        }

        public async Task<ProntuarioClinico> ObterPorId(int id)
        {
            return await _context.ProntuariosClinico
                .Include(p => p.Agendamento)
                .ThenInclude(a => a.Paciente).ThenInclude(p => p.Usuario)
                .Include(p => p.Agendamento)
                .ThenInclude(a => a.Medico).ThenInclude(m => m.Usuario)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<ProntuarioClinico> Criar(ProntuarioClinico prontuario)
        {
            _context.ProntuariosClinico.Add(prontuario);
            await _context.SaveChangesAsync();
            return prontuario;
        }

        public async Task<ProntuarioClinico> Atualizar(ProntuarioClinico prontuario)
        {
            _context.Entry(prontuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return prontuario;
        }

        public async Task<bool> Deletar(int id)
        {
            var prontuario = await _context.ProntuariosClinico.FindAsync(id);
            if (prontuario == null) return false;

            _context.ProntuariosClinico.Remove(prontuario);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}