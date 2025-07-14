// 全局变量
let currentScreen = 'mainMenu';
let game = null;

// 屏幕管理函数
function showScreen(screenId) {
    // 隐藏所有屏幕
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // 显示目标屏幕
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // 如果进入游戏界面，初始化游戏
    if (screenId === 'gameScreen') {
        if (!game) {
            game = new IdiomSnakeGame();
        }
        game.startGame();
    }
    
    // 如果进入解锁成语界面，初始化成语库
    if (screenId === 'idiomsLibraryScreen') {
        initializeIdiomsLibrary();
    }
}

function showOverlay(overlayId) {
    document.getElementById(overlayId).classList.add('active');
}

function hideOverlay(overlayId) {
    document.getElementById(overlayId).classList.remove('active');
}

function showTab(tabId) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示目标标签
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

// 游戏控制函数
function resumeGame() {
    if (game) {
        game.togglePause();
        hideOverlay('pauseMenu');
    }
}

function restartGame() {
    if (game) {
        game.resetGame();
        hideOverlay('pauseMenu');
    }
}

function exitToMenu() {
    if (game) {
        game.gameRunning = false;
        game.gamePaused = false;
    }
    hideOverlay('pauseMenu');
    showScreen('mainMenu');
    updateMenuStats();
}

class IdiomSnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        
        // 游戏设置
        this.settings = {
            difficulty: localStorage.getItem('gameDifficulty') || 'medium',
            gameSize: localStorage.getItem('gameSize') || 'medium',
            soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
            vibrationEnabled: localStorage.getItem('vibrationEnabled') !== 'false',
            theme: localStorage.getItem('gameTheme') || 'classic'
        };
        
        this.updateCanvasSize();
        
        // 蛇的基本属性 - 初始化为4个身体段对应4条生命
        const centerX = Math.floor(this.tileCount/2);
        const centerY = Math.floor(this.tileCount/2);
        this.snake = [
            {x: centerX, y: centerY},
            {x: centerX - 1, y: centerY},
            {x: centerX - 2, y: centerY},
            {x: centerX - 3, y: centerY}
        ];
        this.dx = 0;
        this.dy = 0;
        
        // 成语学习相关
        this.currentPuzzle = null;
        this.completedIdioms = [];
        this.learnedIdioms = []; // 本次游戏学到的成语（包含成语和含义）
        this.usedIdioms = new Set(); // 记录已使用的成语，避免重复
        this.characterFruits = []; // 字符果实
        this.particles = [];
        
        // 游戏状态
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('idiomSnakeHighScore')) || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameSpeed = 200; // 稍慢一些，便于思考
        
        // 难度设置
        this.difficultyLevel = 'easy';
        this.distractorCount = 2; // 干扰项数量
        this.lives = 4; // 生命值，对应蛇身长度
        this.maxLives = 4; // 最大生命值
        
        this.applyTheme();
        this.initializeGame();
        this.setupEventListeners();
        this.setupTouchControls();
        this.createAudioContext();
    }
    
    loadSettings() {
        // 加载设置到界面
        document.getElementById('difficulty').value = this.settings.difficulty;
        document.getElementById('gameSize').value = this.settings.gameSize;
        document.getElementById('soundToggle').checked = this.settings.soundEnabled;
        document.getElementById('vibrationToggle').checked = this.settings.vibrationEnabled;
        document.getElementById('gameTheme').value = this.settings.theme;
        
        this.applyTheme();
    }
    
    updateCanvasSize() {
        const sizes = {
            small: 300,
            medium: 400,
            large: 500
        };
        
        const size = sizes[this.settings.gameSize];
        this.canvas.width = size;
        this.canvas.height = size;
        this.tileCount = size / this.gridSize;
    }
    
    applyTheme() {
        const themes = {
            classic: {
                background: '#2c3e50',
                snake: '#27ae60',
                snakeHead: '#2ecc71'
            },
            neon: {
                background: '#0a0a0a',
                snake: '#00ff41',
                snakeHead: '#00ff88'
            },
            retro: {
                background: '#1a1a1a',
                snake: '#ffff00',
                snakeHead: '#ffff88'
            },
            nature: {
                background: '#2d5016',
                snake: '#8bc34a',
                snakeHead: '#aed581'
            }
        };
        
        this.currentTheme = themes[this.settings.theme];
    }
    
    initializeGame() {
        this.generateNewPuzzle();
        this.drawGame();
    }
    
    // 生成新的成语谜题
    generateNewPuzzle() {
        let idiom;
        let attempts = 0;
        do {
            idiom = getRandomIdiom(this.difficultyLevel);
            attempts++;
            // 如果尝试次数过多，清空已使用成语列表
            if (attempts > 50) {
                this.usedIdioms.clear();
                attempts = 0;
            }
        } while (idiom && this.usedIdioms.has(idiom.idiom) && attempts < 100);
        
        // 确保idiom不为空
        if (!idiom) {
            idiom = { idiom: '万事如意', pinyin: 'wàn shì rú yì', meaning: '一切事情都符合心意，很顺利', difficulty: 'easy' };
        }
        
        this.usedIdioms.add(idiom.idiom);
        this.currentPuzzle = createIdiomPuzzle(idiom);
        this.updateIdiomDisplay();
        this.generateCharacterFruits();
    }
    
    // 更新成语显示界面
    updateIdiomDisplay() {
        const idiomChars = document.getElementById('idiomChars');
        const idiomHint = document.getElementById('idiomHint');
        
        idiomChars.innerHTML = '';
        this.currentPuzzle.displayChars.forEach((char, index) => {
            const charBox = document.createElement('span');
            charBox.className = 'char-box';
            if (char === null) {
                charBox.className += ' missing';
                charBox.textContent = '?';
            } else {
                charBox.textContent = char;
            }
            idiomChars.appendChild(charBox);
        });
        
        idiomHint.textContent = this.currentPuzzle.original.meaning;
    }
    
    // 生成字符果实（正确答案 + 干扰项）
    generateCharacterFruits() {
        this.characterFruits = [];
        
        // 添加正确答案
        const correctChar = this.currentPuzzle.missingChar;
        this.addCharacterFruit(correctChar, true);
        
        // 添加干扰项
        const distractors = getDistractionChars(correctChar, this.distractorCount);
        distractors.forEach(char => {
            this.addCharacterFruit(char, false);
        });
    }
    
    // 添加字符果实到随机位置
    addCharacterFruit(character, isCorrect) {
        let position;
        let attempts = 0;
        
        // 找到一个不与蛇身重叠的位置
        do {
            position = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            attempts++;
        } while (this.isPositionOccupied(position) && attempts < 50);
        
        this.characterFruits.push({
            x: position.x,
            y: position.y,
            character: character,
            isCorrect: isCorrect,
            color: isCorrect ? '#28a745' : '#dc3545',
            glowColor: isCorrect ? '#90ee90' : '#ffb3b3'
        });
    }
    
    // 检查位置是否被占用
    isPositionOccupied(position) {
        // 检查是否与蛇身重叠
        for (let segment of this.snake) {
            if (segment.x === position.x && segment.y === position.y) {
                return true;
            }
        }
        
        // 检查是否与其他果实重叠
        for (let fruit of this.characterFruits) {
            if (fruit.x === position.x && fruit.y === position.y) {
                return true;
            }
        }
        
        return false;
    }
    
    // 完成当前成语
    completeCurrentIdiom() {
        this.currentPuzzle.completed = true;
        this.completedIdioms.push(this.currentPuzzle.original);
        
        // 记录学到的成语（用于游戏结束时显示）
        this.learnedIdioms.push({
            idiom: this.currentPuzzle.original.idiom,
            pinyin: this.currentPuzzle.original.pinyin,
            meaning: this.currentPuzzle.original.meaning,
            difficulty: this.currentPuzzle.original.difficulty
        });
        
        // 解锁成语到成语库
        unlockIdiom(this.currentPuzzle.original);
        
        this.score += 100; // 完成成语获得100分
        
        // 更新界面显示
        this.updateCompletedList();
        this.updateIdiomDisplayCompleted();
        
        // 播放成功音效
        if (this.settings.soundEnabled) {
            this.playSound(523, 0.3, 'sine'); // C5音符
        }
        
        // 震动反馈
        if (this.settings.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        // 延迟生成新谜题
        setTimeout(() => {
            this.generateNewPuzzle();
        }, 1500);
    }
    
    // 更新成语显示为完成状态
    updateIdiomDisplayCompleted() {
        const charBoxes = document.querySelectorAll('.char-box');
        charBoxes[this.currentPuzzle.missingIndex].textContent = this.currentPuzzle.missingChar;
        charBoxes[this.currentPuzzle.missingIndex].className = 'char-box completed';
    }
    
    // 更新已完成成语列表
    updateCompletedList() {
        const completedList = document.getElementById('completedList');
        
        const item = document.createElement('div');
        item.className = 'completed-item';
        
        const idiom = this.completedIdioms[this.completedIdioms.length - 1];
        item.innerHTML = `
            <div class="completed-idiom">${idiom.idiom}</div>
            <div class="completed-pinyin">${idiom.pinyin}</div>
            <div class="completed-meaning">${idiom.meaning}</div>
        `;
        
        completedList.insertBefore(item, completedList.firstChild);
    }
    
    setupEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (currentScreen !== 'gameScreen' || !this.gameRunning || this.gamePaused) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    break;
                case 'Escape':
                    this.togglePause();
                    break;
            }
        });
        
        // 暂停按钮
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        // 移动端控制按钮
        document.getElementById('upBtn').addEventListener('click', () => {
            if (this.dy !== 1) {
                this.dx = 0;
                this.dy = -1;
            }
        });
        
        document.getElementById('downBtn').addEventListener('click', () => {
            if (this.dy !== -1) {
                this.dx = 0;
                this.dy = 1;
            }
        });
        
        document.getElementById('leftBtn').addEventListener('click', () => {
            if (this.dx !== 1) {
                this.dx = -1;
                this.dy = 0;
            }
        });
        
        document.getElementById('rightBtn').addEventListener('click', () => {
            if (this.dx !== -1) {
                this.dx = 1;
                this.dy = 0;
            }
        });
        
        // 设置变更监听
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.settings.difficulty = e.target.value;
            localStorage.setItem('gameDifficulty', this.settings.difficulty);
            this.updateGameSpeed();
        });
        
        document.getElementById('gameSize').addEventListener('change', (e) => {
            this.settings.gameSize = e.target.value;
            localStorage.setItem('gameSize', this.settings.gameSize);
            this.updateCanvasSize();
            this.resetGame();
        });
        
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            localStorage.setItem('soundEnabled', this.settings.soundEnabled);
        });
        
        document.getElementById('vibrationToggle').addEventListener('change', (e) => {
            this.settings.vibrationEnabled = e.target.checked;
            localStorage.setItem('vibrationEnabled', this.settings.vibrationEnabled);
        });
        
        document.getElementById('gameTheme').addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            localStorage.setItem('gameTheme', this.settings.theme);
            this.applyTheme();
            this.drawGame();
        });
    }
    
    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!this.gameRunning || this.gamePaused) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // 水平滑动
                if (deltaX > 30 && this.dx !== -1) {
                    this.dx = 1;
                    this.dy = 0;
                } else if (deltaX < -30 && this.dx !== 1) {
                    this.dx = -1;
                    this.dy = 0;
                }
            } else {
                // 垂直滑动
                if (deltaY > 30 && this.dy !== -1) {
                    this.dx = 0;
                    this.dy = 1;
                } else if (deltaY < -30 && this.dy !== 1) {
                    this.dx = 0;
                    this.dy = -1;
                }
            }
        });
    }
    
    createAudioContext() {
        // 创建简单的音效
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('音频不支持');
        }
    }
    
    playSound(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // 移除原有的generateFood方法，已被generateCharacterFruits替代
    
    // 移除原有的generateInitialFoods方法，已被generateNewPuzzle替代
    
    isPositionOccupied(pos) {
        // 检查蛇身
        for (let segment of this.snake) {
            if (segment.x === pos.x && segment.y === pos.y) {
                return true;
            }
        }
        // 检查其他字符果实
        for (let fruit of this.characterFruits) {
            if (fruit.x === pos.x && fruit.y === pos.y) {
                return true;
            }
        }
        return false;
    }
    
    drawGame() {
        this.clearCanvas();
        this.drawGrid();
        this.drawSnake();
        this.drawCharacterFruits();
        this.drawParticles();
        this.drawGameInfo();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }
    
    clearCanvas() {
        this.ctx.fillStyle = this.currentTheme.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            const centerX = x + this.gridSize / 2;
            const centerY = y + this.gridSize / 2;
            
            if (index === 0) {
                // 卡通蛇头
                this.drawCartoonSnakeHead(centerX, centerY);
            } else if (index <= this.lives && this.currentPuzzle) {
                // 蛇身显示成语字符（只显示与生命值对应的段数）
                this.drawIdiomSegment(centerX, centerY, index - 1);
            }
        });
    }
    
    drawCartoonSnakeHead(centerX, centerY) {
        const radius = this.gridSize / 2 - 1;
        
        // 蛇头主体
        this.ctx.fillStyle = this.currentTheme.snakeHead;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 蛇头轮廓
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // 眼睛背景
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 5, centerY - 3, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(centerX + 5, centerY - 3, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 眼珠
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 5, centerY - 3, 2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(centerX + 5, centerY - 3, 2, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 眼睛高光
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 4, centerY - 4, 1, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(centerX + 6, centerY - 4, 1, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 嘴巴
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY + 3, 3, 0, Math.PI);
        this.ctx.stroke();
    }
    
    drawIdiomSegment(centerX, centerY, segmentIndex) {
        // 方形蛇身背景
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.fillRect(centerX - this.gridSize/2 + 2, centerY - this.gridSize/2 + 2, 
                          this.gridSize - 4, this.gridSize - 4);
        
        // 边框
        this.ctx.strokeStyle = '#bdc3c7';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(centerX - this.gridSize/2 + 2, centerY - this.gridSize/2 + 2, 
                           this.gridSize - 4, this.gridSize - 4);
        
        // 显示成语字符
        if (this.currentPuzzle && segmentIndex < this.currentPuzzle.displayChars.length) {
            const char = this.currentPuzzle.displayChars[segmentIndex];
            if (char === null) {
                // 空缺位置显示问号
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('?', centerX, centerY);
            } else {
                // 显示汉字
                this.ctx.fillStyle = '#2c3e50';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(char, centerX, centerY);
            }
        }
    }
    
    drawCharacterFruits() {
        this.characterFruits.forEach(fruit => {
            const centerX = fruit.x * this.gridSize + this.gridSize / 2;
            const centerY = fruit.y * this.gridSize + this.gridSize / 2;
            const radius = this.gridSize / 2 - 2;
            
            // 果实背景
            this.ctx.fillStyle = fruit.color;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // 添加发光效果
            if (fruit.isCorrect) {
                const time = Date.now() * 0.005;
                const glowRadius = radius + Math.sin(time) * 2;
                this.ctx.shadowColor = fruit.glowColor;
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, glowRadius, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
            
            // 绘制字符
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(fruit.character, centerX, centerY);
        });
    }
    
    moveSnake() {
        // 如果没有移动方向，不移动蛇
        if (this.dx === 0 && this.dy === 0) {
            return;
        }
        
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        this.snake.unshift(head);
        
        // 检查是否吃到字符果实
        let fruitEaten = false;
        for (let i = this.characterFruits.length - 1; i >= 0; i--) {
            const fruit = this.characterFruits[i];
            if (head.x === fruit.x && head.y === fruit.y) {
                this.eatCharacterFruit(fruit, i);
                fruitEaten = true;
                break;
            }
        }
        
        if (!fruitEaten) {
            this.snake.pop();
        }
    }
    
    eatCharacterFruit(fruit, index) {
        // 创建粒子效果
        this.createParticles(fruit.x * this.gridSize + this.gridSize / 2, 
                           fruit.y * this.gridSize + this.gridSize / 2, fruit.color);
        
        if (fruit.isCorrect) {
            // 吃到正确字符
            this.score += 50;
            this.completeCurrentIdiom();
            
            // 播放成功音效
            if (this.settings.soundEnabled) {
                this.playSound(800, 0.3, 'sine');
            }
            
            // 震动反馈
            if (this.settings.vibrationEnabled && navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // 清空所有字符果实
            this.characterFruits = [];
        } else {
            // 吃到错误字符
            this.score = Math.max(0, this.score - 20);
            this.lives--;
            
            // 缩短蛇身，确保蛇身长度与生命值保持一致
            while (this.snake.length > this.lives && this.snake.length > 1) {
                this.snake.pop();
            }
            
            // 播放错误音效
            if (this.settings.soundEnabled) {
                this.playSound(200, 0.3, 'sawtooth');
            }
            
            // 震动反馈
            if (this.settings.vibrationEnabled && navigator.vibrate) {
                navigator.vibrate(200);
            }
            
            // 检查生命值是否为0
            if (this.lives <= 0) {
                this.gameOver();
                return;
            }
            
            // 只移除被吃的错误果实
            this.characterFruits.splice(index, 1);
        }
        
        this.updateDisplay();
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                maxLife: 30,
                color: color
            });
        }
    }
    
    drawParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            const alpha = particle.life / particle.maxLife;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawGameInfo() {
        // 分数
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`分数: ${this.score}`, 10, 25);
        
        // 生命值
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillText(`生命: ${this.lives}/${this.maxLives}`, 10, 45);
        
        // 已完成成语数量
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.fillText(`完成: ${this.completedIdioms.length}个`, 10, 65);
        
        // 当前成语进度
        if (this.currentPuzzle) {
            this.ctx.fillStyle = '#3498db';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`当前: ${this.currentPuzzle.display}`, 10, 85);
        }
        
        // 最高分
        this.ctx.fillStyle = '#bdc3c7';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`最高分: ${this.highScore}`, 10, this.canvas.height - 10);
    }
    
    updateGameSpeed() {
        const difficulty = document.getElementById('difficulty').value;
        const speedMultipliers = {
            easy: 1.2,
            medium: 1.0,
            hard: 0.8,
            extreme: 0.6
        };
        
        // 根据完成的成语数量调整游戏速度
        const baseSpeed = 200 * speedMultipliers[difficulty];
        const speedIncrease = this.completedIdioms.length * 15;
        this.gameSpeed = Math.max(baseSpeed - speedIncrease, 80);
    }
    
    checkCollision() {
        const head = this.snake[0];
        
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // 检查自身碰撞
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.moveSnake();
        
        if (this.checkCollision()) {
            this.gameOver();
            return;
        }
        
        this.drawGame();
        
        // 重置连击计数器
        if (Date.now() - this.lastFoodTime > 3000) {
            this.combo = 0;
        }
        
        setTimeout(() => {
            this.gameLoop();
        }, this.gameSpeed);
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        
        // 重置游戏状态 - 确保蛇身长度与生命值一致
        const centerX = Math.floor(this.tileCount/2);
        const centerY = Math.floor(this.tileCount/2);
        this.snake = [
            {x: centerX, y: centerY},
            {x: centerX - 1, y: centerY},
            {x: centerX - 2, y: centerY},
            {x: centerX - 3, y: centerY}
        ];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.particles = [];
        this.completedIdioms = [];
        this.usedIdioms.clear(); // 清空已使用成语记录
        this.lives = this.maxLives; // 重置生命值
        
        // 确保蛇身长度与生命值匹配
        while (this.snake.length > this.lives) {
            this.snake.pop();
        }
        while (this.snake.length < this.lives) {
            const lastSegment = this.snake[this.snake.length - 1];
            this.snake.push({x: lastSegment.x - 1, y: lastSegment.y});
        }
        
        // 清空已完成列表
        document.getElementById('completedList').innerHTML = '';
        
        // 生成新的成语谜题
        this.generateNewPuzzle();
        
        document.getElementById('startBtn').textContent = '游戏中...';
        document.getElementById('startBtn').disabled = true;
        
        this.updateDisplay();
        this.gameLoop();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? '继续' : '暂停';
        
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        const centerX = Math.floor(this.tileCount/2);
        const centerY = Math.floor(this.tileCount/2);
        this.snake = [
            {x: centerX, y: centerY},
            {x: centerX - 1, y: centerY},
            {x: centerX - 2, y: centerY},
            {x: centerX - 3, y: centerY}
        ];
        this.characterFruits = [];
        this.particles = [];
        this.completedIdioms = [];
        this.learnedIdioms = []; // 清空学习成果记录
        this.usedIdioms.clear(); // 清空已使用成语记录
        this.currentPuzzle = null;
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameSpeed = 200;
        this.lives = this.maxLives; // 重置生命值
        
        // 确保蛇身长度与生命值匹配
        while (this.snake.length > this.lives) {
            this.snake.pop();
        }
        while (this.snake.length < this.lives) {
            const lastSegment = this.snake[this.snake.length - 1];
            this.snake.push({x: lastSegment.x - 1, y: lastSegment.y});
        }
        
        // 清空已完成列表
        document.getElementById('completedList').innerHTML = '';
        
        document.getElementById('startBtn').textContent = '开始游戏';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = '暂停';
        
        this.updateDisplay();
        this.drawGame();
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        // 更新最高分
        let isNewRecord = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('idiomSnakeHighScore', this.highScore);
            isNewRecord = true;
        }
        
        // 保存游戏统计
        this.saveGameStats();
        
        this.updateDisplay();
        
        // 播放游戏结束音效和震动
        if (this.settings.soundEnabled) {
            this.playSound(200, 0.5, 'sawtooth');
        }
        
        if (this.settings.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
        
        // 显示游戏结束信息
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 游戏结束标题
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束!', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        // 生命值耗尽提示
        if (this.lives <= 0) {
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.font = '18px Arial';
            this.ctx.fillText('生命值耗尽！', this.canvas.width / 2, this.canvas.height / 2 - 35);
        }
        
        // 得分信息
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        if (isNewRecord && this.score > 0) {
            this.ctx.fillStyle = '#f1c40f';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText('🎉 新纪录! 🎉', this.canvas.width / 2, this.canvas.height / 2 + 10);
        }
        
        this.ctx.fillStyle = '#bdc3c7';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('点击重新开始按钮重新游戏', this.canvas.width / 2, this.canvas.height / 2 + 50);
        
        // 显示统计信息
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`完成成语: ${this.completedIdioms.length}个`, this.canvas.width / 2, this.canvas.height / 2 + 80);
        
        document.getElementById('startBtn').textContent = '开始游戏';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = '暂停';
        
        // 显示游戏结束菜单
        setTimeout(() => {
            this.showLearningResults(isNewRecord);
        }, 500);
    }
    
    showLearningResults(isNewRecord) {
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.style.display = 'flex';
        gameOverScreen.classList.add('active');
        
        // 更新学习积分
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('totalLearnedCount').textContent = this.learnedIdioms.length;
        
        // 生成学到的成语列表
        const learnedIdiomsList = document.getElementById('learnedIdiomsList');
        learnedIdiomsList.innerHTML = '';
        
        if (this.learnedIdioms.length === 0) {
            learnedIdiomsList.innerHTML = '<div class="no-idioms-message">本次游戏没有完成任何成语，继续努力吧！</div>';
        } else {
            this.learnedIdioms.forEach((idiom, index) => {
                const idiomItem = document.createElement('div');
                idiomItem.className = 'learned-idiom-item';
                idiomItem.style.animationDelay = `${index * 0.1}s`;
                
                idiomItem.innerHTML = `
                    <div class="idiom-content">
                        <div class="idiom-text">${idiom.idiom}</div>
                        <div class="idiom-meaning">${idiom.meaning}</div>
                    </div>
                    <div class="idiom-badge">
                        <span class="difficulty-badge ${idiom.difficulty}">${this.getDifficultyText(idiom.difficulty)}</span>
                    </div>
                `;
                
                learnedIdiomsList.appendChild(idiomItem);
            });
        }
        
        // 更新鼓励信息
        const encouragementMessage = document.getElementById('encouragementMessage');
        encouragementMessage.textContent = this.getEncouragementMessage();
    }
    
    getDifficultyText(difficulty) {
        const difficultyMap = {
            'easy': '初级',
            'medium': '中级',
            'hard': '高级'
        };
        return difficultyMap[difficulty] || '未知';
    }
    
    getEncouragementMessage() {
        const count = this.learnedIdioms.length;
        if (count === 0) {
            return '没关系，下次一定能学到更多成语！';
        } else if (count <= 2) {
            return '不错的开始！继续努力学习更多成语吧！';
        } else if (count <= 5) {
            return '很棒！你已经掌握了不少成语知识！';
        } else if (count <= 8) {
            return '太厉害了！你是成语学习的高手！';
        } else {
            return '惊人的成就！你已经是成语大师了！';
        }
    }
    
    saveGameStats() {
        const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
        stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
        stats.totalScore = (stats.totalScore || 0) + this.score;
        stats.maxLength = Math.max(stats.maxLength || 0, this.snake.length);
        stats.lastPlayed = new Date().toISOString();
        
        if (this.score > (stats.bestScore || 0)) {
            stats.bestScore = this.score;
        }
        
        localStorage.setItem('gameStats', JSON.stringify(stats));
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;
        
        // 更新长度显示为已完成成语数量
        const lengthElement = document.getElementById('length');
        if (lengthElement) {
            lengthElement.textContent = this.completedIdioms.length;
        }
        
        // 隐藏连击显示（成语游戏中不需要）
        const comboElement = document.getElementById('combo');
        if (comboElement) {
            comboElement.style.display = 'none';
        }
    }
}

