import React, { useState } from 'react';
import type { Pessoa } from '../models/Pessoa';
import { format, parseISO } from 'date-fns';
import { formatarCPF } from '../utils';

interface PessoaListProps {
    pessoas: Pessoa[];
    onEdit: (pessoa: Pessoa) => void;
    onDelete: (id: number) => void;
    isLoading?: boolean;
}

export const PessoaList: React.FC<PessoaListProps> = ({
    pessoas,
    onEdit,
    onDelete,
    isLoading = false,
}) => {
    const [filtroNome, setFiltroNome] = useState('');

    const filtro = pessoas.filter((p) => {
        const nomeMatch = p.pessoaNome
            .toLowerCase()
            .includes(filtroNome.toLowerCase());
        return nomeMatch;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div>Carregando...</div>
            </div>
        );
    }

    if (pessoas.length === 0) {
        return (
            <div className="text-center py-8">
                <p>Nenhuma pessoa cadastrada.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            {/* Campos de filtro */}
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nome"
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    className="border px-3"
                />

            </div>

            {/* Tabela */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="text-left px-3 py-2">Nome</th>
                        <th className="text-left px-3 py-2">CPF</th>
                        <th className="text-left px-3 py-2">Data Nascimento</th>
                        <th className="text-left px-3 py-2">Data de Cadastro</th>
                        <th className="text-left px-3 py-2">Data de Atualização</th>
                        <th className="text-left px-3 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filtro.map((pessoa) => (
                        <tr key={pessoa.pessoaId} className="hover:bg-gray-50">
                            <td className="px-3 py-2">{pessoa.pessoaNome}</td>
                            <td className="px-3 py-2">
                                {formatarCPF(pessoa.pessoaCPF)}
                            </td>
                            <td className="px-3 py-2">
                                {format(parseISO(pessoa.pessoaDataNascimento), 'dd-MM-yyyy')}
                            </td>
                            <td className="px-3 py-2">
                                {format(parseISO(pessoa.pessoaDataCadastro), 'dd-MM-yyyy HH:mm:ss')}
                            </td>
                            <td className="px-3 py-2">
                                {pessoa.pessoaDataAtualizacao
                                    ? format(
                                        parseISO(pessoa.pessoaDataAtualizacao),
                                        'dd-MM-yyyy HH:mm:ss'
                                    )
                                    : ''}
                            </td>
                            <td className="px-3 py-2">
                                <button
                                    onClick={() => onEdit(pessoa)}
                                    className="text-blue-600 hover:underline mr-3"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(pessoa.pessoaId)}
                                    className="text-red-600 hover:underline"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filtro.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    Nenhuma pessoa encontrada com esses filtros.
                </div>
            )}
        </div>
    );
};
