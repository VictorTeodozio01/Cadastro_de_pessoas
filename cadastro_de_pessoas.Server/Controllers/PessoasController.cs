using cadastro_de_pessoas.Server.Dtos;
using cadastro_de_pessoas.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace cadastro_de_pessoas.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly PessoaService _pessoaService;

    public PessoasController(PessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    [HttpGet]
    public async Task<List<PessoaDto>> GetAll() => await _pessoaService.GetAll();

    [HttpGet("{id:int}")]
    public async Task<PessoaDto> GetbyId(int id) => await _pessoaService.GetById(id);

    [HttpPost]
    public async Task<PessoaDto> Insert([FromBody] PessoaDto pessoa) => await _pessoaService.Insert(pessoa);

    [HttpPut("{id:int}")]
    public async Task<PessoaDto> Update(int id, [FromBody] PessoaDto pessoa) =>  await _pessoaService.Update(id, pessoa);

    [HttpDelete("{id:int}")]
    public async Task<bool> Delete(int id) => await _pessoaService.Delete(id);
}