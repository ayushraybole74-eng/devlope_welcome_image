const express = require("express");
const { createCanvas, loadImage } = require("canvas");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Develop Welcome Image Generator is online!");
});
app.get("/test", (req, res) => {
  res.send("Route is working!");
});
app.get("/welcome", async (req, res) => {
  try {
    const username = req.query.username || "New Member";
    const server = req.query.server || "My Server";
    const count = req.query.count || "1";
    const avatar = req.query.avatar;

    const canvas = createCanvas(1000, 400);
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 1000, 400);
    gradient.addColorStop(0, "#10152f");
    gradient.addColorStop(1, "#006d91");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 400);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Sans";
    ctx.fillText("WELCOME!", 300, 110);

    ctx.font = "bold 36px Sans";
    ctx.fillText(username.slice(0, 25), 300, 175);

    ctx.font = "26px Sans";
    ctx.fillText(server.slice(0, 35), 300, 235);
    ctx.fillText("Member #" + count, 300, 290);

    if (avatar && avatar.startsWith("https://")) {
      const image = await loadImage(avatar);
      ctx.save();
      ctx.beginPath();
      ctx.arc(170, 200, 90, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(image, 80, 110, 180, 180);
      ctx.restore();
    }

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer("image/png"));
  } catch (error) {
    res.status(400).send("Image generation failed.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Develop image generator running on ${port}`));
