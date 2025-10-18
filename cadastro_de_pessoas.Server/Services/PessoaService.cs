using cadastro_de_pessoas.Server.Data;
using cadastro_de_pessoas.Server.Dtos;
using cadastro_de_pessoas.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace cadastro_de_pessoas.Server.Services;

public class PessoaService
{
    private readonly AppDbContext _db;
    private readonly Validator _validador; 

    public PessoaService(AppDbContext db, Validator validador)
    {
        _db = db;
        _validador = validador;
    }

    public async Task<List<PessoaDto>> GetAll()
    {
        var pessoas = await _db.Pessoas.ToListAsync();
        return pessoas.Select(Dto).ToList();
    }

    public async Task<PessoaDto> GetById(int id)
    {
        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa == null)
        {
            throw new InvalidOperationException("Pessoa não encontrada.");
        }
        return Dto(pessoa);
    }

    public async Task<PessoaDto> Insert(PessoaDto pessoadto)
    {
        await _validador.PessoaFormValidador(pessoadto);

        var cpf = pessoadto.PessoaCPF.Trim();
        if (await _db.Pessoas.AnyAsync(x => x.PessoaCPF == cpf))
        {
            throw new InvalidOperationException("CPF já cadastrado.");
        }

        var nome = pessoadto.PessoaNome.Trim();
        if (await _db.Pessoas.AnyAsync(x => x.PessoaNome == null))
        {
            throw new InvalidOperationException("Digite o nome da pessoa");
        }

        var pessoa = new Pessoa
        {
            PessoaNome = pessoadto.PessoaNome.Trim(),
            PessoaDataNascimento = pessoadto.PessoaDataNascimento.Date,
            PessoaCPF = cpf,
            PessoaDataCadastro = DateTime.Now
        };

        _db.Pessoas.Add(pessoa);
        await _db.SaveChangesAsync();

        return Dto(pessoa);
    }

    public async Task<PessoaDto> Update(int id, PessoaDto pessoadto)
    {
        await _validador.PessoaFormValidador(pessoadto);

        var pessoa = await _db.Pessoas.FindAsync(id);
        var cpf = pessoadto.PessoaCPF.Trim();
        if (cpf != pessoa.PessoaCPF)
        {
            if (await _db.Pessoas.AnyAsync(x => x.PessoaCPF == cpf && x.PessoaId != id))
            {
                throw new InvalidOperationException("CPF já cadastrado por outro registro.");
            }
        }

        pessoa.PessoaNome = pessoadto.PessoaNome.Trim();
        pessoa.PessoaDataNascimento = pessoadto.PessoaDataNascimento.Date;
        pessoa.PessoaCPF = cpf;
        pessoa.PessoaDataAtualizacao = DateTime.Now;

        await _db.SaveChangesAsync();
        return Dto(pessoa);
    }

    public async Task<bool> Delete(int id)
    {
        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa == null)
        {
            throw new InvalidOperationException("Pessoa não encontrada.");
        }
        _db.Pessoas.Remove(pessoa);
        await _db.SaveChangesAsync();
        return true;
    }

    private static PessoaDto Dto(Pessoa pessoa) => new()
    {
        PessoaId = pessoa.PessoaId,
        PessoaNome = pessoa.PessoaNome,
        PessoaDataNascimento = pessoa.PessoaDataNascimento,
        PessoaCPF = pessoa.PessoaCPF,
        PessoaDataCadastro = pessoa.PessoaDataCadastro,
        PessoaDataAtualizacao = pessoa.PessoaDataAtualizacao
    };
}