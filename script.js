const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// definido um ratio de 16:9
canvas.width = 1024 //window.innerWidth

canvas.height = 576 //window.innerHeight      

let lastKey


const gravity = 0.5

// Propriedades do jogador, como posição, cor
class Player {
    constructor() {
        this.speed = 5
        this.position = {
            x:100,
            y:100,
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66
        this.height = 150
        this.margin = 0
        this.image = criarImagem("/imgs/spriteStandRight.png",'.divImgSpriteStandRight')
        //  representa em qual frame estamos dentro de nosso sprite sheet
        this.frames = 0

        // associamos os sprites as ações do jogador
        this.sprites = {
            stand: {
                right: criarImagem("/imgs/spriteStandRight.png",'.divImgSpriteStandRight'),
                left: criarImagem("/imgs/spriteStandLeft.png",'.divImgSpriteStandLeft'),
                cropWidth: 177,
                // para polir a animação e deixar visualmente correto
                width: 66
                
            },
            run: {
                right: criarImagem("/imgs/spriteRunRight.png",'.divImgSpriteRunRight'),
                left: criarImagem("/imgs/spriteRunLeft.png",'.divImgSpriteRunLeft'),
                cropWidth: 341,
                // para polir a animação e deixar visualmente correto
                width: 127.875
            }
        }

        // animação default
        this.currentSprite = this.sprites.stand.right
        // tamanho do frame individual de cada sprite default
        this.currentCropWidth = this.sprites.stand.cropWidth
    }
    // definir como nosso jogador se aparenta quando impreso na tela
    draw() {
        c.drawImage(
            // imagem,
            this.currentSprite,
            // iremos cortar nossa imagem (sprite sheet) para podermos apenas ter acesso a um sprite por vez e não todos os sprites juntos em um só draw
            this.currentCropWidth * this.frames, // começamos a cortar a imagem no x = 0 e acompanhamos cada um dos frames
            0,
            // referencia o comprimento (width) individual de cada frame da animação
            this.currentCropWidth,
            400, // 400 referencia a altura (height) de cada frame
            this.position.x,this.position.y,this.width,this.height)
    }
    //mudar as propriedades com o tempo
    update() {
        this.frames++
        if(this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left) ) // 28 representa o numero total de frames dentro do nosso sprite sheet
        this.frames = 0
        else if(this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left) )
        this.frames = 0
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // colisao com o chao handler
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
        // player está acima do chão e portanto gravidade deve atuar sobre o mesmo
        // para simular a gravidade, aceleramos a velocity do objeto com o passar do tempo
        this.velocity.y += gravity
        // resetamos a velocity do player para 0
        else this.velocity.y = 0

        
    }
}

// Propriedades da plataforma, como posição, cor
class Platform {
    //  objeto passado para posições dinamicas entre multiplas plataformas
    constructor({x,y,image}) {
        this.position = {
            x: x,
            y: y,
        }
        this.image = image
        this.width = image.width
        this.height = 30

 
    }

    draw() {
        c.drawImage(this.image,this.position.x,this.position.y)

        /* FORMATO DE UM SIMPLES RETANGULO ROXO
        c.fillStyle = "purple"
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
        */
    }
}

// Propriedades dos objetos do cenário, com propositos visuais e não interagiveis
class SceneryObjects {
    //  objeto passado para posições dinamicas entre multiplas plataformas
    constructor({x,y,image}) {
        this.position = {
            x: x,
            y: y,
        }
        this.image = image
        this.width = image.width
        this.height = image.height

 
    }

    draw() {
        c.drawImage(this.image,this.position.x,this.position.y)

        /* FORMATO DE UM SIMPLES RETANGULO ROXO
        c.fillStyle = "purple"
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
        */
    }
}


function criarImagem(srcImage,querySelector) {
    const query = document.querySelector(querySelector)
    query.src = srcImage
    return query
}



// nova plataforma
//const platform = new Platform()


// novo jogador
let player = new Player()


// multiplas plataformas, com posições dinamicas
let platforms = []


// multiplas plataformas, com posições dinamicas
let objetosCenarios = []


// teclas do teclado que iremos rastrear para o funcionamento do jogo
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}


//  ponto referencia para condição de vitoria do jogo
let scrollOffset = 0



//  forma de reiniciar o jogo quando o jogador perde
function init() {

    // novo jogador
    player = new Player()


    // multiplas plataformas, com posições dinamicas
    platforms = [
        /*291 referencia tamanho da plataforma curta */
        /*578 referencia tamanho da plataforma longa */
        //plataformas desenhadas primeiro terão um z-index menor que as desenhadas posteriormente
        new Platform({
            x:578 * 5 + 300 -291 ,y:250,
            image: criarImagem("/imgs/platformSmallTall.png",'.divImgColinaCurtaComprida')
        }),
        new Platform({
            x:0,y:450,
            image: criarImagem("/imgs/platform.png",'.divImgPlatforms')
        }),
        new Platform({
            x:578,y:450,
            image: criarImagem("/imgs/platform.png",'.divImgPlatforms')
        }),
        new Platform({
            // +100 funciona para adicionar um espaço entre as plataformas e criar dificuldade ao jogo
            x:578 * 2 + 100,y:450,
            image: criarImagem("/imgs/platform.png",'.divImgPlatforms')
        }),
        new Platform({
            // temos de sempre referenciar o espaço já adicionado pelas outras plataformas para que assim as mesmas se encaixem
            x:578 * 3 + 300,y:450,
            image: criarImagem("/imgs/platform.png",'.divImgPlatforms')
        }),
        new Platform({
            // temos de sempre referenciar o espaço já adicionado pelas outras plataformas para que assim as mesmas se encaixem
            x:578 * 4 + 300,y:450,
            image: criarImagem("/imgs/platform.png",'.divImgPlatforms')
        }),
        new Platform({
            // temos de sempre referenciar o espaço já adicionado pelas outras plataformas para que assim as mesmas se encaixem
            x:578 * 5 + 650,y:450,
            image: criarImagem("/imgs/platform.png",'.divImgPlatforms')
        }),]


    // multiplas plataformas, com posições dinamicas
    objetosCenarios = [new SceneryObjects({
        x:0,y:0,
        image: criarImagem("/imgs/background.png",'.divImgBackground')
    }),
    new SceneryObjects({
        x:0,y:0,
        image: criarImagem("/imgs/hills.png",'.divImgColinas')
    }),
    ]

    //  ponto referencia para condição de vitoria do jogo

    scrollOffset = 0

}




