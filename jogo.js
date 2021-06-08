let jogo;

const elementos = {
  telaInicial: document.getElementById('inicial'),
  telaJogo: document.getElementById('jogo'),
  telaMensagem: document.querySelector('.mensagem'),
  telaCadastro: document.querySelector('.cadastro'),
  textoMensagem: document.querySelector('.mensagem .texto'),
  teclado: document.querySelector('.teclado'),
  palavra: document.querySelector('.palavra'),
  dica: document.querySelector('.dica'),
  botoes: {
    facil: document.querySelector('.botao-facil'),
    medio: document.querySelector('.botao-medio'),
    dificil: document.querySelector('.botao-dificil'),
    cadastro: document.querySelector('.botao-cadastro'),
    confirmacao: document.querySelector('.botao-confirmacao'),
    reiniciar: document.querySelector('.reiniciar'),
  },
  boneco: [
    document.querySelector('.boneco-cabeca'),
    document.querySelector('.boneco-corpo'),
    document.querySelector('.boneco-braco-esquerdo'),
    document.querySelector('.boneco-braco-direito'),
    document.querySelector('.boneco-perna-esquerda'),
    document.querySelector('.boneco-perna-direita'),
  ],
};

const palavras = {
  facil: ['anciã', 'série', 'avaro', 'maior', 'noite', 'ímpar', 'salvo', 'vetor', 'prado', 'pecha'],
  medio: ['cônjuge', 'exceção', 'efêmero', 'prolixo', 'idílico', 'análogo', 'caráter', 'genuíno', 'estória', 'sublime'],
  dificil: ['concepção', 'plenitude', 'essencial', 'hipócrita', 'corolário', 'paradigma', 'dicotomia', 'hegemonia', 'ratificar', 'propósito'],
  dicas: {
    facil: [
      'Mulher que possui uma idade muito avançada; mulher velha.',
      'Conjunto ordenado de fatos, coisas, objetos análogos; sequência: dispor as coisas em séries homogêneas.',
      'Avarento; que guarda dinheiro; muito apegado ao dinheiro.',
      'Pessoa que atingiu a maioridade penal, civil ou eleitoral: maior de idade.',
      'Espaço de tempo entre o pôr do sol e o amanhecer.',
      'Que não é divisível por dois.',
      'Não atingido; resguardado, preservado, intacto.',
      'Elemento de um espaço vetorial.',
      'Terreno coberto de plantas herbáceas que servem para pastagem; campina.',
      'Imperfeição; falha moral; falta de adequação às conveniências.',
    ],
    medio: [
      'Indivíduo, em relação à pessoa a quem está matrimonialmente vinculado; consorte.',
      'Desvio de uma regra ou de um padrão convencionalmente aceito.',
      'Que é passageiro, temporário, transitório.',
      'Que usa palavras em demasia ao falar ou escrever; que não sabe sintetizar o pensamento.',
      'Que se refere a idílio; de caráter idílio; pastoril, puro, bucólico.',
      'Que é parecido ou que se parece com outra coisa ou pessoa; semelhante, idêntico.',
      'Caracterização do próprio sujeito; índole, temperamento, personalidade.',
      'Que não sofreu alterações nem falsificações; verdadeiro.',
      'Narrativa de cunho popular e tradicional; história.',
      'Que apresenta inexcedível perfeição material, moral ou intelectual; elevado.',
    ],
    dificil: [
      'Ação de gerar ou de ser gerado, através da junção de um espermatozoide com um óvulo; fecundação.',
      'estado do que é inteiro, completo; totalidade, integridade.',
      'O que é imprescindível; muito necessário; fundamental.',
      'Quem demonstra uma opinião que não possui ou dissimula qualidades que não têm; fingido.',
      'Situação que ocorre a partir de outras; resultado.',
      'um exemplo que serve como modelo; padrão.',
      'modalidade de classificação em que cada uma das divisões e subdivisões contém apenas dois termos.',
      'Supremacia, domínio, poder que algo ou alguém exerce em relação aos demais.',
      'Confirmar um ato ou compromisso; validar.',
      'Grande vontade de realizar ou de alcançar alguma coisa; desígnio.',
    ],
  },
};

