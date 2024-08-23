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