// 菜单统计更新函数（已简化，因为主菜单不再显示统计信息）
function updateMenuStats() {
    // 保留函数以避免其他地方的调用出错
    // 主菜单已移除统计信息显示，此函数现在为空
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    game = new IdiomSnakeGame();
    game.loadSettings();
    game.updateDisplay();
    updateMenuStats();
    
    // 开始游戏按钮事件监听
    document.getElementById('startBtn').addEventListener('click', () => {
        if (game.gameRunning) {
            game.resetGame();
        }
        game.startGame();
    });
    
    // 返回按钮事件监听
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen('mainMenu');
            updateMenuStats();
        });
    });
    
    // 游戏结束菜单按钮
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.classList.remove('active');
        setTimeout(() => {
            gameOverScreen.style.display = 'none';
        }, 300);
        game.resetGame();
        game.startGame();
    });
    
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.classList.remove('active');
        setTimeout(() => {
            gameOverScreen.style.display = 'none';
        }, 300);
        showScreen('mainMenu');
        game.resetGame();
        updateMenuStats();
    });
    
    // 暂停菜单按钮事件已在setupEventListeners中处理
    
    // 设置标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            showTab(tabName);
        });
    });
});

// 更新排行榜
function updateLeaderboard() {
    const stats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    const highScore = parseInt(localStorage.getItem('idiomSnakeHighScore')) || 0;
    
    // 更新个人最佳
    document.getElementById('personalBest').textContent = highScore;
    document.getElementById('personalGames').textContent = stats.gamesPlayed || 0;
    document.getElementById('personalAvg').textContent = stats.gamesPlayed ? 
        Math.round((stats.totalScore || 0) / stats.gamesPlayed) : 0;
    
    // 更新成就
    const achievements = [];
    if (highScore >= 100) achievements.push('🏆 得分达人 - 单局得分超过100');
    if (highScore >= 500) achievements.push('🌟 高分王者 - 单局得分超过500');
    if (stats.gamesPlayed >= 10) achievements.push('🎮 游戏达人 - 游戏次数超过10次');
    if (stats.maxLength >= 20) achievements.push('🐍 长蛇传说 - 蛇身长度超过20');
    if (stats.gamesPlayed >= 50) achievements.push('💪 坚持不懈 - 游戏次数超过50次');
    
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';
    
    if (achievements.length === 0) {
        achievementsList.innerHTML = '<div class="achievement-item">暂无成就，继续努力！</div>';
    } else {
        achievements.forEach(achievement => {
            const div = document.createElement('div');
            div.className = 'achievement-item';
            div.textContent = achievement;
            achievementsList.appendChild(div);
        });
    }
}

