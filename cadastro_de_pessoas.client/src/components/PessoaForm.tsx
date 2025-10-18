import React, { useState, useEffect } from 'react';
import type { Pessoa } from '../models/Pessoa';
import type { PessoaDto } from '../dto/PessoaDto';
import axios from 'axios';
import { formatarCPF } from '../utils';

interface PessoaFormProps {
    pessoa?: Pessoa;
    onSubmit: (pessoa: PessoaDto) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const PessoaForm: React.FC<PessoaFormProps> = ({
    pessoa,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<PessoaDto>({
        pessoaId: 0, 
        pessoaNome: '',
        pessoaDataNascimento: '',
        pessoaCPF: '',
    });

    const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (pessoa) {
            setFormData({
                pessoaId: pessoa.pessoaId,
                pessoaNome: pessoa.pessoaNome,
                pessoaDataNascimento: pessoa.pessoaDataNascimento.split('T')[0],
                pessoaCPF: pessoa.pessoaCPF,
            });
        } else {
            setFormData({
                pessoaId: 0,
                pessoaNome: '',
                pessoaDataNascimento: '',
                pessoaCPF: '',
            });
        }
        setApiErrors({});
    }, [pessoa]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let cleanValue = value;

        if (name === 'pessoaCPF') {
            cleanValue = value.replace(/\D/g, '');
        }

        setFormData((prev) => ({ ...prev, [name]: cleanValue }));

        if (apiErrors[name]) {
            setApiErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiErrors({});

        const payload: PessoaDto = {
            ...formData,
            pessoaDataNascimento: new Date(formData.pessoaDataNascimento).toISOString(),
        };

        try {
            await onSubmit(payload);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;

                if (Array.isArray(data)) {
                    const fieldErrors: Record<string, string> = {};                 
                    setApiErrors(fieldErrors);
                } else if (typeof data === 'object' && data !== null && 'mensagem' in data) {
                    setApiErrors({ general: (data as { mensagem: string }).mensagem });
                } else {
                    setApiErrors({ general: 'Erro no servidor.' });
                }
            } else {
                setApiErrors({ general: 'Erro de conexão. Verifique sua rede.' });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="block mb-1">Nome *</label>
                <input
                    type="text"
                    name="pessoaNome"
                    value={formData.pessoaNome}
                    onChange={handleChange}
                    className="w-full border p-2 "
                    disabled={isLoading}
                />
                { apiErrors.pessoaNome && <p className="text-red-600 text-sm mt-1">{apiErrors.pessoaNome}</p> }
            </div>

            <div>
                <label className="block mb-1">CPF *</label>
                <input
                    type="text"
                    name="pessoaCPF"
                    value={formatarCPF(formData.pessoaCPF)}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="w-full border p-2 "
                    disabled={isLoading}
                />
                {apiErrors.pessoaCPF && <p className="text-red-600 text-sm mt-1">{apiErrors.pessoaCPF}</p>}
            </div>

            <div>
                <label className="block mb-1">Data de Nascimento *</label>
                <input
                    type="date"
                    name="pessoaDataNascimento"
                    value={formData.pessoaDataNascimento}
                    onChange={handleChange}
                    className="w-full border p-2 "
                    disabled={isLoading}
                />
                {apiErrors.pessoaDataNascimento && (
                    <p className="text-red-600 text-sm mt-1">{apiErrors.pessoaDataNascimento}</p>
                )}
            </div>

            {apiErrors.general && (
                <div className="p-2 bg-red-50 text-red-700  text-sm">
                    {apiErrors.general}
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-4 py-2 border  hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 disabled:opacity-60"
                >
                    {isLoading ? 'Salvando...' : pessoa ? 'Atualizar' : 'Cadastrar'}
                </button>
            </div>
        </form>
    );
};