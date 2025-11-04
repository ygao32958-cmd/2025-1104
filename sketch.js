let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];

let menuItems = ["第一單元作品", "第一單元講義", "測驗系統", "返回首頁"];
let menuWidth, menuHeight, menuItemHeight;

let iframe;
let animating = false;
let hoverIndex = -1;  // 🔴 滑鼠移過的項目
let activeIndex = -1; // 🔴 點擊選取的項目
let showBackground = true;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('p5-canvas');
  rectMode(CENTER);
  textAlign(LEFT, CENTER);
  textSize(20);
  objs.push(new DynamicShape());

  menuWidth = width / 7;
  menuHeight = height;
  menuItemHeight = menuHeight / menuItems.length;
}

function draw() {
  background(255);

  // === 背景圖形 ===
  if (showBackground) {
    for (let i of objs) i.run();

    let speedFactor = map(mouseX, 0, width, 5, 40);
    if (frameCount % int(random([speedFactor, speedFactor + 10])) == 0) {
      let addNum = int(random(1, 10));
      for (let i = 0; i < addNum; i++) objs.push(new DynamicShape());
    }
    objs = objs.filter(o => !o.isDead);
  }

  drawMenu();
}

// === 左側固定選單 ===
function drawMenu() {
  push();
  noStroke();
  fill(255, 255, 153, 102); // 🟡 鵝黃色 + 透明度40%
  rectMode(CORNER);
  rect(0, 0, menuWidth, menuHeight);

  textSize(22);
  for (let i = 0; i < menuItems.length; i++) {
    let y = (i + 0.5) * menuItemHeight;

    // 🟥 顯示紅色條件：滑過或被點選
    if (i === hoverIndex || i === activeIndex) {
      fill('#ff0000');
    } else {
      fill('#000000');
    }

    text(menuItems[i], 10, y);
  }
  pop();
}

// === 滑鼠移動：偵測 hover ===
function mouseMoved() {
  if (mouseX < menuWidth) {
    hoverIndex = floor(mouseY / menuItemHeight);
  } else {
    hoverIndex = -1;
  }
}

// === 滑鼠點擊 ===
function mousePressed() {
  if (mouseX < menuWidth && !animating) {
    let clickedIndex = floor(mouseY / menuItemHeight);
    activeIndex = clickedIndex;
    showBackground = false; // 點選後隱藏背景

    if (clickedIndex === 0) {
      fadeIframeTo("https://ygao32958-cmd.github.io/20251014/");
    } else if (clickedIndex === 1) {
      fadeIframeTo("https://hackmd.io/@VrbvM8VNTM25jIpeWHaoww/B1OltOk3gx");
    } else if (clickedIndex === 2) {
      // 測驗系統連到 GitHub Pages
      fadeIframeTo("https://ygao32958-cmd.github.io/2025-11-4-001/");
    } else if (clickedIndex === 3) {
      fadeIframeOut();
      showBackground = true; // 回首頁 → 顯示背景
      activeIndex = -1;
    }
  }
}

// === iframe 控制 ===
function fadeIframeTo(url) {
  animating = true;
  if (!iframe) {
    iframe = createElement("iframe");
    iframe.position(menuWidth, 0);
    iframe.size(width - menuWidth, height);
    iframe.style("border", "none");
    iframe.style("opacity", "0");
    iframe.attribute("src", url);
    iframe.show();
    fadeIn(iframe, 500, () => (animating = false));
  } else {
    fadeOut(iframe, 500, () => {
      iframe.attribute("src", url);
      fadeIn(iframe, 500, () => (animating = false));
    });
  }
}

function fadeIframeOut() {
  if (iframe) {
    animating = true;
    fadeOut(iframe, 500, () => {
      iframe.remove();
      iframe = null;
      animating = false;
    });
  }
}

function fadeIn(el, duration, callback) {
  el.style("transition", `opacity ${duration}ms ease`);
  el.style("opacity", "1");
  setTimeout(callback, duration);
}

function fadeOut(el, duration, callback) {
  el.style("transition", `opacity ${duration}ms ease`);
  el.style("opacity", "0");
  setTimeout(callback, duration);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  menuWidth = width / 7;
  menuHeight = height;
  menuItemHeight = menuHeight / menuItems.length;

  if (iframe) {
    iframe.position(menuWidth, 0);
    iframe.size(width - menuWidth, height);
  }
}

// === easing function ===
function easeInOutExpo(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

// === 動態圖形類別 ===
class DynamicShape {
  constructor() {
    this.x = random(0.25, 0.75) * width;
    this.y = random(0.25, 0.75) * height;
    this.reductionRatio = 1;
    this.shapeType = int(random(4));
    this.animationType = 0;
    this.maxActionPoints = int(random(2, 5));
    this.actionPoints = this.maxActionPoints;
    this.elapsedT = 0;
    this.size = 0;
    this.sizeMax = width * random(0.01, 0.05);
    this.fromSize = 0;
    this.init();
    this.isDead = false;
    this.clr = random(colors);
    this.changeShape = true;
    this.ang = int(random(2)) * PI * 0.25;
    this.lineSW = 0;
  }

  show() {
    push();
    translate(this.x, this.y);
    if (this.animationType == 1) scale(1, this.reductionRatio);
    if (this.animationType == 2) scale(this.reductionRatio, 1);
    fill(this.clr);
    stroke(this.clr);
    strokeWeight(this.size * 0.05);
    if (this.shapeType == 0) {
      noStroke();
      circle(0, 0, this.size);
    } else if (this.shapeType == 1) {
      noFill();
      circle(0, 0, this.size);
    } else if (this.shapeType == 2) {
      noStroke();
      rect(0, 0, this.size, this.size);
    } else if (this.shapeType == 3) {
      noFill();
      rect(0, 0, this.size * 0.9, this.size * 0.9);
    }
    pop();
    strokeWeight(this.lineSW);
    stroke(this.clr);
    line(this.x, this.y, this.fromX, this.fromY);
  }

  move() {
    let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
    if (0 < this.elapsedT && this.elapsedT < this.duration) {
      if (this.actionPoints == this.maxActionPoints) {
        this.size = lerp(0, this.sizeMax, n);
      } else if (this.actionPoints > 0) {
        if (this.animationType == 0) {
          this.size = lerp(this.fromSize, this.toSize, n);
        } else if (this.animationType == 1) {
          this.x = lerp(this.fromX, this.toX, n);
          this.lineSW = lerp(0, this.size / 5, sin(n * PI));
        } else if (this.animationType == 2) {
          this.y = lerp(this.fromY, this.toY, n);
          this.lineSW = lerp(0, this.size / 5, sin(n * PI));
        }
        this.reductionRatio = lerp(1, 0.3, sin(n * PI));
      } else {
        this.size = lerp(this.fromSize, 0, n);
      }
    }

    this.elapsedT++;
    if (this.elapsedT > this.duration) {
      this.actionPoints--;
      this.init();
    }
    if (this.actionPoints < 0) {
      this.isDead = true;
    }
  }

  run() {
    this.show();
    this.move();
  }

  init() {
    this.elapsedT = 0;
    this.fromSize = this.size;
    this.toSize = this.sizeMax * random(0.5, 1.5);
    this.fromX = this.x;
    this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
    this.fromY = this.y;
    this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
    this.animationType = int(random(3));
    this.duration = random(20, 50);
  }
}

















