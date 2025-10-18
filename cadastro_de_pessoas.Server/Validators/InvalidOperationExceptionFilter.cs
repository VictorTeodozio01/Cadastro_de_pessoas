using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace cadastro_de_pessoas.Server.Validators
{
    public class InvalidOperationExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is InvalidOperationException ex)
            {
                context.Result = new BadRequestObjectResult(new { mensagem = ex.Message });
                context.ExceptionHandled = true;
            }
        }
    }
}
