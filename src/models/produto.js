class Produto {
    // id: number;
    // produto: string;
    // valor: number;

    static produtos = [];
    static proximoId = 1;

    static listar() {
        return [...this.produtos];
    }

    static adicionar(dadosProduto) {
        if (!dadosProduto || typeof dadosProduto.produto !== 'string' || typeof dadosProduto.valor !== 'number') {
            console.error('Dados do produto inválidos.', dadosProduto);
            return null;
        }
        const novoProduto = {
            id: this.proximoId++,
            produto: dadosProduto.produto,
            valor: dadosProduto.valor
        };
        this.produtos.push(novoProduto);
        return {...novoProduto};
    }

    static atualizar(id, dadosAtualizados) {
        const index = this.produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            const { id: _, ...updates} = dadosAtualizados;
            this.produtos[index] = { ...this.produtos[index], ...updates };
            return {...this.produtos[index]};   
        }
        return null;
    }

    static excluir(id) {
        const index = this.produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            const [produtoExcluido] = this.produtos.splice(index, 1);
            return {...produtoExcluido};
        }
        return null;

    }
    
}

module.exports = Produto;