const TicTacToe = (() => {
    let canvas, ctx;
    const size = 200; // Größe jedes Feldes
    let board = [['','',''],['','',''],['','','']];
    let currentPlayer = 'X';
    let playerId, playerName;
    let gameActive = true;

    function start(id, name){
        playerId = id;
        playerName = name;
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        
        // Canvas Größe setzen
        canvas.width = 600;
        canvas.height = 600;
        
        board = [['','',''],['','',''],['','','']];
        currentPlayer = 'X';
        gameActive = true;
        
        // Event Listener neu setzen
        canvas.removeEventListener('click', handleClick);
        canvas.addEventListener('click', handleClick);
        
        drawBoard();
    }

    function handleClick(e){
        if(!gameActive) return;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / size);
        const y = Math.floor((e.clientY - rect.top) / size);
        
        if(x >= 0 && x < 3 && y >= 0 && y < 3 && board[y][x] === ''){
            board[y][x] = currentPlayer;
            drawBoard();
            
            if(checkWin()){
                gameActive = false;
                setTimeout(() => endGame(`${currentPlayer} WINS!`), 50);
            } else if(board.flat().every(c => c !== '')) {
                gameActive = false;
                setTimeout(() => endGame('DRAW!'), 50);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if(currentPlayer === 'O' && gameActive) {
                    setTimeout(botMove, 500); // Kurze Verzögerung für bessere UX
                }
            }
        }
    }

    function botMove(){
        let empty = [];
        for(let y = 0; y < 3; y++){
            for(let x = 0; x < 3; x++){
                if(board[y][x] === '') empty.push([x, y]);
            }
        }
        if(empty.length === 0) return;
        
        let [x, y] = empty[Math.floor(Math.random() * empty.length)];
        board[y][x] = 'O';
        drawBoard();
        
        if(checkWin()){
            gameActive = false;
            setTimeout(() => endGame('AI WINS!'), 50);
        } else if(board.flat().every(c => c !== '')) {
            gameActive = false;
            setTimeout(() => endGame('DRAW!'), 50);
        }
        currentPlayer = 'X';
    }

    function checkWin(){
        const lines = [
            [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]], // rows
            [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], // columns
            [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]] // diagonals
        ];
        
        return lines.some(line => {
            const [a, b, c] = line;
            return board[a[1]][a[0]] && 
                   board[a[1]][a[0]] === board[b[1]][b[0]] && 
                   board[a[1]][a[0]] === board[c[1]][c[0]];
        });
    }

    function drawBoard(){
        // Space Background
        ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid mit Space Design
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 6;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        
        for(let i = 1; i < 3; i++){
            // Vertikale Linien
            ctx.beginPath();
            ctx.moveTo(i * size, 20);
            ctx.lineTo(i * size, canvas.height - 20);
            ctx.stroke();
            
            // Horizontale Linien
            ctx.beginPath();
            ctx.moveTo(20, i * size);
            ctx.lineTo(canvas.width - 20, i * size);
            ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
        
        // Pieces mit Space Design
        ctx.font = "bold 120px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        for(let y = 0; y < 3; y++){
            for(let x = 0; x < 3; x++){
                const p = board[y][x];
                if(p){
                    if(p === 'X'){
                        // X in cyan mit Glow
                        ctx.fillStyle = '#00ffff';
                        ctx.shadowBlur = 20;
                        ctx.shadowColor = '#00ffff';
                    } else {
                        // O in magenta mit Glow
                        ctx.fillStyle = '#ff00ff';
                        ctx.shadowBlur = 20;
                        ctx.shadowColor = '#ff00ff';
                    }
                    ctx.fillText(p, x * size + size / 2, y * size + size / 2);
                    ctx.shadowBlur = 0;
                }
            }
        }
        
        // Current Player Anzeige
        ctx.fillStyle = '#ffffff';
        ctx.font = "20px 'Exo 2', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`PLAYER: ${playerName}`, 20, 30);
        ctx.fillText(`TURN: ${currentPlayer}`, 20, 60);
    }

    function endGame(msg){
        // Custom Alert mit Space Design
        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 20, 40, 0.95);
            border: 2px solid #00ffff;
            border-radius: 15px;
            padding: 30px;
            color: white;
            font-family: 'Orbitron', sans-serif;
            font-size: 24px;
            text-align: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
        `;
        alertBox.textContent = msg;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CONTINUE';
        closeBtn.style.cssText = `
            margin-top: 20px;
            padding: 10px 20px;
            background: linear-gradient(45deg, #00ffff, #0080ff);
            border: none;
            border-radius: 25px;
            color: #000;
            font-family: 'Orbitron', sans-serif;
            cursor: pointer;
            font-weight: bold;
        `;
        closeBtn.onclick = function() {
            document.body.removeChild(alertBox);
            // Score speichern
            const score = (board.flat().filter(cell => cell === 'X').length) * 10;
            if(window.db) {
                db.ref('players/' + playerId + '/score').set(score);
            }
            start(playerId, playerName);
        };
        
        alertBox.appendChild(closeBtn);
        document.body.appendChild(alertBox);
    }

    return {start};
})();