const largura_icone = 79;
const altura_icone = 79;
const quantia_icones = 9;
tempo_por_icone = 100;
const indexes = [0, 0, 0];
// Seleciona o botão pelo ID
const botao = document.getElementById('girarbotao');

const rodar = (roda, atraso = 0, alvo = null) =>{
    var delta = (atraso + 2) * quantia_icones + Math.round(Math.random() * quantia_icones);

    const style = getComputedStyle(roda);
    const posicaoBackground = parseFloat(style['background-position-y']);

    if (alvo){
        const posicaoAtual = posicaoBackground / altura_icone;
        delta = (delta - posicaoAtual) + (alvo-(delta % quantia_icones));
    }
    const pocisaoFinal = posicaoBackground + delta * altura_icone;
    const posicaoNormal = pocisaoFinal % (quantia_icones * altura_icone);


    return new Promise((resolve, reject) => {
        roda.style.transition = `background-position-y ${8 + delta * tempo_por_icone}ms cubic-bezier(.62,-0.23,.67,1.23)`;
        roda.style.backgroundPositionY = `${pocisaoFinal}px`;
        setTimeout(() => {
            roda.style.transition = 'none'
            roda.style.backgroundPositionY = `${posicaoNormal}px`;
            resolve(delta%quantia_icones);
        }, 8 + delta * tempo_por_icone);
    })
}

const rodarTodas = () =>{
    botao.disabled = true;
    let roubo = false;
    const alvos = window.timesRolled && window.timesRolled%2 && roubo ? [1,1,1] : null;
    if (!window.timesRolled) window.timesRolled = 0;
	window.timesRolled++;
    const rodas = document.querySelectorAll('.maquina > .roda');
    Promise.all([... rodas].map((roda, index) => rodar(roda, index, alvos ? alvos[index] : null)))
    .then((deltas)=>{
        deltas.forEach((delta, index) => {
            indexes[index] = (indexes[index] + delta) % quantia_icones;
        })
        console.log(indexes);
        
        if (indexes[0] === indexes[1] && indexes[0] === indexes[2]){
            console.log('Ganhou');
        }
        //setTimeout(rodarTodas, 3000);
    })
    .finally(() => {
        botao.disabled = false;
    });
}


// Adiciona um evento de clique ao botão
botao.addEventListener('click', function() {
    rodarTodas();
});
