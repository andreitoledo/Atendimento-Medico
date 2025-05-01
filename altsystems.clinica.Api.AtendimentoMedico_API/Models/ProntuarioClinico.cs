namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;
public class ProntuarioClinico
{
    public int Id { get; set; }
    public int AgendamentoId { get; set; }
    public string Queixas { get; set; }
    public string Antecedentes { get; set; }
    public string SinaisVitais { get; set; }
    public string ExameFisico { get; set; }
    public string Conduta { get; set; }
    public string Prescricao { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;

    public Agendamento Agendamento { get; set; }
}