const SnakeGame = (() => {
    let canvas, ctx;
    let snake = [{x:10,y:10}];
    let dir = {x:1,y:0};
    let apple = {x:5,y:5};
    let grid = 20;
    let speed = 150;
    let score = 0;
    let playerId;
    let gameInterval;

    function start(id,name){
        playerId = id;
        canvas = document.getElementById('gameCanvas');
        // Canvas Größe setzen
        canvas.width = 600;
        canvas.height = 600;
        ctx = canvas.getContext('2d');
        
        snake = [{x:10,y:10}];
        dir = {x:1,y:0};
        apple = {
            x:Math.floor(Math.random()*(canvas.width/grid)),
            y:Math.floor(Math.random()*(canvas.height/grid))
        };
        score = 0;
        
        document.addEventListener('keydown',changeDir);
        
        // Altes Intervall clearen
        if(gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop,speed);
    }

    function gameLoop(){
        let head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
        
        // Wand-Kollision
        if(head.x<0||head.x>=canvas.width/grid||head.y<0||head.y>=canvas.height/grid){
            endGame();
            return;
        }
        
        // Self collision
        for(let i=1; i<snake.length; i++){
            if(snake[i].x===head.x && snake[i].y===head.y){
                endGame(); 
                return;
            }
        }
        
        snake.unshift(head);
        
        // Apple eaten
        if(head.x===apple.x && head.y===apple.y){
            score+=10;
            apple = {
                x:Math.floor(Math.random()*(canvas.width/grid)),
                y:Math.floor(Math.random()*(canvas.height/grid))
            };
        } else {
            snake.pop();
        }

        draw();
    }

    function draw(){
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // Apple
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(apple.x*grid,apple.y*grid,grid,grid);

        // Snake
        ctx.fillStyle = '#00ffff';
        snake.forEach(s=>{
            ctx.fillRect(s.x*grid,s.y*grid,grid,grid);
        });

        // Score
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('Score: '+score, 10,20);
    }

    function changeDir(e){
        if(e.key==='ArrowUp' && dir.y===0) dir={x:0,y:-1};
        else if(e.key==='ArrowDown' && dir.y===0) dir={x:0,y:1};
        else if(e.key==='ArrowLeft' && dir.x===0) dir={x:-1,y:0};
        else if(e.key==='ArrowRight' && dir.x===0) dir={x:1,y:0};
    }

    function endGame(){
        clearInterval(gameInterval);
        alert('Game Over! Score: '+score);
        if(window.db) {
            db.ref('players/'+playerId+'/score').set(score);
        }
    }

    return {start};
})();