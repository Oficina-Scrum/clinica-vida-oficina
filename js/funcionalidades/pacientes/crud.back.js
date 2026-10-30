/* Grupo 01 | Sprint 2 | Pacientes: cadastro, edição e exclusão. Regras locais no navegador, sem servidor. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.pacientes = ClinicParts.pacientes || {};
ClinicParts.pacientes.crudBack = {
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    const u = ClinicUtils,
      e = {};
    u.requiredName(d.nome, e);

    if (!u.digits(d.cpf)) e.cpf = "Informe o CPF do paciente.";
    else if (!u.cpfValid(d.cpf)) e.cpf = "Informe um CPF válido.";
    else if (u.unique(db, "pacientes", "cpf", d.cpf, d.id, u.digits))
      e.cpf = "Já existe um paciente cadastrado com este CPF.";

    const phone = u.digits(d.telefone);
    if (!phone) e.telefone = "Informe o telefone do paciente.";
    else if (phone.length < 10 || phone.length > 11)
      e.telefone = "Informe o telefone com DDD (10 ou 11 dígitos).";

    if (u.text(d.nascimento)) {
      if (!u.validDate(d.nascimento))
        e.nascimento = "Informe uma data de nascimento válida.";
      else if (d.nascimento > u.localDate())
        e.nascimento = "A data de nascimento não pode estar no futuro.";
    }

    if (u.text(d.email)) {
      if (u.text(d.email).length > 120)
        e.email = "Use até 120 caracteres.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.text(d.email)))
        e.email = "Informe um e-mail válido.";
    }

    // Convênio é opcional: vazio significa atendimento particular.
    if (d.convenioId && !u.reference(db, "convenios", d.convenioId))
      e.convenioId = "Selecione um convênio cadastrado.";

    if (u.text(d.observacoes).length > 1000)
      e.observacoes = "Use até 1.000 caracteres.";

    u.fail(e);
  },
  salvar(d, original) {
    const u = ClinicUtils;
    const row = {
      id: d.id || "",
      nome: u.text(d.nome),
      cpf: u.digits(d.cpf),
      telefone: u.digits(d.telefone),
      nascimento: u.text(d.nascimento),
      email: u.text(d.email),
      convenioId: d.convenioId || "",
      observacoes: u.text(d.observacoes),
    };
    this.validar(row);
    return ClinicStore.save("pacientes", row, `paciente ${row.nome}`, original);
  },
  excluir(id) {
    // Consultas referenciam o paciente; excluí-lo deixaria agendamentos órfãos
    // e tornaria o backup inválido na importação. O histórico é preservado.
    return ClinicStore.remove("pacientes", id, (db) => {
      const vinculos = db.agendamentos.filter((a) => a.pacienteId === id).length;
      if (vinculos > 0)
        throw new ClinicError(
          `Este paciente possui ${vinculos} consulta(s) no histórico e não pode ser excluído. Cancele as consultas ativas na agenda.`,
        );
    });
  },
};