const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const music = document.getElementById('bg-music');
const countdownEl = document.getElementById('countdown');
const textEl = document.getElementById('text-sequence');
const heartEl = document.getElementById('heart');
const starsBg = document.getElementById('stars-bg');
const cardContainer = document.getElementById('card-container');
const gallery = document.getElementById('heart-gallery');
const book = document.getElementById('book');

// Матрица
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let fontSize = 18;
let drops = Array(Math.floor(canvas.width / fontSize)).fill(1);

// Текст для матрицы
const matrixText = "HAPPYBIRTHDAY";

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff00ff";
    ctx.font = fontSize + "px monospace";
    
    drops.forEach((y, i) => {
        const char = matrixText[Math.floor(Math.random() * matrixText.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    });
}

// Старт
startBtn.addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    music.play().catch(() => {});
    canvas.style.opacity = "1";
    let matrixInterval = setInterval(drawMatrix, 50);

    let count = 3;
    countdownEl.style.display = 'block';
    countdownEl.innerText = count;
    
    let timer = setInterval(() => {
        count--;
        if (count > 0) countdownEl.innerText = count;
        else if (count === 0) countdownEl.innerText = "GO!";
        else {
            clearInterval(timer);
            countdownEl.style.display = 'none';
            runWords(matrixInterval);
        }
    }, 1000);
});

function runWords(mInt) {
    const words = ["HAPPY", "BIRTHDAY", "TO", "ANGELINA"];
    textEl.style.display = 'block';
    let i = 0;
    textEl.innerText = words[i++];
    let wt = setInterval(() => {
        if (i < words.length) textEl.innerText = words[i++];
        else {
            clearInterval(wt);
            textEl.style.display = 'none';
            showBigHeart(mInt);
        }
    }, 1200);
}

function showBigHeart(mInt) {
    heartEl.style.display = 'block';
    canvas.style.zIndex = -1;
    setTimeout(() => {
        canvas.style.opacity = "0";
        starsBg.style.opacity = "1";
        setTimeout(() => {
            clearInterval(mInt);
            heartEl.style.display = 'none';
            showBook();
        }, 2000);
    }, 2000);
}

// ЛОГИКА ОТКРЫТКИ
let currentStep = 0;
const otkPhotos = [
    "cover.jpg",    
    "otk/1.jpg",    
    "otk/2.jpg",    
    "otk/3.jpg",    
    "otk/4.jpg",    
    "otk/5.jpg",    
    "otk/6.jpg"     
];

const wishes = [
    "Happy Birthday Angelinka 🫶🏻",
    "I wish you all the very best!",
    "Wishing you health, happiness, and unforgettable moments",
    "And may all your dreams come true 💓",
    "With best wishes, Zhuchok 🪲🫂"
];

const wishBox = document.getElementById('wish-box');
const wishText = document.getElementById('wish-text');

function showBook() {
    cardContainer.style.display = 'flex';
    
    // Показываем обложку и первый текст сразу
    wishBox.style.display = 'block';
    wishBox.style.opacity = '1';
    wishText.innerText = wishes[0];

    cardContainer.innerHTML = `
        <div class="book-layout" id="book-box" style="transition: all 1.5s ease-in-out;">
            <div class="base-side" id="l-bg"></div>
            <div class="base-side" id="r-bg">
                <img src="${otkPhotos[0]}" id="next-r-img">
            </div>
        </div>
    `;

    const bookBox = document.getElementById('book-box');
    const rSide = document.getElementById('r-bg');
    const lSide = document.getElementById('l-bg');
    const nextRImg = document.getElementById('next-r-img');

    rSide.addEventListener('click', () => {
        if (currentStep > 3) return;

        // Смена текста пожелания
        if (currentStep < 3) {
            wishBox.style.opacity = '0';
            setTimeout(() => {
                wishText.innerText = wishes[currentStep ] || "";
                wishBox.style.opacity = '1';
            }, 500);
        } else {
            // Прячем текст перед тем как открытка улетит
            wishBox.style.opacity = '0';
        }

        const leaf = document.createElement('div');
        leaf.className = 'flipping-leaf';
        
        let frontImg, backImg, nextImg;

        if (currentStep === 0) {
            frontImg = otkPhotos[0]; 
            backImg = otkPhotos[1];  
            nextImg = otkPhotos[2];  
            setTimeout(()=>{
                leaf.querySelector('.leaf-front').innerHTML = `<img src="${otkPhotos[1]}">`;
            },600);
        } else if (currentStep === 1) {
            frontImg = otkPhotos[2];
            backImg = otkPhotos[3];
            nextImg = otkPhotos[4];
            setTimeout(()=>{
                leaf.querySelector('.leaf-front').innerHTML = `<img src="${otkPhotos[3]}">`;
            },600);
        } else if (currentStep === 2) {
            frontImg = otkPhotos[4];
            backImg = otkPhotos[5];
            nextImg = otkPhotos[6];
            setTimeout(()=>{
                leaf.querySelector('.leaf-front').innerHTML = `<img src="${otkPhotos[5]}">`;
            },600);
        } else if (currentStep === 3) {
            frontImg = otkPhotos[6]; 
            backImg = ""; 
            nextImg = null;
        }

        leaf.innerHTML = `
            <div class="leaf-side leaf-front">${frontImg ? `<img src="${frontImg}">` : ''}</div>
            <div class="leaf-side leaf-back" style="background: #330033;">${backImg ? `<img src="${backImg}">` : ''}</div>
        `;

        bookBox.appendChild(leaf);

        setTimeout(() => {
            leaf.classList.add('flipped');
            
            setTimeout(() => {
                if (nextImg) {
                    nextRImg.src = nextImg;
                } else if (currentStep === 3) {
                    nextRImg.style.visibility = 'hidden';
                }
                
                if (currentStep === 0) { 
                    lSide.style.background = "#fffafa";
                    lSide.style.border = "1px solid #ddd";
                }

                if (currentStep === 3) {
                    setTimeout(() => {
                        bookBox.style.transform = "translateX(-150vw) rotateY(-20deg) rotateZ(-5deg)";
                        bookBox.style.opacity = "0";
                        
                        setTimeout(() => {
                            cardContainer.style.display = "none";
                            wishBox.style.display = "none";
                            createHeartGallery();
                        }, 1500);
                    }, 600);
                }
            }, 600); 
        }, 10);

        currentStep++;
    });
}

function createHeartGallery() {
    const total = 15;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 1; i <= total; i++) {
        const img = document.createElement('img');
        img.src = `photoes/${i}.jpg`;
        img.className = 'photo-item';
        img.style.left = `${centerX - 60}px`;
        img.style.top = `${centerY - 75}px`;
        gallery.appendChild(img);

        let t = (i / total) * Math.PI * 2;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        setTimeout(() => {
            img.style.opacity = "1";
            img.style.left = `${x * 18 + centerX - 60}px`;
            img.style.top = `${y * 18 + centerY - 75}px`;
            img.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            
            // Если это последняя фотография, выводим финальное поздравление
            if (i === total) {
                setTimeout(() => {
                    wishBox.style.display = 'block';
                    wishText.innerText = wishes[4];
                    wishBox.style.opacity = '1';
                }, 1000);
            }
        }, i * 150);
    }
}

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};