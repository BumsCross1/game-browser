const ChessGame = (() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    // Canvas Größe setzen
    canvas.width = 600;
    canvas.height = 600;
    const cell = canvas.width / 8;
    const pieces = {'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟','R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙'};
    let board = [];
    let playerId, playerName;
    let selected=null;

    function start(id,name){
        playerId=id; playerName=name;
        board=[
            ['r','n','b','q','k','b','n','r'],
            ['p','p','p','p','p','p','p','p'],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['P','P','P','P','P','P','P','P'],
            ['R','N','B','Q','K','B','N','R']
        ];
        drawBoard();
        canvas.addEventListener('click',handleClick);
    }

    function handleClick(e){
        const rect = canvas.getBoundingClientRect();
        const x=Math.floor((e.clientX-rect.left)/cell);
        const y=Math.floor((e.clientY-rect.top)/cell);
        
        if(x < 0 || x >= 8 || y < 0 || y >= 8) return;
        
        if(selected){
            board[y][x]=board[selected.y][selected.x];
            board[selected.y][selected.x]='';
            selected=null;
            drawBoard();
        } else if(board[y][x]) {
            selected={x,y};
            drawBoard(); // Neu zeichnen um Auswahl anzuzeigen
        }
    }

    function drawBoard(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let y=0;y<8;y++){
            for(let x=0;x<8;x++){
                // Ausgewähltes Feld hervorheben
                if(selected && selected.x === x && selected.y === y){
                    ctx.fillStyle='#666';
                } else {
                    ctx.fillStyle=(x+y)%2===0?'#222':'#444';
                }
                ctx.fillRect(x*cell,y*cell,cell,cell);
                const p=board[y][x];
                if(p){
                    ctx.fillStyle=p === p.toUpperCase() ? '#fff' : '#000';
                    ctx.font="50px Arial";
                    ctx.textAlign="center";
                    ctx.textBaseline="middle";
                    ctx.fillText(pieces[p],x*cell+cell/2,y*cell+cell/2);
                }
            }
        }
    }

    return {start};
})();