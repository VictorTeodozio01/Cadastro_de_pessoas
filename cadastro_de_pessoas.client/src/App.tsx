import { useState, useEffect } from 'react';
import { ConfirmDialog } from './components/ConfirmDialog';
import { PessoaForm } from './components/PessoaForm';
import { PessoaList } from './components/PessoaList';
import { pessoaService } from './services/api';
import type { Pessoa } from './models/Pessoa';

export function App() {
    const [pessoas, Pessoas] = useState<Pessoa[]>([]);
    const [carregando, Carregado] = useState(false);
    const [mostrarFormulario, MostrarFormulario] = useState(false);
    
    const [mostrarDialogoConfirmacao, MostrarDialogoConfirmacao] = useState(false);
    const [editar, Editar] = useState<Pessoa | undefined>();
    const [excluir, Excluir] = useState<number | null>(null);
    const [erro, setErro] = useState<string>('');

    useEffect(() => {
        carregarPessoas();
    }, []);

    const carregarPessoas = async () => {
        try {
            Carregado(true);
            setErro('');
            const data = await pessoaService.GetAll();
            Pessoas(data);
        } catch (err) {
            setErro('Erro ao carregar pessoas. Verifique se o backend esta rodando.');
            console.error('Erro ao carregar pessoas:', err);
        } finally {
            Carregado(false);
        }
    };

    const criarPessoa = () => {
        Editar(undefined);
        MostrarFormulario(true);
    };

    const editarPessoa = (pessoa: Pessoa) => {
        Editar(pessoa);
        MostrarFormulario(true);
    };

    const solicitarExclusao = (id: number) => {
        Excluir(id);
        MostrarDialogoConfirmacao(true);
    };

    const confirmarExclusao = async () => {
        if (excluir) {
            try {
                await pessoaService.Delete(excluir);
                await carregarPessoas();
                MostrarDialogoConfirmacao(false);
                Excluir(null);
            } catch (err) {
                setErro('Erro ao excluir pessoa.');
                console.error('Erro ao excluir pessoa:', err);
            }
        }
    };

    const enviarFormulario = async (dadosPessoa: Pessoa) => {
        setErro('');
        if (editar) {
            await pessoaService.Update(editar.pessoaId, dadosPessoa);
        } else {
            await pessoaService.Insert(dadosPessoa);
        }
        MostrarFormulario(false);
        Editar(undefined);
        await carregarPessoas();
    };

    const cancelarFormulario = () => {
        MostrarFormulario(false);
        Editar(undefined);
        setErro('');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white -lg p-6">
                    <button
                        onClick={criarPessoa}
                        className="bg-green-600 text-white px-3 py-1"
                    >
                        Nova Pessoa
                    </button>

                    {erro && (
                        <div className="mb-4 bg-red-100 border border-red-400 px-4 py-3 ">
                            {erro}
                        </div>
                    )}

                    {mostrarFormulario ? (
                        <div className="bg-gray-50 p-4 ">
                            <h2 className="bg-gray-50 p-4  font-bold">
                                {editar ? 'Editar Pessoa' : 'Nova Pessoa'}
                            </h2>
                            <PessoaForm
                                pessoa={editar}
                                onSubmit={enviarFormulario}
                                onCancel={cancelarFormulario}
                                isLoading={carregando} />
                        </div>
                    ) : (
                        <div>
                            <PessoaList
                                pessoas={pessoas}
                                onEdit={editarPessoa}
                                onDelete={solicitarExclusao}
                                isLoading={carregando} />
                        </div>
                    )}

                    <ConfirmDialog
                        isOpen={mostrarDialogoConfirmacao}
                        title="Confirmar Exclusão"
                        message="Tem certeza que deseja excluir esta pessoa? Esta ação não pode ser desfeita."
                        onConfirm={confirmarExclusao}
                        onCancel={() => {
                            MostrarDialogoConfirmacao(false);
                            Excluir(null);
                        }}
                        confirmText="Excluir"
                        cancelText="Cancelar" />
                </div>
            </div>
        </div>
    );
}
