import axios from 'axios';
import type { Pessoa } from '../models/Pessoa';


const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const pessoaService = {
    async GetAll(): Promise<Pessoa[]> {
        const resposta = await api.get('/pessoas');
        return resposta.data;
    },

    async GetbyId(id: number): Promise<Pessoa> {
        const resposta = await api.get(`/pessoas/${id}`);
        return resposta.data;
    },

    async Insert(pessoa: Pessoa): Promise<Pessoa> {
        const resposta = await api.post('/pessoas', pessoa);
        return resposta.data;
    },

    async Update(id: number, pessoa: Pessoa): Promise<Pessoa> {
        const resposta = await api.put(`/pessoas/${id}`, pessoa);
        return resposta.data;
    },

    async Delete(id: number): Promise<void> {
        await api.delete(`/pessoas/${id}`);
    },
};
