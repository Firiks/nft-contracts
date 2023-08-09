const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Load environment variables
const pinataApiKey = process.env.PINATA_API_KEY || "";
const pinataApiSecret = process.env.PINATA_API_SECRET || "";
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

/**
 * Uploads images to pinata
 */
async function storeImages(imagesFilePath) {
  const fullImagesPath = path.resolve(imagesFilePath);

  // Get all the files in the images folder
  const files = fs.readdirSync(fullImagesPath).filter((file) => file.includes(".png"));

  let responses = [];
  console.log("Uploading to IPFS");

  // Iterate over the files and upload them to IPFS
  for (const fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`);
    const options = {
      pinataMetadata: {
        name: files[fileIndex],
      },
    };

    try {
      await pinata
        .pinFileToIPFS(readableStreamForFile, options)
        .then((result) => {
          responses.push(result);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
  }

  return { responses, files };
}

async function storeTokenUriMetadata(metadata) {
  const options = {
    pinataMetadata: {
      name: metadata.name,
    },
  }
  try {
    const response = await pinata.pinJSONToIPFS(metadata, options);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
}

module.exports = { storeImages, storeTokenUriMetadata }