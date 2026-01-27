// Retro 8-bit Skill Collection Game
export class SkillGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.skills = this.initializeSkills();
    this.player = this.initializePlayer();
    this.score = 0;
    this.particles = [];
    this.powerups = [];
    this.gameStarted = false;
    this.animationId = null;

    this.setupEventListeners();
  }

  initializeSkills() {
    const skillNames = [
      'C#', '.NET', 'JAVA', 'PYTHON', 'SQL', 'JS', 'REACT', 'NODE',
      'AZURE', 'GIT', 'PYTORCH', 'TF', 'NLP', 'CV', 'REST', 'CI/CD'
    ];

    const colors = ['#ff006e', '#00d9ff', '#ffbe0b', '#06ffa5'];

    return skillNames.map((name, i) => ({
      name,
      x: Math.random() * 0.9 + 0.05,
      y: Math.random() * 0.9 + 0.05,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 16,
      color: colors[i % colors.length],
      collected: false,
      bounceCount: 0
    }));
  }

  initializePlayer() {
    return {
      x: 0.5,
      y: 0.5,
      size: 20,
      speed: 0.003,
      targetX: 0.5,
      targetY: 0.5,
      color: '#ffffff',
      trail: []
    };
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  init() {
    this.resize();
    this.gameStarted = true;
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = 500;

    // Update skill absolute positions
    this.skills.forEach((skill) => {
      skill.absX = skill.x * this.canvas.width;
      skill.absY = skill.y * this.canvas.height;
    });

    this.player.absX = this.player.x * this.canvas.width;
    this.player.absY = this.player.y * this.canvas.height;
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.player.targetX = (e.clientX - rect.left) / this.canvas.width;
    this.player.targetY = (e.clientY - rect.top) / this.canvas.height;
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked on a skill
    this.skills.forEach((skill) => {
      if (skill.collected) return;

      const dx = clickX - skill.absX;
      const dy = clickY - skill.absY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < skill.size) {
        this.collectSkill(skill);
      }
    });

    // Create click effect
    this.createClickEffect(clickX, clickY);
  }

  collectSkill(skill) {
    skill.collected = true;
    this.score += 100;

    // Create particle explosion
    this.createParticleExplosion(skill.absX, skill.absY, skill.color);

    // Create power-up text
    this.createPowerUpText(skill.absX, skill.absY, skill.name);

    // Respawn skill after delay
    setTimeout(() => {
      skill.collected = false;
      skill.x = Math.random() * 0.9 + 0.05;
      skill.y = Math.random() * 0.9 + 0.05;
      skill.absX = skill.x * this.canvas.width;
      skill.absY = skill.y * this.canvas.height;
    }, 3000);
  }

  createClickEffect(x, y) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30,
        size: 4,
        color: '#ffffff'
      });
    }
  }

  createParticleExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        life: 60,
        size: 6,
        color
      });
    }
  }

  createPowerUpText(x, y, text) {
    this.powerups.push({
      x,
      y,
      text,
      life: 60,
      alpha: 1
    });
  }

  updatePlayer() {
    // Smooth movement towards target
    const dx = this.player.targetX - this.player.x;
    const dy = this.player.targetY - this.player.y;

    this.player.x += dx * this.player.speed * 60;
    this.player.y += dy * this.player.speed * 60;

    this.player.absX = this.player.x * this.canvas.width;
    this.player.absY = this.player.y * this.canvas.height;

    // Update trail
    this.player.trail.push({ x: this.player.absX, y: this.player.absY });
    if (this.player.trail.length > 10) {
      this.player.trail.shift();
    }
  }

  updateSkills() {
    this.skills.forEach((skill) => {
      if (skill.collected) return;

      skill.absX += skill.vx;
      skill.absY += skill.vy;

      // Bounce off walls with pixel-perfect collision
      if (skill.absX <= skill.size || skill.absX >= this.canvas.width - skill.size) {
        skill.vx *= -1;
        skill.bounceCount++;
      }
      if (skill.absY <= skill.size || skill.absY >= this.canvas.height - skill.size) {
        skill.vy *= -1;
        skill.bounceCount++;
      }

      // Keep in bounds
      skill.absX = Math.max(skill.size, Math.min(this.canvas.width - skill.size, skill.absX));
      skill.absY = Math.max(skill.size, Math.min(this.canvas.height - skill.size, skill.absY));

      // Update normalized positions
      skill.x = skill.absX / this.canvas.width;
      skill.y = skill.absY / this.canvas.height;
    });
  }

  updateParticles() {
    this.particles = this.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      return p.life > 0;
    });
  }

  updatePowerUps() {
    this.powerups = this.powerups.filter((p) => {
      p.y -= 1;
      p.life--;
      p.alpha = p.life / 60;
      return p.life > 0;
    });
  }

  drawBackground() {
    // Black background with scanlines
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw scanlines for retro CRT effect
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.canvas.height; i += 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
      this.ctx.stroke();
    }
  }

  drawPlayer() {
    // Draw trail
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.player.trail.forEach((point, i) => {
      if (i === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.ctx.stroke();

    // Draw player as pixel square
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(
      this.player.absX - this.player.size / 2,
      this.player.absY - this.player.size / 2,
      this.player.size,
      this.player.size
    );

    // Draw border
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.player.absX - this.player.size / 2,
      this.player.absY - this.player.size / 2,
      this.player.size,
      this.player.size
    );
  }

  drawSkills() {
    this.skills.forEach((skill) => {
      if (skill.collected) return;

      // Draw glow effect
      const gradient = this.ctx.createRadialGradient(
        skill.absX,
        skill.absY,
        0,
        skill.absX,
        skill.absY,
        skill.size * 2
      );
      gradient.addColorStop(0, skill.color);
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        skill.absX - skill.size * 2,
        skill.absY - skill.size * 2,
        skill.size * 4,
        skill.size * 4
      );

      // Draw skill as pixel square
      this.ctx.fillStyle = skill.color;
      this.ctx.fillRect(skill.absX - skill.size / 2, skill.absY - skill.size / 2, skill.size, skill.size);

      // Draw border
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(skill.absX - skill.size / 2, skill.absY - skill.size / 2, skill.size, skill.size);

      // Draw skill name
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 8px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(skill.name, skill.absX, skill.absY);
    });
  }

  drawParticles() {
    this.particles.forEach((p) => {
      const alpha = p.life / 60;
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      this.ctx.globalAlpha = 1;
    });
  }

  drawPowerUps() {
    this.powerups.forEach((p) => {
      this.ctx.fillStyle = '#ffbe0b';
      this.ctx.globalAlpha = p.alpha;
      this.ctx.font = 'bold 12px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`+${p.text}`, p.x, p.y);
      this.ctx.globalAlpha = 1;
    });
  }

  drawScore() {
    // Draw score in top-left corner
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 14px "Press Start 2P"';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`SCORE: ${this.score}`, 20, 30);

    // Draw skill count
    const collected = this.skills.filter((s) => !s.collected).length;
    this.ctx.fillText(`SKILLS: ${16 - collected}/16`, 20, 60);
  }

  animate() {
    if (!this.gameStarted) return;

    this.drawBackground();
    this.updatePlayer();
    this.updateSkills();
    this.updateParticles();
    this.updatePowerUps();

    this.drawPlayer();
    this.drawSkills();
    this.drawParticles();
    this.drawPowerUps();
    this.drawScore();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.gameStarted = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}