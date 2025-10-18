import React from 'react';
import type { Pessoa } from '../models/Pessoa';
import { format, parseISO } from 'date-fns';

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
    const formatCPF = (cpf: string | null | undefined) => {
        if (!cpf) return '';
        const clean = cpf.replace(/\D/g, '');
        if (clean.length !== 11){ return clean};
        return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

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
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="text-left">Nome</th>
                        <th className="text-left">CPF</th>
                        <th className="text-left">Data Nascimento</th>
                        <th className="text-left">Data de Cadastro</th>
                        <th className="text-left">Data de Atualizacao</th>
                        <th className="text-left">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pessoas.map((pessoa) => (
                        <tr key={pessoa.pessoaId} className="hover:bg-gray-50"> 
                            <td>{pessoa.pessoaNome}</td> 
                            <td>{formatCPF(pessoa.pessoaCPF)}</td>
                            <td>{format(parseISO(pessoa.pessoaDataNascimento), 'dd-MM-yyyy')}</td>
                            <td>{format(parseISO(pessoa.pessoaDataCadastro), 'dd-MM-yyy HH:mm:ss')}</td>
                            <td>{pessoa.pessoaDataAtualizacao ? format(parseISO(pessoa.pessoaDataAtualizacao), 'dd-MM-yyyy HH:mm:ss') : null} </td>
                            <td>
                                <button
                                    onClick={() => onEdit(pessoa)}
                                    className="text-blue-600 mr-3"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(pessoa.pessoaId)} 
                                    className="text-red-600"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};