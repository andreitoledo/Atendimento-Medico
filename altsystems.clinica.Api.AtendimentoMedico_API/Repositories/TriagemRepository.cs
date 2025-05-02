using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class TriagemRepository : ITriagemRepository
    {
        private readonly ClinicaContext _context;

        public TriagemRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Triagem>> ObterTodas()
        {
            return await _context.Triagens.ToListAsync();
        }

        public async Task<Triagem> ObterPorId(int id)
        {
            return await _context.Triagens.FindAsync(id);
        }

        public async Task<Triagem> Criar(Triagem triagem)
        {
            _context.Triagens.Add(triagem);
            await _context.SaveChangesAsync();
            return triagem;
        }

        public async Task<Triagem> Atualizar(Triagem triagem)
        {
            _context.Entry(triagem).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return triagem;
        }

        public async Task<bool> Deletar(int id)
        {
            var item = await _context.Triagens.FindAsync(id);
            if (item == null) return false;

            _context.Triagens.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}