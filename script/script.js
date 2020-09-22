document.body.onload = start_game;
const dino = document.querySelector('.dino');
const background = document.querySelector('.background');
//const displayCrono = document.querySelector('#displayCrono');

let isJumping = false;
let isGameOver = false;
let position = 0;
let FPS;
let crono;
let displayCrono = $("#displayCrono");

function start_game(){    
    FPS = 100;
    //Se inicializa o cronometro
    crono = new Cronometro(73,90);
    crono.seg = "0" + crono.seg;
    crono.min = "0" + crono.min;
    
    crono.iniciar();   
    intervalo = setInterval(function(){crono.iniciar();}, 1000/FPS);
}

//CLASE CRONOMETRO
class Cronometro{
    
    constructor(x,y){
        this.x = x;
        this.y = y;
        
        this.min = 0;
        this.seg = 0;
        this.cSeg = 0;
        
        //Los numeros del cronometro
        this.numeros = "";
    }
    
    iniciar(){
        
        //Las centesimas de segundo tendrian un 0 delante si son inferiores a 10
        if(this.cSeg < 10){this.cSeg = "0" + this.cSeg;}

        this.numeros = this.min + ":" + this.seg + ":" + this.cSeg;
        
        displayCrono.text(this.numeros);
        //ctx.fillText();
        //-----------------------------------------------
        
        this.cSeg++;
        
        //Si los milisegundos llegan a 1000, se aumenta a 1 SEG y los mSeg vuelven a 0
        if(this.cSeg >= 99){
            this.seg++;
            this.cSeg = 0;
            
            //Si los segundos son inferiores a 10, tendran un 0 delante
            if(this.seg < 10){this.seg = "0" + this.seg;}
            
            //Y si llega a 60 seg, avanzamos 1 min y lo demas volveria a 0
            if(this.seg >= 60){
                this.min++;
                this.seg = 0;
                this.cSeg = 0;
                
                //Si los minutos son inferiores a 10, tendran un 0 delante
                if(this.min < 10){this.min = "0" + this.min;}
            }
        }
        
    }
}

function handleKeyUp(event) {
  if (event.keyCode === 32) {
    if (!isJumping) {
      jump();
    }
  }
}

function jump() {
  isJumping = true;
  let upInterval = setInterval(() => {
    if (position >= 150) {
      // Descendo
      clearInterval(upInterval);

      let downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          position -= 20;
          dino.style.bottom = position + 'px';
        }
      }, 20);
    } else {
      // Subindo
      position += 20;
      dino.style.bottom = position + 'px';
    }
  }, 20);
}

function createCactus() {
  const cactus = document.createElement('div');
  let cactusPosition = 1000;
  let randomTime = Math.random() * 6000;

  if (isGameOver) return;

  cactus.classList.add('cactus');
  background.appendChild(cactus);
  cactus.style.left = cactusPosition + 'px';

  let leftTimer = setInterval(() => {
    if (cactusPosition < -60) {
      // Saiu da tela
      clearInterval(leftTimer);
      background.removeChild(cactus);
    } else if (cactusPosition > 0 && cactusPosition < 60 && position < 60) {
      // Game over
      clearInterval(leftTimer);
      isGameOver = true;
      clearInterval(intervalo);
      document.body.innerHTML = '<h1 class="game-over">Fim de jogo</h1><br><div id="displayCrono" class="game-over">Hint - '+crono.min+":"+crono.seg+":"+crono.cSeg+'</div><br><div class="game-over"><input class="game-over" type="button" value="Jogar novamente" onClick="window.location.reload()"></div>';
    } else {
      cactusPosition -= 10;
      cactus.style.left = cactusPosition + 'px';
    }
  }, 20);

  setTimeout(createCactus, randomTime);
}

createCactus();

document.addEventListener('keyup', handleKeyUp);