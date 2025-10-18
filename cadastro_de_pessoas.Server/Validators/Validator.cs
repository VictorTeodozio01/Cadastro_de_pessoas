using FluentValidation;
using cadastro_de_pessoas.Server.Dtos;

public class Validator : AbstractValidator<PessoaDto>
{
    public Validator()
    {
        RuleFor(x => x.PessoaNome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(100).WithMessage("Nome deve ter no máximo 100 caracteres");

        RuleFor(x => x.PessoaCPF)
            .NotEmpty().WithMessage("CPF é obrigatório")
            .Must(CpfValido).WithMessage("CPF inválido");

        RuleFor(x => x.PessoaDataNascimento)
            .NotEmpty().WithMessage("Data de nascimento é obrigatória")
            .LessThan(DateTime.Today).WithMessage("Data de nascimento deve ser no passado");
    }

    private bool CpfValido(string cpf)
    {
        var c = new string(cpf.Where(char.IsDigit).ToArray());
        if (c.Length != 11 || c.All(ch => ch == c[0])) return false;

        int s = 0;
        for (int i = 0; i < 9; i++) s += (c[i] - '0') * (10 - i);
        int r = (s * 10) % 11;
        if (r == 10) r = 0;
        if (r != (c[9] - '0')) return false;

        s = 0;
        for (int i = 0; i < 10; i++) s += (c[i] - '0') * (11 - i);
        r = (s * 10) % 11;
        if (r == 10) r = 0;
        return r == (c[10] - '0');
    }
}