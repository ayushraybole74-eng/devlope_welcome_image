const express = require("express");
const { createCanvas, loadImage } = require("canvas");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome image service is online!");
});

app.get("/welcome", async (req, res) => {
  try {
    const username = String(req.query.username || "New Member");
    const server = String(req.query.server || "My Server");
    const count = String(req.query.count || "1");

    const canvas = createCanvas(1000, 400);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#10152f";
    ctx.fillRect(0, 0, 1000, 400);

    const gradient = ctx.createLinearGradient(0, 0, 1000, 400);
    gradient.addColorStop(0, "#10152f");
    gradient.addColorStop(1, "#006d91");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 400);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px Sans";
    ctx.fillText("WELCOME!", 300, 110);
    ctx.font = "bold 38px Sans";
    ctx.fillText(username.slice(0, 25), 300, 180);
    ctx.font = "28px Sans";
    ctx.fillText(server.slice(0, 35), 300, 240);
    ctx.fillText("Member #" + count, 300, 300);

    if (req.query.avatar && req.query.avatar.startsWith("https://")) {
      const image = await loadImage(req.query.avatar);
      ctx.save();
      ctx.beginPath();
      ctx.arc(170, 200, 90, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(image, 80, 110, 180, 180);
      ctx.restore();
    }

    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "no-store");
    res.send(canvas.toBuffer("image/png"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Image generation failed: " + error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Welcome image service running on " + port));
