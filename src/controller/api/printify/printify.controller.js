
const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');

exports.store = async(req,res)=>{
    try{
        const printifyToken = process.env.PRINTIFY_API_TOKEN;
        const response = await axios.get('https://api.printify.com/v1/shops.json', {
            headers: {
              Authorization: `Bearer ${printifyToken}`
            }
          });
      
          return res.status(200).json({
            message:"store found",
            status:true,
            status_code:200,
            data:response.data
          });
    }catch (err) {
        console.log("Error in login authController: ", err);
        const status = err?.status || 400;
        const msg = err?.message || "Internal Server Error";
        return res.status(status).json({
            msg,
            status: false,
            status_code: status
        })
    }
}




exports.saveProduct = async (req, res) => {
  try {
    const printifyToken = process.env.PRINTIFY_API_TOKEN;
    const { shopId, title, description, imagePath, imageLink } = req.body;

    // Step 2: Handle image upload based on whether we have a URL or local file
    let imageId;
    
    if (imagePath) {
      // Local file upload
      if (!fs.existsSync(imagePath)) {
        return res.status(400).json({
          status: false,
          message: 'Local image file not found'
        });
      }
      
      // Read file as base64
      const fileBuffer = fs.readFileSync(imagePath);
      const base64Image = fileBuffer.toString('base64');
      const fileName = path.basename(imagePath);
      
      // Upload using Printify's image upload endpoint with file contents
      const uploadResponse = await axios.post(
        'https://api.printify.com/v1/uploads/images.json',
        {
          file_name: fileName,
          contents: base64Image
        },
        {
          headers: {
            'Authorization': `Bearer ${printifyToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Image uploaded successfully:", uploadResponse.data);
      imageId = uploadResponse.data.id;
      
    } else if (imageLink) {
      // Extract a filename from the URL
      const fileName = imageLink.split('/').pop() || 'image.png';
      
      // Remote URL upload - use Printify's URL upload option
      const uploadResponse = await axios.post(
        'https://api.printify.com/v1/uploads/images.json',
        {
          file_name: fileName, // Add file_name parameter even for URL uploads
          url: imageLink
        },
        {
          headers: {
            'Authorization': `Bearer ${printifyToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Image uploaded via URL successfully:", uploadResponse.data);
      imageId = uploadResponse.data.id;
      
    } else {
      return res.status(400).json({
        status: false,
        message: 'Either imagePath or imageLink is required'
      });
    }

    // Step 3: Upload the image to Printify
    // Note: This step is now handled in the previous step

    // Step 4: Prepare the product data with the uploaded image
    const productData = {
      title: title || "Test product",
      description: description || "Product description",
      blueprint_id: 384,
      print_provider_id: 1,
      variants: [
        { id: 45740, price: 400, is_enabled: true },
        { id: 45742, price: 400, is_enabled: true },
        { id: 45744, price: 400, is_enabled: false },
        { id: 45746, price: 400, is_enabled: false }
      ],
      print_areas: [
        {
          variant_ids: [45740, 45742, 45744, 45746],
          placeholders: [
            {
              position: "front",
              images: [
                {
                  id: imageId,
                  x: 0.5,
                  y: 0.5,
                  scale: 1,
                  angle: 0
                }
              ]
            }
          ]
        }
      ],
      is_locked: false,
      is_enabled: true
    };

    // Add safety information if needed
    if (req.body.includeSafetyInfo) {
      productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
    }

    // Step 5: Create the product on Printify
    const response = await axios.post(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${printifyToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Product created successfully:", response.data);

    // Step 6: Publish the product if required
    if (req.body.publishProduct) {
      await axios.post(
        `https://api.printify.com/v1/shops/${shopId}/products/${response.data.id}/publish.json`,
        { 
          "publish": true,
          "external": {
            "handle": response.data.id,
            "shop_id": shopId
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${printifyToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Product published successfully");
    }

    return res.status(200).json({
      status: true,
      message: 'Product created successfully',
      data: response.data
    });
  } catch (err) {
    console.error("Error in saveProduct:", err.response?.data || err.message);

    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Internal Server Error";

    return res.status(status).json({
      status: false,
      message,
      error: err.response?.data || err.message
    });
  }
};