const novoJogo = () => {
  jogo = {
    dificuldade: undefined,
    palavra: {
      original: undefined,
      semAcentos: undefined,
      tamanho: undefined,
    },
    dicas: undefined,
    acertos: undefined,
    jogadas: [],
    chances: 6,
    definirPalavra: function (palavra) {
      this.palavra.original = palavra;
      this.palavra.tamanho = palavra.length;
      this.acertos = '';
      this.palavra.semAcentos = this.palavra.original.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      for (let i = 0; i < this.palavra.tamanho; i++) {
        this.acertos += ' ';
      }
    },
    jogar: function (letraJogada) {
      let acertou = false;
      for (let i = 0; i < this.palavra.tamanho; i++) {
        const letra = this.palavra.semAcentos[i].toLowerCase();
        if (letra === letraJogada.toLowerCase()) {
          acertou = true;
          this.acertos = replace(this.acertos, i, this.palavra.original[i]);
        }
      }
      if (!acertou) {
        this.chances--;
      }
      return acertou;
    },
    ganhou: function () {
      return !this.acertos.includes(' ');
    },
    perdeu: function () {
      return this.chances <= 0;
    },
    acabou: function () {
      return this.ganhou() || this.perdeu();
    },
  };

  elementos.telaInicial.style.display = 'flex';
  elementos.telaJogo.style.display = 'none';
  elementos.telaMensagem.style.display = 'none';
  elementos.telaCadastro.style.display = 'none';
  elementos.telaMensagem.classList.remove('mensagem-vitoria');
  elementos.telaMensagem.classList.remove('mensagem-derrota');
  for (const parte of elementos.boneco) {
    parte.classList.remove('escondido');
    parte.classList.add('escondido');
  }

  criarTeclado();
};

const criarTeclado = () => {
  const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  elementos.teclado.textContent = '';
  for (const letra of letras) {
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(letra.toUpperCase()));
    button.classList.add(`botao-${letra}`);

    elementos.teclado.appendChild(button);

    button.addEventListener('click', () => {
      if (!jogo.jogadas.includes(letra) && !jogo.acabou()) {
        const acertou = jogo.jogar(letra);
        jogo.jogadas.push(letra);
        button.classList.add(acertou ? 'certo' : 'errado');
        mostrarPalavra();

        if (!acertou) {
          mostrarErro();
        }

        if (jogo.ganhou()) {
          mostrarMensagem(true);
        } else if (jogo.perdeu()) {
          mostrarMensagem(false);
        }
      }
    });
  }
};

const mostrarErro = () => {
  const parte = elementos.boneco[5 - jogo.chances];
  parte.classList.remove('escondido');
};

const mostrarMensagem = vitoria => {
  const mensagem = vitoria ? '<p>Parabéns!</p><p>Você GANHOU!</p>' : '<p>Que pena!</p><p>Você PERDEU!</p>';
  elementos.textoMensagem.innerHTML = mensagem;
  elementos.telaMensagem.style.display = 'flex';
  elementos.telaMensagem.classList.add(`mensagem-${vitoria ? 'vitoria' : 'derrota'}`);
};

const sortearPalavra = () => {
  const i = Math.floor(Math.random() * palavras[jogo.dificuldade].length);
  const palavra = palavras[jogo.dificuldade][i];
  jogo.definirPalavra(palavra);
  const dica = palavras.dicas[jogo.dificuldade][i];
  elementos.dica.innerHTML = '<p>Dica: '+dica+'<p>';
  
  console.log(jogo.palavra.original);

  return jogo.palavra.original;
};

const mostrarPalavra = () => {
  elementos.palavra.textContent = '';
  for (let i = 0; i < jogo.acertos.length; i++) {
    const letra = jogo.acertos[i].toUpperCase();
    elementos.palavra.innerHTML += `<div class="letra-${i}">${letra}</div>`;
  }
};

const iniciarJogo = dificuldade => {
  jogo.dificuldade = dificuldade;
  elementos.telaInicial.style.display = 'none';
  elementos.telaJogo.style.display = 'flex';

  sortearPalavra();
  mostrarPalavra();
  
};

const cadastrarPalavra = () => {
  elementos.telaInicial.style.display = 'none';
  elementos.telaCadastro.style.display = 'block';
  cadastro = {
    dificuldade: undefined,
    palavra: undefined,
    dica: undefined,
  }
};

const confirmarCadastro = () => {
  elementos.telaInicial.style.display = 'none';
  elementos.telaJogo.style.display = 'flex'; 
}

const replace = (str, i, newChar) => str.substring(0, i) + newChar + str.substring(i + 1);

elementos.botoes.facil.addEventListener('click', () => iniciarJogo('facil'));
elementos.botoes.medio.addEventListener('click', () => iniciarJogo('medio'));
elementos.botoes.dificil.addEventListener('click', () => iniciarJogo('dificil'));
elementos.botoes.cadastro.addEventListener('click', () => cadastrarPalavra());
elementos.botoes.confirmacao.addEventListener('click', () => confirmarCadastro());

elementos.botoes.reiniciar.addEventListener('click', () => novoJogo());

novoJogo();
