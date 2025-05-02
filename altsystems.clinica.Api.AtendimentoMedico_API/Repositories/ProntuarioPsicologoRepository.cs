using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class ProntuarioPsicologoRepository : IProntuarioPsicologoRepository
    {
        private readonly ClinicaContext _context;

        public ProntuarioPsicologoRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProntuarioPsicologo>> ObterTodos()
        {
            return await _context.ProntuariosPsicologo
                .Include(p => p.Agendamento).ThenInclude(a => a.Paciente).ThenInclude(u => u.Usuario)
                .Include(p => p.Agendamento).ThenInclude(a => a.Medico).ThenInclude(u => u.Usuario)
                .ToListAsync();
        }

        public async Task<ProntuarioPsicologo> ObterPorId(int id)
        {
            return await _context.ProntuariosPsicologo
                .Include(p => p.Agendamento).ThenInclude(a => a.Paciente).ThenInclude(u => u.Usuario)
                .Include(p => p.Agendamento).ThenInclude(a => a.Medico).ThenInclude(u => u.Usuario)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<ProntuarioPsicologo> Criar(ProntuarioPsicologo prontuario)
        {
            _context.ProntuariosPsicologo.Add(prontuario);
            await _context.SaveChangesAsync();
            return prontuario;
        }

        public async Task<ProntuarioPsicologo> Atualizar(ProntuarioPsicologo prontuario)
        {
            _context.Entry(prontuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return prontuario;
        }

        public async Task<bool> Deletar(int id)
        {
            var prontuario = await _context.ProntuariosPsicologo.FindAsync(id);
            if (prontuario == null) return false;

            _context.ProntuariosPsicologo.Remove(prontuario);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}