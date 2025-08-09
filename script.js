const operationText = document.querySelector('#operationText');
const resultText = document.querySelector('#resultText');
const digitButtons = document.querySelectorAll('#num');
const operatorButtons = document.querySelectorAll('#operator');
const equalButton = document.querySelector('#equal');
const clearButton = document.querySelector('#clear');
const calculator = document.querySelector('.calculator');
const blackHoleSound = document.querySelector('#blackHoleSound');

updateResultText(0);
updateOperationText(0);

const MAX_LENGTH = 20;
let currentInput = '';
let previousInput = '';
let currentOperator = null;
let expression = '';
let equalButtonClicked = false;

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "ERROR: Black Hole Detected";
    }
    return a / b;
}

function operate(a, operator, b) {
    a = Number(a);
    b = Number(b);
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            const result = divide(a, b);
            if (result === "ERROR: Black Hole Detected") {
                startBlackHoleAnimation();
            }
            return result;
        default:
            return "Invalid operator";
    }
}

function updateResultText(value) {
    resultText.textContent = value;
    if (value !== "ERROR: Black Hole Detected") {
        resultText.classList.remove('error-message');
    } else {
        resultText.classList.add('error-message');
    }
}

function updateOperationText(value) {
    operationText.textContent = value;
}

function digitClickHandler(digit) {
    if (equalButtonClicked) {
        currentInput = '';
        expression = '';
        equalButtonClicked = false;
    }
    if (currentInput.length <= MAX_LENGTH) {
        currentInput += digit;
        expression += digit;
        updateOperationText(expression);
    }
}

function operatorClickHandler(operator) {
    expression += operator;
    if (currentOperator === null) {
        previousInput = currentInput;
    } else {
        previousInput = operate(previousInput, currentOperator, currentInput);
        if (typeof previousInput === 'string') {
            updateResultText(previousInput);
            return;
        }
        updateResultText(previousInput);
    }
    currentInput = '';
    currentOperator = operator;
    updateOperationText(expression);
}

function equalClickHandler() {
    if (currentOperator === null) {
        previousInput = currentInput;
    } else {
        previousInput = operate(previousInput, currentOperator, currentInput);
        if (typeof previousInput === 'string') {
            updateResultText(previousInput);
            return;
        }
        updateResultText(previousInput);
    }
    currentInput = '';
    expression = previousInput;
    currentOperator = null;
    updateOperationText(currentInput);
    equalButtonClicked = true;
}

digitButtons.forEach(button => {
    button.addEventListener('click', () => {
        digitClickHandler(button.textContent);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        operatorClickHandler(button.textContent);
    });
});

equalButton.addEventListener('click', () => {
    equalClickHandler();
});

clearButton.addEventListener('click', () => {
    currentInput = '';
    previousInput = '';
    currentOperator = null;
    expression = '';
    updateResultText(0);
    updateOperationText(0);
    resultText.classList.remove('error-message');
    if (calculator.classList.contains('disappear')) {
        calculator.classList.remove('disappear');
        blackHoleGrowing = false;
        blackHoleRadius = 50;
        initStars();
        drawStarsBg();
        requestAnimationFrame(loop);
    }
});

function startBlackHoleAnimation() {
    console.log("Black hole effect triggered!");
    calculator.classList.add('disappear');
    
    blackHoleSound.play();
    blackHoleGrowing = true;

    setTimeout(() => {
        currentInput = '';
        previousInput = '';
        currentOperator = null;
        expression = '';
        updateResultText(0);
        updateOperationText(0);
        calculator.classList.remove('disappear');
        blackHoleGrowing = false;
        blackHoleRadius = 50;
        initStars();
        drawStarsBg();
        requestAnimationFrame(loop);
    }, 4500);
}

/* ---------------------------
    Black Hole Animation Code
    --------------------------- */
const bg = document.getElementById('bg');
const fg = document.getElementById('fg');
const bgCtx = bg.getContext('2d');
const fgCtx = fg.getContext('2d');

function resize() {
    bg.width = fg.width = innerWidth;
    bg.height = fg.height = innerHeight;
    center.x = bg.width / 2;
    center.y = bg.height / 2;
}
window.addEventListener('resize', resize);

const center = {
    x: innerWidth / 2,
    y: innerHeight / 2
};
let blackHoleRadius = 50;
let blackHoleGrowing = false;
const NUM_STARS = 300;

let stars = [];
function initStars() {
    stars = [];
    for (let i = 0; i < NUM_STARS; i++) {
        const x = Math.random() * innerWidth;
        const y = Math.random() * innerHeight;
        const dx = x - center.x;
        const dy = y - center.y;
        const dist = Math.hypot(dx, dy);
        stars.push({
            x,
            y,
            angle: Math.atan2(dy, dx),
            dist,
            size: 0.6 + Math.random() * 1.6,
            tw: Math.random() * Math.PI * 2,
            baseSpeed: 0.01 + Math.random() * 0.06
        });
    }
}