// 解锁成语界面相关功能
let unlockedIdioms = JSON.parse(localStorage.getItem('unlockedIdioms') || '[]');
let currentDifficultyFilter = 'all';

// 获取难度等级的中文显示
function getDifficultyText(difficulty) {
    const difficultyMap = {
        'easy': '初级',
        'medium': '中级',
        'hard': '高级'
    };
    return difficultyMap[difficulty] || '未知';
}

// 初始化解锁成语界面
function initializeIdiomsLibrary() {
    updateLibraryStats();
    renderIdiomsGrid();
}

// 更新成语库统计信息
function updateLibraryStats() {
    const unlockedCount = unlockedIdioms.length;
    const totalCount = IDIOMS_DATABASE.length;
    const progressPercentage = Math.round((unlockedCount / totalCount) * 100);
    
    document.getElementById('unlockedCount').textContent = unlockedCount;
    document.getElementById('totalIdiomsCount').textContent = totalCount;
    document.getElementById('progressPercentage').textContent = progressPercentage + '%';
}

// 按难度筛选成语
function filterIdiomsByDifficulty(difficulty) {
    currentDifficultyFilter = difficulty;
    
    // 更新标签状态
    document.querySelectorAll('.difficulty-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
    
    renderIdiomsGrid();
}

// 渲染成语网格
function renderIdiomsGrid() {
    const grid = document.getElementById('idiomsGrid');
    grid.innerHTML = '';
    
    let filteredIdioms = IDIOMS_DATABASE;
    if (currentDifficultyFilter !== 'all') {
        filteredIdioms = IDIOMS_DATABASE.filter(idiom => idiom.difficulty === currentDifficultyFilter);
    }
    
    filteredIdioms.forEach(idiom => {
        const isUnlocked = unlockedIdioms.some(unlocked => unlocked.idiom === idiom.idiom);
        const card = createIdiomCard(idiom, isUnlocked);
        grid.appendChild(card);
    });
}

// 创建成语卡片
function createIdiomCard(idiom, isUnlocked) {
    const card = document.createElement('div');
    card.className = `idiom-card ${!isUnlocked ? 'locked' : ''}`;
    
    if (isUnlocked) {
        card.onclick = () => showIdiomModal(idiom);
    }
    
    card.innerHTML = `
        <div class="idiom-card-header">
            <h3 class="idiom-card-title">${isUnlocked ? idiom.idiom : '????'}</h3>
            <span class="difficulty-badge ${idiom.difficulty}">${getDifficultyText(idiom.difficulty)}</span>
        </div>
        <div class="idiom-card-pinyin">${isUnlocked ? idiom.pinyin : '???'}</div>
        <div class="idiom-card-meaning">${isUnlocked ? idiom.meaning : '完成游戏解锁此成语'}</div>
        ${!isUnlocked ? '<div class="lock-icon">🔒</div>' : ''}
    `;
    
    return card;
}

// 显示成语详情弹窗
function showIdiomModal(idiom) {
    document.getElementById('modalIdiomTitle').textContent = idiom.idiom;
    document.getElementById('modalIdiomPinyin').textContent = idiom.pinyin;
    document.getElementById('modalIdiomMeaning').textContent = idiom.meaning;
    document.getElementById('modalIdiomStory').textContent = idiom.story || '暂无典故信息';
    
    const difficultyBadge = document.getElementById('modalIdiomDifficulty');
    difficultyBadge.textContent = getDifficultyText(idiom.difficulty);
    difficultyBadge.className = `difficulty-badge ${idiom.difficulty}`;
    
    document.getElementById('idiomModal').style.display = 'block';
}

// 关闭成语详情弹窗
function closeIdiomModal() {
    document.getElementById('idiomModal').style.display = 'none';
}

// 解锁新成语（在游戏中调用）
function unlockIdiom(idiom) {
    const isAlreadyUnlocked = unlockedIdioms.some(unlocked => unlocked.idiom === idiom.idiom);
    if (!isAlreadyUnlocked) {
        unlockedIdioms.push({
            idiom: idiom.idiom,
            pinyin: idiom.pinyin,
            meaning: idiom.meaning,
            difficulty: idiom.difficulty,
            unlockedAt: new Date().toISOString()
        });
        localStorage.setItem('unlockedIdioms', JSON.stringify(unlockedIdioms));
    }
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
    const modal = document.getElementById('idiomModal');
    if (event.target === modal) {
        closeIdiomModal();
    }
}