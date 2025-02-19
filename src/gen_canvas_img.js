import c from "canvas";

c.registerFont("./fonts/open-dyslexic.ttf", { family: "OpenDyslexic" });
const colors = ["red", "green", "blue", "yellow", "orange"];
export function genCanvas(word) {
  const canvas = c.createCanvas(200, 200);
  const ctx = canvas.getContext("2d");
  let exampleCaptcha = word;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const letters = exampleCaptcha.split("");
  ctx.font = "30px OpenDyslexic";
  ctx.globalAlpha = 0.5;

  letters.forEach((l, index) => {
    if (index % 2 === 0) return;
    ctx.font = `${30 + Math.round(Math.random() * 5)}px OpenDyslexic`;
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    console.log(l);
    ctx.fillText(l, 30 + index * 20, 100);
  });
  ctx.globalAlpha = 1.0;
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, 1)`;
    ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, 1)`;
    ctx.fillRect(
      Math.random() * 200,
      Math.random() * 200,
      1 * Math.round(Math.random() * 10),
      1
    );
    // write a random word
    ctx.font = `${Math.floor(Math.random() * 3) + 6}px Arial`;
    ctx.fillText(
      String.fromCharCode(Math.floor(Math.random() * 26) + 97),
      Math.random() * 200,
      Math.random() * 200
    );
    // connect to lines
    ctx.beginPath();
    ctx.moveTo(Math.random() * 200, Math.random() * 200);
    ctx.lineTo(Math.random() * 200, Math.random() * 200);
    ctx.stroke();
  }
  ctx.font = "30px OpenDyslexic";

  letters.forEach((l, index) => {
    if (index % 2 !== 0) return;
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    console.log(l);
    ctx.fillText(l, 30 + index * 20, 100);
  });
  const stream = canvas.toBuffer();
  return stream;
}