function drawStarsBg() {
    bgCtx.fillStyle = '#000';
    bgCtx.fillRect(0, 0, bg.width, bg.height);

    for (let s of stars) {
        const a = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s.tw));
        bgCtx.fillStyle = `rgba(255,255,255,${a})`;
        bgCtx.beginPath();
        bgCtx.arc(center.x + s.dist * Math.cos(s.angle), center.y + s.dist * Math.sin(s.angle), s.size, 0, Math.PI * 2);
        bgCtx.fill();
    }
}

function updateStars(delta) {
    for (let s of stars) {
        s.tw += 0.04 * delta;

        if (blackHoleGrowing) {
            const gravityFactor = Math.max(0.02, 200 / (s.dist + 1));
            s.angle += s.baseSpeed * gravityFactor * 0.8 * delta;
            s.dist -= 0.25 * gravityFactor * delta;
        } else {
            s.angle += s.baseSpeed * 0.02 * delta;
        }
    }
    stars = stars.filter(s => s.dist > blackHoleRadius + 0.5);
}

function drawAccretionDisk() {
    const inner = blackHoleRadius + 12;
    const outer = blackHoleRadius + 46;

    for (let i = 0; i < 4; i++) {
        const t = i / 3;
        const r = inner + (outer - inner) * t;
        const width = 18 - i * 3;

        const g = fgCtx.createLinearGradient(center.x - r, center.y, center.x + r, center.y);
        g.addColorStop(0, `rgba(${Math.floor(20*(1-t))},${Math.floor(180*(1-t)+50*t)},255,${0.9 - 0.12*i})`);
        g.addColorStop(0.5, `rgba(255,${220 - i*20},${180 - i*12},${0.95 - 0.12*i})`);
        g.addColorStop(1, `rgba(255,${120 + i*20},${20 + i*10},${0.9 - 0.12*i})`);

        fgCtx.lineWidth = width;
        fgCtx.strokeStyle = g;
        fgCtx.beginPath();
        const rx = r;
        const ry = r * 0.28;
        fgCtx.ellipse(center.x, center.y, rx, ry, accretionAngle, 0, Math.PI * 2);
        fgCtx.stroke();
    }
}

function applyLensing() {
    const lensMax = Math.min(Math.max(150, blackHoleRadius * 3), Math.max(bg.width, bg.height));
    const rings = 12;
    for (let i = 0; i < rings; i++) {
        const t0 = i / rings;
        const t1 = (i + 1) / rings;
        const r0 = blackHoleRadius + 1 + t0 * (lensMax - (blackHoleRadius + 1));
        const r1 = blackHoleRadius + 1 + t1 * (lensMax - (blackHoleRadius + 1));

        fgCtx.save();
        fgCtx.beginPath();
        fgCtx.arc(center.x, center.y, r1, 0, Math.PI * 2);
        fgCtx.arc(center.x, center.y, r0, 0, Math.PI * 2, true);
        fgCtx.clip();

        const normalized = 1 - (r0 - (blackHoleRadius + 1)) / (lensMax - (blackHoleRadius + 1));
        const scale = 1 + 0.25 * Math.pow(normalized, 1.8);
        fgCtx.translate(center.x, center.y);
        fgCtx.scale(scale, scale);
        fgCtx.translate(-center.x, -center.y);
        fgCtx.drawImage(bg, 0, 0);
        fgCtx.restore();
    }
}

function drawEventHorizon() {
    fgCtx.save();
    fgCtx.globalCompositeOperation = 'source-over';
    fgCtx.fillStyle = '#000000';
    fgCtx.beginPath();
    fgCtx.arc(center.x, center.y, blackHoleRadius, 0, Math.PI * 2);
    fgCtx.fill();
    fgCtx.restore();
}

let last = performance.now();
let accretionAngle = 0;
function loop(now) {
    const delta = (now - last) / 16.67;
    last = now;

    updateStars(delta);
    drawStarsBg();

    fgCtx.clearRect(0, 0, fg.width, fg.height);

    accretionAngle += 0.006 * delta;
    drawAccretionDisk();

    applyLensing();

    drawEventHorizon();

    if (blackHoleGrowing) {
        const maxRadius = Math.hypot(bg.width, bg.height) * 0.6;
        const growthRate = (maxRadius - 50) / (4500 / 16.67);
        blackHoleRadius += growthRate * delta;

        if (blackHoleRadius > maxRadius) {
            bgCtx.fillStyle = '#000';
            bgCtx.fillRect(0, 0, bg.width, bg.height);
            fgCtx.fillStyle = '#000';
            fgCtx.fillRect(0, 0, fg.width, fg.height);
            return;
        }
    }

    requestAnimationFrame(loop);
}

resize();
initStars();
drawStarsBg();
requestAnimationFrame(loop);