
const express = require("express");
const { createCanvas, loadImage } = require("canvas");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome Image Service is Online!");
});

app.get("/test", (req, res) => {
  res.send("Route is working!");
});

app.get("/welcome", async (req, res) => {
  try {
    const username = String(req.query.username || "New Member");
    const server = String(req.query.server || "My Server");
    const count = String(req.query.count || "1");
    const avatar = req.query.avatar;

    const canvas = createCanvas(1000, 400);
    const ctx = canvas.getContext("2d");

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1000, 400);
    gradient.addColorStop(0, "#080b18");
    gradient.addColorStop(0.5, "#102c50");
    gradient.addColorStop(1, "#006d91");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 400);

    // Glowing corner accents
    ctx.strokeStyle = "#38caff";
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, 976, 376);

    // Avatar
    if (typeof avatar === "string" &&
        /^https:\/\/\S+$/i.test(avatar)) {
      try {
        const image = await loadImage(avatar);
        ctx.save();
        ctx.beginPath();
        ctx.arc(170, 200, 92, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(image, 78, 108, 184, 184);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(170, 200, 96, 0, Math.PI * 2);
        ctx.strokeStyle = "#38caff";
        ctx.lineWidth = 5;
        ctx.stroke();
      } catch (e) {
        console.error("Avatar loading failed:", e.message);
      }
    }

    // Welcome text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 54px Sans";
    ctx.fillText("WELCOME!", 310, 105);

    ctx.fillStyle = "#53d5ff";
    ctx.fillRect(310, 128, 570, 3);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px Sans";
    ctx.fillText(username.slice(0, 25), 310, 190);

    ctx.font = "28px Sans";
    ctx.fillText(server.slice(0, 35), 310, 250);
    ctx.fillText("Member #" + count.slice(0, 12), 310, 305);

    ctx.fillStyle = "#bceeff";
    ctx.font = "20px Sans";
    ctx.fillText("WELCOME TO THE COMMUNITY", 310, 355);

    // Send PNG image
    const buffer = canvas.toBuffer("image/png");
    res.status(200);
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "no-store");
    res.set("Content-Length", String(buffer.length));
    res.end(buffer);
  } catch (error) {
    console.error("Welcome image error:", error);
    if (!res.headersSent) {
      res.status(500).type("text").send(
        "Image generation failed: " + error.message
      );
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Welcome image service running on port " + port);
});
