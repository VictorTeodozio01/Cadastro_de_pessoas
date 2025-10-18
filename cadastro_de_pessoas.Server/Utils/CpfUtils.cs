using System.Text.RegularExpressions;

namespace cadastro_de_pessoas.Server.Utils
{
    public static class CpfUtils
    {
        public static bool ValidarCpf(string cpf)
        {
            if (string.IsNullOrWhiteSpace(cpf))
                return false;

            // Remove non-digits
            cpf = Regex.Replace(cpf, @"[^\d]", "");

            if (cpf.Length != 11)
                return false;

            // Elimina CPFs com todos os dígitos iguais
            var invalidos = new string[]
            {
                "00000000000","11111111111","22222222222","33333333333",
                "44444444444","55555555555","66666666666","77777777777",
                "88888888888","99999999999"
            };
            if (invalidos.Contains(cpf))
                return false;

            int[] nums = cpf.Select(c => int.Parse(c.ToString())).ToArray();

            // Primeiro dígito verificador
            int soma = 0;
            for (int i = 0; i < 9; i++)
                soma += nums[i] * (10 - i);
            int resto = soma % 11;
            int dig1 = (resto < 2) ? 0 : 11 - resto;
            if (nums[9] != dig1) return false;

            // Segundo dígito verificador
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += nums[i] * (11 - i);
            resto = soma % 11;
            int dig2 = (resto < 2) ? 0 : 11 - resto;
            if (nums[10] != dig2) return false;

            return true;
        }
    }
}
