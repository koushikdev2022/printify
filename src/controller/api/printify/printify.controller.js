
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

           
            let imageId;
            
            if (imagePath) {
         
            if (!fs.existsSync(imagePath)) {
                return res.status(400).json({
                status: false,
                message: 'Local image file not found'
                });
            }
            
           
            const fileBuffer = fs.readFileSync(imagePath);
            const base64Image = fileBuffer.toString('base64');
            const fileName = path.basename(imagePath);
            
           
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
         
            const fileName = imageLink.split('/').pop() || 'image.png';
            
           
            const uploadResponse = await axios.post(
                'https://api.printify.com/v1/uploads/images.json',
                {
                file_name: fileName, 
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

   
            if (req.body.includeSafetyInfo) {
            productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
            }

        
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

// exports.saveProductSave = async (req, res) => {
//     try {
//       const printifyToken = process.env.PRINTIFY_API_TOKEN;
      
//       // Extract and validate request data
//       const {
//         shopId,
//         title,
//         description,
//         imagePaths = [],
//         imageLinks = [],
//         tags = []
//       } = req.body;
  
//       console.log("Request body:", JSON.stringify(req.body, null, 2));
  
//       // Basic validation
//       if (!shopId) {
//         return res.status(400).json({
//           status: false,
//           message: 'Shop ID is required'
//         });
//       }
  
//       const uploadedImageIds = [];
  
//       // Process images from local paths
//       for (const imagePath of imagePaths) {
//         try {
//           if (!fs.existsSync(imagePath)) {
//             console.error(`Image file not found: ${imagePath}`);
//             continue;
//           }
  
//           const fileBuffer = fs.readFileSync(imagePath);
//           const base64Image = fileBuffer.toString('base64');
//           const fileName = path.basename(imagePath);
  
//           console.log(`Uploading image from path: ${fileName}`);
          
//           const uploadResponse = await axios.post(
//             'https://api.printify.com/v1/uploads/images.json',
//             {
//               file_name: fileName,
//               contents: base64Image
//             },
//             {
//               headers: {
//                 'Authorization': `Bearer ${printifyToken}`,
//                 'Content-Type': 'application/json'
//               }
//             }
//           );
  
//           console.log("Image upload response:", JSON.stringify(uploadResponse.data, null, 2));
  
//           if (uploadResponse.data && uploadResponse.data.id) {
//             uploadedImageIds.push(uploadResponse.data.id);
//             console.log(`Successfully uploaded image ID: ${uploadResponse.data.id}`);
//           }
//         } catch (err) {
//           console.error(`Error uploading image from path: ${err.message}`);
//           if (err.response && err.response.data) {
//             console.error("API error details:", JSON.stringify(err.response.data, null, 2));
//           }
//         }
//       }
  
//       // Process images from URLs
//       for (const imageLink of imageLinks) {
//         try {
//           const fileName = imageLink.split('/').pop() || 'image.png';
          
//           console.log(`Uploading image from URL: ${imageLink}`);
          
//           const uploadResponse = await axios.post(
//             'https://api.printify.com/v1/uploads/images.json',
//             {
//               file_name: fileName,
//               url: imageLink
//             },
//             {
//               headers: {
//                 'Authorization': `Bearer ${printifyToken}`,
//                 'Content-Type': 'application/json'
//               }
//             }
//           );
  
//           console.log("Image upload response:", JSON.stringify(uploadResponse.data, null, 2));
  
//           if (uploadResponse.data && uploadResponse.data.id) {
//             uploadedImageIds.push(uploadResponse.data.id);
//             console.log(`Successfully uploaded image ID: ${uploadResponse.data.id}`);
//           }
//         } catch (err) {
//           console.error(`Error uploading image from URL: ${err.message}`);
//           if (err.response && err.response.data) {
//             console.error("API error details:", JSON.stringify(err.response.data, null, 2));
//           }
//         }
//       }
  
//       // Check if we have any images
//       if (uploadedImageIds.length === 0) {
//         return res.status(400).json({
//           status: false,
//           message: 'No images were successfully uploaded'
//         });
//       }
  
//       // Create a minimalist product payload that focuses only on required fields
//       const productPayload = {
//         title: title || "Untitled Product",
//         description: description || "No description provided",
//         tags: Array.isArray(tags) && tags.length > 0 ? tags : ["product"],
//         blueprint_id: 384,
//         print_provider_id: 1,
//         variants: [
//           {
//             id: 45740,
//             price: 4000,
//             is_enabled: true
//           },
//           {
//             id: 45742,
//             price: 4000,
//             is_enabled: true
//           }
//         ],
//         images: uploadedImageIds.map(id => ({ id })),
//         print_areas: [
//           {
//             variant_ids: [45740, 45742],
//             placeholders: [
//               {
//                 position: "front",
//                 images: uploadedImageIds.map(id => ({
//                   id: id,
//                   x: 0.5,
//                   y: 0.5,
//                   scale: 1,
//                   angle: 0
//                 }))
//               }
//             ]
//           }
//         ]
//       };
  
//       // Log the payload for debugging
//       console.log("Product payload:", JSON.stringify(productPayload, null, 2));
  
//       // Create the product
//       console.log(`Creating product in shop ${shopId}...`);
//       const createResponse = await axios.post(
//         `https://api.printify.com/v1/shops/${shopId}/products.json`,
//         productPayload,
//         {
//           headers: {
//             'Authorization': `Bearer ${printifyToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       console.log("Product creation response:", JSON.stringify(createResponse.data, null, 2));
  
//       return res.status(200).json({
//         status: true,
//         message: 'Product created successfully',
//         data: createResponse.data
//       });
  
//     } catch (err) {
//       console.error("Error in saveProduct:", err.message);
       
//       // Log detailed error information
//       if (err.response) {
//         console.error("Error status:", err.response.status);
//         console.error("Error data:", JSON.stringify(err.response.data, null, 2));
//         console.error("Error headers:", JSON.stringify(err.response.headers, null, 2));
//       } else if (err.request) {
//         console.error("No response received:", err.request);
//       }
      
//       return res.status(500).json({
//         status: false,
//         message: err.response?.data?.message || err.message,
//         error: err.response?.data || { message: err.message }
//       });
//     }
//   };

exports.saveProductSave = async (req, res) => {
    try {
      const printifyToken = process.env.PRINTIFY_API_TOKEN;
  
      // Extract and validate request data
      const {
        shopId,
        title,
        description,
        imagePaths = [],
        imageLinks = [],
        tags = [],
        categoryId,
        printProvider,
        variants = []  // Extract variants from the request body
      } = req.body;
  
      console.log("Request body:", JSON.stringify(req.body, null, 2));
  
      // Basic validation
      if (!shopId) {
        return res.status(400).json({
          status: false,
          message: 'Shop ID is required'
        });
      }
  
      if (variants.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'At least one variant is required'
        });
      }
  
      const uploadedImageIds = [];
  
      // Process images from local paths
      for (const imagePath of imagePaths) {
        try {
          if (!fs.existsSync(imagePath)) {
            console.error(`Image file not found: ${imagePath}`);
            continue;
          }
  
          const fileBuffer = fs.readFileSync(imagePath);
          const base64Image = fileBuffer.toString('base64');
          const fileName = path.basename(imagePath);
  
          console.log(`Uploading image from path: ${fileName}`);
          
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
  
          console.log("Image upload response:", JSON.stringify(uploadResponse.data, null, 2));
  
          if (uploadResponse.data && uploadResponse.data.id) {
            uploadedImageIds.push(uploadResponse.data.id);
            console.log(`Successfully uploaded image ID: ${uploadResponse.data.id}`);
          }
        } catch (err) {
          console.error(`Error uploading image from path: ${err.message}`);
          if (err.response && err.response.data) {
            console.error("API error details:", JSON.stringify(err.response.data, null, 2));
          }
        }
      }
  
      // Process images from URLs
      for (const imageLink of imageLinks) {
        try {
          const fileName = imageLink.split('/').pop() || 'image.png';
          
          console.log(`Uploading image from URL: ${imageLink}`);
          
          const uploadResponse = await axios.post(
            'https://api.printify.com/v1/uploads/images.json',
            {
              file_name: fileName,
              url: imageLink
            },
            {
              headers: {
                'Authorization': `Bearer ${printifyToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
  
          console.log("Image upload response:", JSON.stringify(uploadResponse.data, null, 2));
  
          if (uploadResponse.data && uploadResponse.data.id) {
            uploadedImageIds.push(uploadResponse.data.id);
            console.log(`Successfully uploaded image ID: ${uploadResponse.data.id}`);
          }
        } catch (err) {
          console.error(`Error uploading image from URL: ${err.message}`);
          if (err.response && err.response.data) {
            console.error("API error details:", JSON.stringify(err.response.data, null, 2));
          }
        }
      }
  
      // Check if we have any images
      if (uploadedImageIds.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'No images were successfully uploaded'
        });
      }
  
      // Create a minimalist product payload that focuses only on required fields
      const productPayload = {
        title: title || "Untitled Product",
        description: description || "No description provided",
        tags: Array.isArray(tags) && tags.length > 0 ? tags : ["product"],
        blueprint_id: categoryId,
        print_provider_id: printProvider,
        variants: variants.map(variant => ({
          id: variant.id,         // Dynamic variant ID
          price: variant.price,   // Dynamic variant price
          is_enabled: variant.is_enabled !== undefined ? variant.is_enabled : true  // Default to true if not provided
        })),
        images: uploadedImageIds.map(id => ({ id })),
        print_areas: [
          {
            variant_ids: variants.map(variant => variant.id),  // Use the variant IDs dynamically
            placeholders: [
              {
                position: "front",
                images: uploadedImageIds.map(id => ({
                  id: id,
                  x: 0.5,
                  y: 0.5,
                  scale: 1,
                  angle: 0
                }))
              }
            ]
          }
        ]
      };
  
      // Log the payload for debugging
      console.log("Product payload:", JSON.stringify(productPayload, null, 2));
  
      // Create the product
      console.log(`Creating product in shop ${shopId}...`);
      const createResponse = await axios.post(
        `https://api.printify.com/v1/shops/${shopId}/products.json`,
        productPayload,
        {
          headers: {
            'Authorization': `Bearer ${printifyToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log("Product creation response:", JSON.stringify(createResponse.data, null, 2));
  
      return res.status(200).json({
        status: true,
        message: 'Product created successfully',
        data: createResponse.data
      });
  
    } catch (err) {
      console.error("Error in saveProduct:", err.message);
  
      // Log detailed error information
      if (err.response) {
        console.error("Error status:", err.response.status);
        console.error("Error data:", JSON.stringify(err.response.data, null, 2));
        console.error("Error headers:", JSON.stringify(err.response.headers, null, 2));
      } else if (err.request) {
        console.error("No response received:", err.request);
      }
  
      return res.status(400).json({
        status: false,
        message: err.response?.data?.message || err.message,
        error: err.response?.data || { message: err.message },
        status_code:400
      });
    }
  };
  
exports.category = async(req,res)=>{
    try{
        const printifyToken = process.env.PRINTIFY_API_TOKEN;
        const response = await axios.get('https://api.printify.com/v1/catalog/blueprints.json', {
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



exports.varient = async (req, res) => {
    try {
      const blueprint_id = req?.params?.id;
      const print_provider_id = req?.params?.pid;
      const printifyToken = process.env.PRINTIFY_API_TOKEN;
  
      const response = await axios.get(
        `https://api.printify.com/v1/catalog/blueprints/${blueprint_id}/print_providers/${print_provider_id}/variants.json`,
        {
          headers: {
            Authorization: `Bearer ${printifyToken}`
          }
        }
      );
  
      return res.status(200).json({
        message: "Variants found",
        status: true,
        status_code: 200,
        data: response.data
      });
    } catch (err) {
      console.log("Error fetching variants: ", err?.response?.data || err.message);
      const status = err?.response?.status || 400;
      const msg = err?.response?.data?.message || "Internal Server Error";
      return res.status(status).json({
        msg,
        status: false,
        status_code: status
      });
    }
  };
  

  exports.provider = async (req, res) => {
    try {
        const blueprint_id = req.params.id;
        const printifyToken = process.env.PRINTIFY_API_TOKEN;
    
        const response = await axios.get(
          `https://api.printify.com/v1/catalog/blueprints/${blueprint_id}/print_providers.json`,
          {
            headers: {
              Authorization: `Bearer ${printifyToken}`
            }
          }
        );
    
        return res.status(200).json({
          status: true,
          message: 'Print providers fetched successfully',
          data: response.data
        });
      } catch (err) {
        console.error("Error fetching print providers:", err?.response?.data || err.message);
        const status = err?.response?.status || 400;
        return res.status(status).json({
          status: false,
          message: err?.response?.data?.message || "Internal Server Error",
          status_code:400
        });
      }
  };
