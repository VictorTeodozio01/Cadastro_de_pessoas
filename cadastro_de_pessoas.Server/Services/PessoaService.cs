using cadastro_de_pessoas.Server.Data;
using cadastro_de_pessoas.Server.Dtos;
using cadastro_de_pessoas.Server.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace cadastro_de_pessoas.Server.Services;

public class PessoaService
{
    private readonly AppDbContext _db;
    private readonly IValidator<PessoaDto> _validador; 

    public PessoaService(AppDbContext db, Validator validador)
    {
        _db = db;
        _validador = validador;
    }

    public async Task<List<PessoaDto>> GetAll()
    {
        var pessoas = await _db.Pessoas
            .OrderByDescending(p => p.PessoaDataCadastro)
            .ToListAsync();

        return pessoas.Select(Dto).ToList();
    }

    public async Task<PessoaDto> GetById(int id)
    {
        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa == null)
            throw new InvalidOperationException("Pessoa não encontrada.");

        return Dto(pessoa);
    }

    public async Task<PessoaDto> Insert(PessoaDto modelo)
    {
        var validationResult = await _validador.ValidateAsync(modelo);
        if (!validationResult.IsValid)
        {
            var erros = string.Join("; ", validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}"));
            throw new InvalidOperationException($"Erro de validação: {erros}");
        }

        var cpfLimpo = modelo.PessoaCPF.Trim();
        if (await _db.Pessoas.AnyAsync(x => x.PessoaCPF == cpfLimpo))
        {
            throw new InvalidOperationException("CPF já cadastrado.");
        }

        var pessoa = new Pessoa
        {
            PessoaNome = modelo.PessoaNome.Trim(),
            PessoaDataNascimento = modelo.PessoaDataNascimento.Date,
            PessoaCPF = cpfLimpo,
            PessoaDataCadastro = DateTime.UtcNow,
            PessoaDataAtualizacao = DateTime.UtcNow
        };

        _db.Pessoas.Add(pessoa);
        await _db.SaveChangesAsync();

        return Dto(pessoa);
    }

    public async Task<PessoaDto> Update(int id, PessoaDto modelo)
    {
        var validationResult = await _validador.ValidateAsync(modelo);
        if (!validationResult.IsValid)
        {
            var erros = string.Join("; ", validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}"));
            throw new InvalidOperationException($"Erro de validação: {erros}");
        }

        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa == null)
            throw new InvalidOperationException("Pessoa não encontrada.");

        var cpfLimpo = modelo.PessoaCPF.Trim();
        if (cpfLimpo != pessoa.PessoaCPF)
        {
            if (await _db.Pessoas.AnyAsync(x => x.PessoaCPF == cpfLimpo && x.PessoaId != id))
            {
                throw new InvalidOperationException("CPF já cadastrado por outro registro.");
            }
        }

        pessoa.PessoaNome = modelo.PessoaNome.Trim();
        pessoa.PessoaDataNascimento = modelo.PessoaDataNascimento.Date;
        pessoa.PessoaCPF = cpfLimpo;
        pessoa.PessoaDataAtualizacao = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Dto(pessoa);
    }

    public async Task<bool> Delete(int id)
    {
        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa == null)
            throw new InvalidOperationException("Pessoa não encontrada.");

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