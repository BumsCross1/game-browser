document.addEventListener('DOMContentLoaded', function() {
  const homeScreen = document.getElementById('homeScreen');
  const hubScreen = document.getElementById('hubScreen');
  const gameScreen = document.getElementById('gameScreen');
  const startBtn = document.getElementById('startBtn');
  const playerNameInput = document.getElementById('playerName');
  const displayName = document.getElementById('displayName');
  const scoresList = document.getElementById('scores');
  const backHub = document.getElementById('backHub');
  const gameCards = document.querySelectorAll('.game-card');

  let playerId = 'player' + Math.floor(Math.random()*10000);
  let playerName = "Commander";

  // Start Button
  startBtn.onclick = () => {
      playerName = playerNameInput.value.trim() || "Commander";
      displayName.textContent = playerName;
      homeScreen.style.display = 'none';
      hubScreen.style.display = 'flex';
      
      if (window.db) {
          db.ref('players/'+playerId).set({
              name: playerName, 
              score: 0,
              joined: Date.now()
          });
      }
  };

  // Enter key support
  playerNameInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          startBtn.click();
      }
  });

  // Leaderboard
  if (window.db) {
      db.ref('players').on('value', snapshot => {
          const players = snapshot.val() || {};
          scoresList.innerHTML = '';
          
          Object.values(players)
              .sort((a,b) => (b.score || 0) - (a.score || 0))
              .slice(0, 5)
              .forEach((p, index) => {
                  const li = document.createElement('li');
                  li.innerHTML = `
                      <span>${index + 1}. ${p.name}</span>
                      <span>${p.score || 0}</span>
                  `;
                  scoresList.appendChild(li);
              });
      });
  }

  // Game selection
  gameCards.forEach(card => {
      card.addEventListener('click', function() {
          const game = this.getAttribute('data-game');
          
          // Add exit animation to hub
          hubScreen.style.opacity = '0';
          
          setTimeout(() => {
              hubScreen.style.display = 'none';
              gameScreen.style.display = 'flex';
              gameScreen.style.opacity = '0';
              
              // Fade in game screen
              setTimeout(() => {
                  gameScreen.style.opacity = '1';
              }, 50);
              
              startSelectedGame(game);
          }, 300);
      });
  });

  // Back to hub
  backHub.addEventListener('click', function() {
      gameScreen.style.opacity = '0';
      
      setTimeout(() => {
          gameScreen.style.display = 'none';
          hubScreen.style.display = 'flex';
          hubScreen.style.opacity = '0';
          
          setTimeout(() => {
              hubScreen.style.opacity = '1';
          }, 50);
      }, 300);
  });

  function startSelectedGame(game){
      console.log("Starting game:", game); // Debug
      
      if(game === 'tictactoe'){
          if(typeof TicTacToe !== 'undefined') {
              TicTacToe.start(playerId, playerName);
          } else {
              console.error('TicTacToe is not defined');
          }
      } else if(game === 'snake'){
          if(typeof SnakeGame !== 'undefined') {
              SnakeGame.start(playerId, playerName);
          } else {
              console.error('SnakeGame is not defined');
          }
      }
  }
});