function startConfetti() {
  const confettiCount = 150;
  const confettiContainer = document.createElement('div');
  confettiContainer.classList.add('confetti-container');
  document.body.appendChild(confettiContainer);

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFCE00'];

  for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.opacity = Math.random();

      // ランダムに色を選択
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
      document.body.removeChild(confettiContainer);
  }, 5000);
}

export  { startConfetti }

function startStarAnimation() {
  for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 200}vw`;
      star.style.top = `${Math.random() * 200}vh`;
      document.body.appendChild(star);

      // 4秒後に星を削除
      setTimeout(() => {
          star.remove();
      }, 4000);
  }
}

export { startStarAnimation }

function startBubbleAnimation() {
  for (let i = 0; i < 40; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.left = `${Math.random() * 100}vw`;
      bubble.style.bottom = '0';
      bubble.style.width = bubble.style.height = `${Math.random() * 20 + 10}px`;
      document.body.appendChild(bubble);

      setTimeout(() => {
          bubble.remove();
      }, 5000); // アニメーションが終わったら削除
  }
}


export { startBubbleAnimation }

function startFireworkAnimation() {
  for (let i = 0; i < 5; i++) {
      const firework = document.createElement('div');
      firework.className = 'firework';
      firework.style.left = `${Math.random() * 100}vw`;
      firework.style.top = `${Math.random() * 100}vh`;
      document.body.appendChild(firework);

      setTimeout(() => {
          firework.remove();
      }, 2000);
  }
}

export { startFireworkAnimation }