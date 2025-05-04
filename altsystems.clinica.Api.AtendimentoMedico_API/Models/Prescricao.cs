namespace altsystems.clinica.Api.AtendimentoMedico_API.Models
{
    public class Prescricao
    {
        public int Id { get; set; }
        public int ConsultaId { get; set; }
        public string Medicamento { get; set; }
        public string Posologia { get; set; }
    }

}