//  inicializar o jogo com as variaveis definidas
init()

// Looping infinito para mudar as propriedades do jogador com o tempo
function animate() {
    requestAnimationFrame(animate)
    // limpar nosso canvas antes de anima-lo para preservar seu formato ( width, height )
    c.fillStyle = "white"
    c.fillRect(0,0,canvas.width,canvas.height)
    

    //looping para desenhar multiplos objetos do cenário
    objetosCenarios.forEach(objetoCenario => {
        objetoCenario.draw()
    }) 



    //looping para desenhar multiplas plataformas
    platforms.forEach(plataforma => {
        plataforma.draw()
    }) 
    player.update()  

    console.log("teste scrollOffset -> " + scrollOffset)
    // handler para quando as teclas direita ou esquerda serem pressionadas
    // delimitar o espaço aonde o jogador se move também notificando quando as plataformas podem se mexer dando a ilusão de movimento do personagem dentro do canvas
    if(keys.right.pressed && player.position.x < 500)  
        player.velocity.x = player.speed
    else if (keys.left.pressed && player.position.x > 400 
        //  condição que proibe o utilizador de continuar se mexendo para esquerda caso o mesmo tente ir para valores negativos de x, saindo do canvas
        || keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
        player.velocity.x = -player.speed
    else {
            player.velocity.x = 0
            if(keys.right.pressed) {
                // armazenamento de espaço caminhado para a condição de vitoria
                scrollOffset += player.speed


                platforms.forEach(plataforma => {
                    plataforma.position.x -= player.speed
                }) 
                objetosCenarios.forEach(objetoCenario => {
                    objetoCenario.position.x -= player.speed * .55 // 55% da velocidade do jogador
                }) 
                
            } else if ( keys.left.pressed && scrollOffset > 0) {
                // armazenamento de espaço caminhado para a condição de vitoria
                scrollOffset -= player.speed


                platforms.forEach(plataforma => {
                    plataforma.position.x += player.speed
                }) 
                objetosCenarios.forEach(objetoCenario => {
                    objetoCenario.position.x += player.speed * .55 // 55% da velocidade do jogador
                }) 
                
            }
        }


    // detectar as colisões do jogador com as plataformas
    // player.y + player.height = parte de baixo do nosso jogador
    platforms.forEach(plataforma => {
    if(player.position.y + player.height <= plataforma.position.y
      // rastrear a parte de cima da plataforma
        && player.position.y + player.height + player.velocity.y >= plataforma.position.y 
      // rastrear se o jogador chegou ao fim da plataforma na extensão de X
        && player.position.x + player.width >= plataforma.position.x
      // rastrear parte da direita da plataforma
        && player.position.x <= plataforma.position.x + plataforma.width 
      )
    player.velocity.y = 0
    })


    // FUNÇÃO PARA TRANSIÇÃO DE SPRITES
    // condição que nos assegura que apertamos x tecla prevendo qualquer tipo de interpolação nas animações utilizando a logica do keyup,keydown ( um jogador pode apertar o botao da esquerda sem soltar o da direita quebrando a animação )
    if( keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right){
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth 
        player.width = player.sprites.run.width     

    } else if ( keys.left.pressed &&lastKey === 'left' && player.currentSprite !== player.sprites.run.left){
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth 
        player.width = player.sprites.run.width   
    }


    // CONDIÇÃO DE VITORIA!
    if(scrollOffset > 578 * 5 + 650){
        console.log("VENCEU PARABENS")
    }


    // CONDIÇÃO DE DERROTA!
    if(player.position.y + player.height > canvas.height){
        console.log("PERDEU, PARABENS, TENTE DENOVO")
        init()
    }
}
animate()


//tratar das animações com base na tecla pressionada dentro do canvas
addEventListener('keydown',({keyCode}) => {



    switch (keyCode) {
        case 65:
            console.log("left")
            keys.left.pressed = true
            lastKey = 'left'
            break
        case 83:
            console.log("down")
            break
        case 68:
            console.log("right")
            keys.right.pressed = true    
            lastKey = 'right'
            break    
        case 87:
            console.log("up")
            // Personagem ação "pular"
            player.velocity.y += -15
            break    
        }
        
})

// como forma de evitar o incremento de velocity infinito, precisamos de um handler para quando a tecla deixa de ser pressionada "KeyUp"
addEventListener('keyup',({keyCode}) => {



    switch (keyCode) {
        case 65:
            console.log("left")
            keys.left.pressed = false
            player.currentSprite = player.sprites.stand.left
            player.currentCropWidth = player.sprites.stand.cropWidth 
            player.width = player.sprites.stand.width  
            break
        case 83:
            console.log("down")
            break
        case 68:
            console.log("right")
            keys.right.pressed = false
            player.currentSprite = player.sprites.stand.right
            player.currentCropWidth = player.sprites.stand.cropWidth 
            player.width = player.sprites.stand.width  
            break    
        case 87:
            console.log("up")
         
            break    
        }
        
})