function triggerScoreMatch(winningUnit) {
    activeRound = false;
    if (winningUnit === 1) { 
        scores.p1++; 
        document.getElementById("p1-score").textContent = scores.p1; 
    } else { 
        scores.p2++; 
        document.getElementById("p2-score").textContent = scores.p2; 
    }

    const banner = document.getElementById("match-banner");
    const container = document.getElementById("overlay");
    
    if (scores.p1 >= 5 || scores.p2 >= 5) {
        banner.textContent = `PLAYER ${scores.p1 >= 5 ? "1" : "2"} CONQUERS THE MATCH!`;
        document.getElementById("sub-banner").textContent = "REFRESH ENGINE TO REMATCH";
        container.classList.remove("hidden");
        return;
    }

    banner.textContent = `PLAYER ${winningUnit} POINTS!`;
    container.classList.remove("hidden");

    setTimeout(() => {
        // Complete Environment Shuffling Routines (Core Basket Random Feature)
        environmentTheme = Math.floor(Math.random() * themes.length);
        targetHoops.leftY = 160 + Math.random() * 160;
        targetHoops.rightY = 160 + Math.random() * 160;

        // Reset positions safely
        ball.pos = new Vec2(500, 100);
        ball.vel = new Vec2(Math.random() * 6 - 3, -4);
        p1.spawnNodes();
        p2.spawnNodes();
        
        container.classList.add("hidden");
        activeRound = true;
    }, 2000);
}

function processHoopScoringBounds() {
    // Left Hoop Verification Loop (P2 points targets zone)
    if (ball.pos.x < 70 && Math.abs(ball.pos.y - targetHoops.leftY) < 20 && ball.vel.y > 0) {
        triggerScoreMatch(2);
        ball.pos.y = GROUND_Y + 100;
    }
    // Right Hoop Verification Loop (P1 points targets zone)
    if (ball.pos.x > canvas.width - 70 && Math.abs(ball.pos.y - targetHoops.rightY) < 20 && ball.vel.y > 0) {
        triggerScoreMatch(1);
        ball.pos.y = GROUND_Y + 100;
    }
}

function renderEnvironment() {
    // Primary sky clearing fill
    ctx.fillStyle = themes[environmentTheme].bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Thick retro ground line layers
    ctx.fillStyle = themes[environmentTheme].ground;
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
    ctx.fillStyle = "#3b4252";
    ctx.fillRect(0, GROUND_Y, canvas.width, 6);

    ctx.save();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#e5e9f0";
    
    // Construct Left Backboard Net Assembly
    ctx.beginPath(); 
    ctx.moveTo(0, targetHoops.leftY); 
    ctx.lineTo(55, targetHoops.leftY); 
    ctx.stroke();
    ctx.fillStyle = "#e84118"; 
    ctx.fillRect(55, targetHoops.leftY, 22, 6); // Rim border block

    // Construct Right Backboard Net Assembly
    ctx.beginPath(); 
    ctx.moveTo(canvas.width, targetHoops.rightY); 
    ctx.lineTo(canvas.width - 55, targetHoops.rightY); 
    ctx.stroke();
    ctx.fillStyle = "#e84118"; 
    ctx.fillRect(canvas.width - 77, targetHoops.rightY, 22, 6);
    ctx.restore();
}

// Window Event Mapping Input System
window.addEventListener("keydown", (e) => {
    if (!activeRound) return;
    let pressedKey = e.key.toLowerCase();
    
    if (pressedKey === p1.controlKey) p1.applyAction();
    if (pressedKey === p2.controlKey) p2.applyAction();
});

// Central Engine Frame Updates Iterator
function runEngineLoop() {
    renderEnvironment();

    if (activeRound) {
        p1.update();
        p2.update();
        ball.update();
        processHoopScoringBounds();
    }

    p1.draw();
    p2.draw();
    ball.draw();

    requestAnimationFrame(runEngineLoop);
}

// Start Engine Execution
runEngineLoop();
