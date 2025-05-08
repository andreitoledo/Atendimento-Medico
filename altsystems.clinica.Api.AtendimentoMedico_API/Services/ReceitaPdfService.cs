using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

public class ReceitaPdfService
{
    public byte[] GerarPdf(ReceitaDTO dto)
    {
        var doc = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(2, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header().Text("Clínica Online").FontSize(20).Bold();
                page.Content().Stack(stack =>
                {
                    stack.Item().Text("Receita Médica").FontSize(16).Bold().Underline().AlignCenter();
                    stack.Item().PaddingVertical(10).LineHorizontal(1);

                    stack.Item().Text($"Paciente: {dto.NomePaciente}");
                    stack.Item().Text($"Profissional: {dto.NomeMedico}");
                    stack.Item().Text($"Data da Consulta: {dto.DataConsulta:dd/MM/yyyy}");

                    stack.Item().PaddingVertical(10).Text("Medicamentos Prescritos:").Bold();
                    foreach (var med in dto.Medicamentos)
                        stack.Item().Text(med);

                    if (!string.IsNullOrWhiteSpace(dto.Orientacoes))
                    {
                        stack.Item().PaddingTop(10).Text("Orientações:").Bold();
                        stack.Item().Text(dto.Orientacoes);
                    }

                    stack.Item().PaddingVertical(20).LineHorizontal(1);
                    stack.Item().AlignRight().Text($"Assinado: {dto.NomeMedico}").Italic();
                });
            });
        });

        return doc.GeneratePdf();
    }
}
