/* Grupo 01 | Sprint 2 | Pacientes: cadastro, edição e exclusão. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.pacientes = ClinicParts.pacientes || {};
ClinicParts.pacientes.formularioFront = {
  fields: [
    {
      key: "nome",
      label: "Nome completo",
      required: true,
      placeholder: "Ex.: Camila Almeida",
      wide: true,
    },
    {
      key: "cpf",
      label: "CPF",
      required: true,
      placeholder: "000.000.000-00",
      mask: "cpf",
      max: 14,
    },
    {
      key: "telefone",
      label: "Telefone",
      type: "tel",
      required: true,
      placeholder: "(49) 99999-0000",
      mask: "phone",
      max: 16,
    },
    { key: "nascimento", label: "Data de nascimento", type: "date" },
    {
      key: "email",
      label: "E-mail",
      type: "email",
      wide: true,
      placeholder: "paciente@exemplo.com",
    },
    {
      key: "convenioId",
      label: "Convênio",
      type: "select",
      source: "convenios",
      placeholder: "Particular (sem convênio)",
      wide: true,
    },
    {
      key: "observacoes",
      label: "Observações administrativas",
      type: "textarea",
      wide: true,
      helper: "Use dados fictícios neste projeto educacional.",
    },
  ],
  deletePreview(row, db) {
    const vinculos = (db.agendamentos || []).filter(
      (a) => a.pacienteId === row.id,
    ).length;
    if (vinculos > 0)
      return `${row.nome} possui ${vinculos} consulta(s) no histórico e não pode ser excluído(a). Para liberar um horário, cancele a consulta na agenda.`;
    return `O cadastro de ${row.nome} (CPF ${ClinicUtils.cpfFormat(row.cpf)}) será removido permanentemente. Esta ação não pode ser desfeita.`;
  },
};