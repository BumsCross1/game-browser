const SnakeGame = (() => {
    let canvas, ctx;
    let snake = [];
    let dir = {x: 1, y: 0};
    let apple = {};
    let grid = 20;
    let speed = 150;
    let score = 0;
    let playerId;
    let gameInterval;

    function start(id, name){
        playerId = id;
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        
        // Canvas Größe setzen
        canvas.width = 600;
        canvas.height = 600;
        
        // Spiel initialisieren
        snake = [{x: 10, y: 10}];
        dir = {x: 1, y: 0};
        placeApple();
        score = 0;
        
        // Altes Intervall clearen
        if(gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
        
        // Event Listener
        document.removeEventListener('keydown', changeDir);
        document.addEventListener('keydown', changeDir);
        
        draw();
    }

    function placeApple(){
        apple = {
            x: Math.floor(Math.random() * (canvas.width / grid)),
            y: Math.floor(Math.random() * (canvas.height / grid))
        };
        
        // Sicherstellen, dass Apfel nicht auf Schlange spawnet
        for(let segment of snake){
            if(segment.x === apple.x && segment.y === apple.y){
                placeApple();
                break;
            }
        }
    }

    function gameLoop(){
        const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
        
        // Wand-Kollision
        if(head.x < 0 || head.x >= canvas.width / grid || head.y < 0 || head.y >= canvas.height / grid){
            endGame();
            return;
        }
        
        // Selbst-Kollision
        for(let i = 0; i < snake.length; i++){
            if(snake[i].x === head.x && snake[i].y === head.y){
                endGame();
                return;
            }
        }
        
        snake.unshift(head);
        
        // Apfel gegessen
        if(head.x === apple.x && head.y === apple.y){
            score += 10;
            speed = Math.max(100, 150 - Math.floor(score / 50) * 10); // Schwierigkeit erhöhen
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
            placeApple();
        } else {
            snake.pop();
        }

        draw();
    }

    function draw(){
        // Space Background
        ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid Pattern (optional)
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for(let x = 0; x < canvas.width; x += grid){
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for(let y = 0; y < canvas.height; y += grid){
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Apfel als Energie-Kristall
        ctx.fillStyle = '#ff00ff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff00ff';
        ctx.beginPath();
        ctx.arc(apple.x * grid + grid/2, apple.y * grid + grid/2, grid/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Schlange als Energie-Schlange
        snake.forEach((segment, index) => {
            if(index === 0){
                // Kopf
                ctx.fillStyle = '#00ffff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00ffff';
            } else {
                // Körper
                const gradient = ctx.createLinearGradient(
                    segment.x * grid, segment.y * grid,
                    segment.x * grid + grid, segment.y * grid + grid
                );
                gradient.addColorStop(0, '#00ffff');
                gradient.addColorStop(1, '#0088ff');
                ctx.fillStyle = gradient;
            }
            
            ctx.fillRect(segment.x * grid, segment.y * grid, grid, grid);
            
            // Segment-Gitter
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(segment.x * grid, segment.y * grid, grid, grid);
        });
        ctx.shadowBlur = 0;

        // Score Anzeige
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 20px 'Orbitron', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`SCORE: ${score}`, 20, 30);
        ctx.fillText(`SPEED: ${Math.floor((150 - speed) / 5)}`, 20, 60);
    }

    function changeDir(e){
        if((e.key === 'ArrowUp' || e.key === 'w') && dir.y === 0) 
            dir = {x: 0, y: -1};
        else if((e.key === 'ArrowDown' || e.key === 's') && dir.y === 0) 
            dir = {x: 0, y: 1};
        else if((e.key === 'ArrowLeft' || e.key === 'a') && dir.x === 0) 
            dir = {x: -1, y: 0};
        else if((e.key === 'ArrowRight' || e.key === 'd') && dir.x === 0) 
            dir = {x: 1, y: 0};
    }

    function endGame(){
        clearInterval(gameInterval);
        
        // Custom Game Over Screen
        const gameOverDiv = document.createElement('div');
        gameOverDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 20, 40, 0.95);
            border: 2px solid #ff00ff;
            border-radius: 15px;
            padding: 30px;
            color: white;
            font-family: 'Orbitron', sans-serif;
            font-size: 24px;
            text-align: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 50px rgba(255, 0, 255, 0.5);
        `;
        gameOverDiv.innerHTML = `
            <div>GAME OVER</div>
            <div style="font-size: 18px; margin: 15px 0;">FINAL SCORE: ${score}</div>
        `;
        
        const continueBtn = document.createElement('button');
        continueBtn.textContent = 'CONTINUE';
        continueBtn.style.cssText = `
            margin-top: 20px;
            padding: 10px 20px;
            background: linear-gradient(45deg, #ff00ff, #ff0080);
            border: none;
            border-radius: 25px;
            color: #000;
            font-family: 'Orbitron', sans-serif;
            cursor: pointer;
            font-weight: bold;
        `;
        continueBtn.onclick = function() {
            document.body.removeChild(gameOverDiv);
            // Score speichern
            if(window.db) {
                db.ref('players/' + playerId + '/score').set(score);
            }
            start(playerId, playerName);
        };
        
        gameOverDiv.appendChild(continueBtn);
        document.body.appendChild(gameOverDiv);
    }

    return {start};
})();