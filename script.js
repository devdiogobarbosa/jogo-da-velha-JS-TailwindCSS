// estado do jogo: array de 9 posições (null, 'X' ou 'O')
const board = Array(9).fill(null);
let vez = 'X';
let rodando = true; // indica se o round está ativo

// combinações vencedoras (índices do array)
const wins = [
  [0,1,2], [3,4,5], [6,7,8], // linhas
  [0,3,6], [1,4,7], [2,5,8], // colunas
  [0,4,8], [2,4,6]           // diagonais
];

// cria o DOM do tabuleiro a partir do array 'board'
function criarTabuleiro(){
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';

  board.forEach((valor, idx) => {
    const cel = document.createElement('button');
    cel.className = 'h-20 rounded bg-slate-700 flex items-center justify-center text-3xl select-none';
    cel.dataset.index = idx; // qual índice do array é
    cel.disabled = !rodando || valor !== null;

    if(valor){
      cel.textContent = valor;
      // cor visual diferente para X e O
      if(valor === 'X') cel.classList.add('text-orange-400');
      else cel.classList.add('text-green-400');
    } else {
      cel.textContent = '';
    }

    cel.addEventListener('click', clicouNaCelula);
    boardEl.appendChild(cel);
  });

  // atualiza indicador de vez
  const vezEl = document.getElementById('vez');
  if(vezEl) vezEl.textContent = rodando ? vez : '—';
}

// chamado quando o usuário clica numa célula
function clicouNaCelula(e){
  const idx = Number(e.currentTarget.dataset.index);
  fazerJogada(idx);
}

// faz a jogada: atualiza array e UI, verifica fim
function fazerJogada(i){
  if(!rodando || board[i] !== null) return; // proteção

  board[i] = vez; // escreve no array
  criarTabuleiro(); // atualiza o DOM

  const v = checaVitoria(vez);
  if(v){
    rodando = false;
    mostraVitoria(vez, v);
    return;
  }

  if(checaEmpate()){
    rodando = false;
    mostraEmpate();
    return;
  }

  // troca a vez
  vez = vez === 'X' ? 'O' : 'X';
  const vezEl = document.getElementById('vez');
  if(vezEl) vezEl.textContent = vez;
}

// verifica se o jogador atual venceu — retorna o combo vencedor ou null
function checaVitoria(player){
  for(const combo of wins){
    const [a,b,c] = combo;
    if(board[a] === player && board[b] === player && board[c] === player){
      return combo;
    }
  }
  return null;
}

// verifica empate
function checaEmpate(){
  return board.every(c => c !== null);
}

// mostra visual de vitória com destaque nas células vencedoras
function mostraVitoria(player, combo){
  const statusEl = document.getElementById('status');
  statusEl.innerHTML = `Vez: <strong id="vez">${player}</strong> — <span class="font-bold">Venceu!</span>`;

  combo.forEach(i => {
    const cel = document.querySelector(`[data-index='${i}']`);
    if(cel) cel.classList.add('ring-4', 'ring-yellow-400');
  });
}

function mostraEmpate(){
  const statusEl = document.getElementById('status');
  statusEl.innerHTML = `Vez: <strong id="vez">—</strong> — Empate!`;
}

// reinicia o round mantendo 
function reinicia(){
  for(let i = 0; i < board.length; i++) board[i] = null;
  vez = 'X';
  rodando = true;
  const statusEl = document.getElementById('status');
  if(statusEl) statusEl.innerHTML = `Vez: <strong id="vez">${vez}</strong>`;
  criarTabuleiro();
}

// listeners iniciais
document.getElementById('resetBtn').addEventListener('click', reinicia);
document.addEventListener('DOMContentLoaded', criarTabuleiro);
