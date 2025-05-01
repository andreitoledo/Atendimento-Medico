namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;
public class Receita
{
    public int Id { get; set; }
    public int AgendamentoId { get; set; }
    public string Medicamentos { get; set; }
    public string Orientacoes { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;

    public Agendamento Agendamento { get; set; }
}