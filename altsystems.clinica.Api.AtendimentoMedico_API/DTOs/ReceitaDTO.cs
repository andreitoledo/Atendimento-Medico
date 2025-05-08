namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class ReceitaDTO
    {
        public string NomePaciente { get; set; } = null!;
        public string NomeMedico { get; set; } = null!;
        public DateTime DataConsulta { get; set; }
        //public List<string> Medicamentos { get; set; } = new();
        public IEnumerable<string> Medicamentos { get; set; } = Enumerable.Empty<string>();
        public string Orientacoes { get; set; } = "";
    }

}
