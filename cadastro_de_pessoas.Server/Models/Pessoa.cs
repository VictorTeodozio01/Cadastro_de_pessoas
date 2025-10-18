using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cadastro_de_pessoas.Server.Models;

public class Pessoa
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PessoaId { get; set; }
    [Required]
    public string PessoaNome { get; set; }
    [Required]
    public DateTime PessoaDataNascimento { get; set; }
    [Required]
    public string PessoaCPF { get; set; }
    public DateTime PessoaDataCadastro { get; set; }
    public DateTime? PessoaDataAtualizacao { get; set; } 
}