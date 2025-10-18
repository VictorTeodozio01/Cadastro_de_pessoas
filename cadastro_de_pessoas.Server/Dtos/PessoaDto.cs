namespace cadastro_de_pessoas.Server.Dtos;

public class PessoaDto
{
    public int PessoaId { get; set; }
    public string PessoaNome { get; set; }
    public DateTime PessoaDataNascimento { get; set; }
    public string PessoaCPF { get; set; }
    public DateTime PessoaDataCadastro { get; set; }
    public DateTime PessoaDataAtualizacao { get; set; }
}
