using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;


namespace altsystems.clinica.Api.AtendimentoMedico_API.Services
{
    public class ReciboPdfService
    {
        public byte[] GerarRecibo(ReciboDTO dto)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.Content()
                        .Column(col =>
                        {
                            col.Item().Text($"Recibo de Atendimento").FontSize(20).Bold();
                            col.Item().Text($"Paciente: {dto.NomePaciente}");
                            col.Item().Text($"Médico: {dto.NomeMedico}");
                            col.Item().Text($"Data: {dto.DataConsulta:dd/MM/yyyy}");
                            col.Item().Text($"Valor: R$ {dto.Valor:N2}");
                            if (!string.IsNullOrEmpty(dto.Observacoes))
                                col.Item().Text($"Observações: {dto.Observacoes}");
                        });
                });
            });

            return document.GeneratePdf();
        }
    }
}