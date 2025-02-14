import c from "canvas";

c.registerFont("./fonts/open-dyslexic.ttf", { family: "OpenDyslexic" });

export function genCanvas(word) {
  const canvas = c.createCanvas(400, 200);
  const ctx = canvas.getContext("2d");
  let exampleCaptcha = word;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px OpenDyslexic";
  ctx.fillStyle = "white";
  ctx.fillText(exampleCaptcha, 50, 100);

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
  const stream = canvas.toBuffer();
  return stream;
}
