require("dotenv").config();
const { exec } = require("child_process");
const path = require("path");
const { Character } = require("../../../../models"); 

  process.on("message", async (data) => {
    try {
      const { imageUrl } = data;
      console.log("Child process started for Fal AI:", imageUrl);
  
      console.log(process.env.FAL_KEY);
      const { fal } = await import("@fal-ai/client");
  
      if (!process.env.FAL_KEY) {
        console.error("Fal AI API Key is missing! Set FAL_API_KEY in .env file.");
        return;
      }
  
      fal.config({ api_key: process.env.FAL_KEY });
      console.log(`${process.env.SERVER_URL}/static/fal/smile.mp4`);
  
      // **Only One Try Block**
      try {
        const result = await fal.subscribe("fal-ai/live-portrait", {
          input: {
            video_url: `${process.env.SERVER_URL}/static/fal/smile.mp4`,
            image_url: imageUrl,
          },
        });
  
        // **Check if Fal AI returned a valid response**
        if (!result || !result.data || !result.data.video || !result.data.video.url) {
          console.error(" Fal AI did not return a valid response.");
          return;
        }
  
        console.log("Fal AI Response:", JSON.stringify(result.data, null, 2));
  
        const generatedVideoUrl = result.data.video.url;
  
        // **Save video in public/uploads/videos**
        const videoFileName = `video_${Date.now()}.mp4`;
        const videoFilePath = path.join(__dirname, "../../../../../public/uploads/videos", videoFileName);
  
        // **Ensure the directory exists**
        ensureDirectoryExistence(videoFilePath);
  
        // **Download Video**
        downloadVideo(generatedVideoUrl, videoFilePath, data.id);
  
      } catch (err) {
        console.error("Full Fal AI Error:", JSON.stringify(err.body || err, null, 2));
      }
  
    } catch (err) {
      console.error("Error in Fal AI processing:", err);
    }
  });
  
  // **Ensure Directory Exists Before Downloading**
  const fs = require("fs");
  
  const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
      console.log(`Created missing directory: ${dirname}`);
    }
  };
  
  
  const downloadVideo = (videoUrl, savePath, id) => {
    console.log(`Downloading video from: ${videoUrl} to ${savePath}`);
  
    ensureDirectoryExistence(savePath);
  
    exec(`curl -o ${savePath} ${videoUrl}`, (error, stdout, stderr) => {
      if (error) {
        console.error(` Download error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Download stderr: ${stderr}`);
      }
  
      console.log(`Video saved at: ${savePath}`);
  
      // Extract path after "public/"
      const relativePath = savePath.split("/public/")[1];
  
      if (relativePath) {
        // Update database after ensuring file exists
        fs.access(savePath, fs.constants.F_OK, async (err) => {
          if (err) {
            console.error("File not found for database update.");
            return;
          }
  
          try {
            await Character.update(
              { video_url: `/${relativePath}` }, // Add leading slash for URL format
              { where: { id: id } }
            );
            console.log("Database updated with video URL:", `/${relativePath}`);
          } catch (dbError) {
            console.error("Error updating database:", dbError);
          }
        });
      } else {
        console.error("Could not extract the relative path for database update.");
      }
    });
  };
  
  


  
