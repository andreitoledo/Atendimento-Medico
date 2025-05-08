namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;
public class Agendamento
{
    public int Id { get; set; }
    public int MedicoId { get; set; }
    public int PacienteId { get; set; }
    public DateTime DataConsulta { get; set; }
    public string Status { get; set; } = "agendado";
    public string LinkVideo { get; set; }
    public string Plataforma { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;

    public bool CheckIn { get; set; }

    public Medico Medico { get; set; }
    public Paciente Paciente { get; set; }

    public decimal ValorConsulta { get; set; }

    public bool Atendido { get; set; } = false;





}