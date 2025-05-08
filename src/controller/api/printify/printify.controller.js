
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
//         tags = [],
//         categoryId,
//         printProvider,
//         variants = []  // Extract variants from the request body
//       } = req.body;
  
//       console.log("Request body:", JSON.stringify(req.body, null, 2));
  
//       // Basic validation
//       if (!shopId) {
//         return res.status(400).json({
//           status: false,
//           message: 'Shop ID is required'
//         });
//       }
  
//       if (variants.length === 0) {
//         return res.status(400).json({
//           status: false,
//           message: 'At least one variant is required'
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
//         blueprint_id: categoryId,
//         print_provider_id: printProvider,
//         variants: variants.map(variant => ({
//           id: variant.id,         // Dynamic variant ID
//           price: variant.price,   // Dynamic variant price
//           is_enabled: variant.is_enabled !== undefined ? variant.is_enabled : true  // Default to true if not provided
//         })),
//         images: uploadedImageIds.map(id => ({ id })),
//         print_areas: [
//           {
//             variant_ids: variants.map(variant => variant.id),  // Use the variant IDs dynamically
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
  
//       return res.status(400).json({
//         status: false,
//         message: err.response?.data?.message || err.message,
//         error: err.response?.data || { message: err.message },
//         status_code:400
//       });
//     }
//   };


//chat gpt worg res but prod pub
// exports.saveProductSave = async (req, res) => {
//   try {
//     const printifyToken = process.env.PRINTIFY_API_TOKEN;
    
//     const {
//       shopId,
//       title,
//       description,
//       printProvider,
//       imageLinks = [],  // Ensure that imageLinks is passed as an array
//       variants = [],  // Ensure variants are passed as an array
//       tags = [],  // Ensure tags are passed
//       categoryId,
//       includeSafetyInfo = false,
//       publishProduct = false
//     } = req.body;

//     // Validate required fields
//     if (!shopId || !categoryId || !printProvider || !title || !description || !variants.length || !imageLinks.length || !tags.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'Missing required fields: shopId, categoryId, printProvider, title, description, variants, images, and tags',
//       });
//     }

//     const uploadedImageIds = [];

//     // Upload URL images
//     for (const imageLink of imageLinks) {
//       const fileName = imageLink.split('/').pop() || 'image.png';
      
//       try {
//         const uploadRes = await axios.post(
//           'https://api.printify.com/v1/uploads/images.json',
//           { file_name: fileName, url: imageLink },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         if (uploadRes.data?.id) uploadedImageIds.push(uploadRes.data.id);
//       } catch (e) {
//         console.error(`Upload failed for URL ${imageLink}`, e.response?.data || e.message);
//       }
//     }

//     if (!uploadedImageIds.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'No images were successfully uploaded',
//       });
//     }

//     // Build product payload
//     const productData = {
//       title,
//       description,
//       blueprint_id: parseInt(categoryId),
//       print_provider_id: parseInt(printProvider),
//       variants: variants.map(v => ({
//         id: parseInt(v.id),
//         price: parseInt(v.price),
//         is_enabled: v.is_enabled ?? true,
//       })),
//       images: uploadedImageIds.map(id => ({ id })),
//       print_areas: [
//         {
//           variant_ids: variants.map(v => parseInt(v.id)),
//           placeholders: [
//             {
//               position: "front",
//               images: uploadedImageIds.map((id, index) => ({
//                 id,
//                 x: 0.5,
//                 y: 0.5,
//                 scale: 1,
//                 angle: 0
//               }))
//             }
//           ]
//         }
//       ],
//       tags: tags.length ? tags : ['product'],
//       options: [],
//       is_locked: false,
//     };

//     if (includeSafetyInfo) {
//       productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
//     }

//     const createResponse = await axios.post(
//       `https://api.printify.com/v1/shops/${shopId}/products.json`,
//       productData,
//       {
//         headers: {
//           Authorization: `Bearer ${printifyToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // Publish product if requested
//     if (publishProduct && createResponse.data?.id) {
//       await axios.post(
//         `https://api.printify.com/v1/shops/${shopId}/products/${createResponse.data.id}/publish.json`,
//         {
//           publish: true,
//           external: {
//             handle: createResponse.data.id,
//             shop_id: shopId,
//           },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${printifyToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     }

//     return res.status(200).json({
//       status: true,
//       message: 'Product created successfully',
//       data: createResponse.data,
//     });
//   } catch (err) {
//     console.error("Error in saveProduct:", err.message);
//     if (err.response) {
//       return res.status(err.response.status || 400).json({
//         status: false,
//         message: err.response.data?.message || err.message,
//         error: err.response.data || { message: err.message },
//       });
//     }
//     return res.status(400).json({
//       status: false,
//       message: err.message,
//       error: { message: err.message },
//     });
//   }
// };


//perflex working
// exports.saveProductSave = async (req, res) => {
//   try {
//     const printifyToken = process.env.PRINTIFY_API_TOKEN;

//     const {
//       shopId,
//       title,
//       description,
//       printProvider,
//       imageLinks = [],
//       variants = [],
//       tags = [],
//       categoryId,
//       includeSafetyInfo = false,
//       publishProduct = false
//     } = req.body;

//     // Validate required fields
//     if (!shopId || !categoryId || !printProvider || !title || !description || !variants.length || !imageLinks.length || !tags.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'Missing required fields: shopId, categoryId, printProvider, title, description, variants, images, and tags',
//       });
//     }

//     // 1. Upload images to Printify and collect their IDs
//     const uploadedImageIds = [];
//     for (const imageLink of imageLinks) {
//       const fileName = imageLink.split('/').pop() || 'image.png';
//       try {
//         const uploadRes = await axios.post(
//           'https://api.printify.com/v1/uploads/images.json',
//           { file_name: fileName, url: imageLink },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         if (uploadRes.data?.id) uploadedImageIds.push(uploadRes.data.id);
//       } catch (e) {
//         console.error(`Upload failed for URL ${imageLink}`, e.response?.data || e.message);
//       }
//     }

//     if (!uploadedImageIds.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'No images were successfully uploaded',
//       });
//     }

//     // 2. Build product payload
//     const variantIds = variants.map(v => parseInt(v.id));
//     const productData = {
//       title,
//       description,
//       blueprint_id: parseInt(categoryId),
//       print_provider_id: parseInt(printProvider),
//       variants: variants.map(v => ({
//         id: parseInt(v.id),
//         price: parseInt(v.price),
//         is_enabled: v.is_enabled ?? true,
//       })),
//       images: uploadedImageIds.map(id => ({ id })),
//       print_areas: [
//         {
//           variant_ids: variantIds,
//           placeholders: [
//             {
//               position: "front",
//               images: uploadedImageIds.map(id => ({
//                 id,
//                 x: 0.5,
//                 y: 0.5,
//                 scale: 1,
//                 angle: 0
//               }))
//             }
//           ]
//         }
//       ],
//       tags: tags.length ? tags : ['product'],
//       options: [],
//       is_locked: false,
//     };

//     if (includeSafetyInfo) {
//       productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
//     }

//     // 3. Create product
//     const createResponse = await axios.post(
//       `https://api.printify.com/v1/shops/${shopId}/products.json`,
//       productData,
//       {
//         headers: {
//           Authorization: `Bearer ${printifyToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // 4. Publish product if requested
//     if (publishProduct && createResponse.data?.id) {
//       await axios.post(
//         `https://api.printify.com/v1/shops/${shopId}/products/${createResponse.data.id}/publish.json`,
//         {
//           title: true,
//           description: true,
//           images: true,
//           variants: true,
//           tags: true
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${printifyToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     }

//     return res.status(200).json({
//       status: true,
//       message: 'Product created successfully',
//       data: createResponse.data,
//     });
//   } catch (err) {
//     console.error("Error in saveProductSave:", err.message);
  
//     // Check for Printify "not connected to sales channel" error
//     if (
//       err.response &&
//       err.response.data &&
//       err.response.data.error &&
//       err.response.data.error.errors &&
//       err.response.data.error.errors.reason &&
//       err.response.data.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       // Return the original error object, but with status 200 and status: true
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: err.response.data.error.errors.reason,
//         error: err.response.data
//       });
//     }
  
//     // All other errors: keep your normal error handling
//     if (err.response) {
//       return res.status(err.response.status || 400).json({
//         status: false,
//         message: err.response.data?.message || err.message,
//         error: err.response.data || { message: err.message },
//       });
//     }
//     return res.status(400).json({
//       status: false,
//       message: err.message,
//       error: { message: err.message },
//     });
//   }
  
// }

//perflex fdinal

// exports.saveProductSave = async (req, res) => {
//   let alreadySent = false;
//   function safeSend(payload) {
//     if (alreadySent) return;
//     alreadySent = true;

//     // Final check for Printify's not-connected error
//     if (
//       payload &&
//       payload.error &&
//       payload.error.errors &&
//       payload.error.errors.reason &&
//       payload.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: payload.error.errors.reason,
//         error: payload.error,
//         status_code:200
//       });
//     }

//     // If payload is the full response object, check .body
//     if (
//       payload &&
//       payload.body &&
//       payload.body.error &&
//       payload.body.error.errors &&
//       payload.body.error.errors.reason &&
//       payload.body.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: payload.body.error.errors.reason,
//         error: payload.body.error,
//         status_code:200
//       });
//     }

//     // Otherwise, send as-is
//     return res.json(payload);
//   }

//   try {
//     const printifyToken = process.env.PRINTIFY_API_TOKEN;

//     const {
//       shopId,
//       title,
//       description,
//       printProvider,
//       imageLinks = [],
//       variants = [],
//       tags = [],
//       categoryId,
//       includeSafetyInfo = false,
//       publishProduct = false
//     } = req.body;

//     if (!shopId || !categoryId || !printProvider || !title || !description || !variants.length || !imageLinks.length || !tags.length) {
//       return safeSend({
//         status: false,
//         message: 'Missing required fields: shopId, categoryId, printProvider, title, description, variants, images, and tags',
//       });
//     }

//     // Upload images
//     const uploadedImageIds = [];
//     for (const imageLink of imageLinks) {
//       const fileName = imageLink.split('/').pop() || 'image.png';
//       try {
//         const uploadRes = await axios.post(
//           'https://api.printify.com/v1/uploads/images.json',
//           { file_name: fileName, url: imageLink },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         if (uploadRes.data?.id) uploadedImageIds.push(uploadRes.data.id);
//       } catch (e) {
//         console.error(`Upload failed for URL ${imageLink}`, e.response?.data || e.message);
//       }
//     }

//     if (!uploadedImageIds.length) {
//       return safeSend({
//         status: false,
//         message: 'No images were successfully uploaded',
//       });
//     }

//     // Build product payload
//     const variantIds = variants.map(v => parseInt(v.id));
//     // const productData = {
//     //   title,
//     //   description,
//     //   blueprint_id: parseInt(categoryId),
//     //   print_provider_id: parseInt(printProvider),
//     //   variants: variants.map(v => ({
//     //     id: parseInt(v.id),
//     //     price: parseInt(v.price),
//     //     is_enabled: v.is_enabled ?? true,
//     //   })),
//     //   images: uploadedImageIds.map(id => ({ id })),
//     //   print_areas: [
//     //     {
//     //       variant_ids: variantIds,
//     //       placeholders: [
//     //         {
//     //           position: "front",
//     //           images: uploadedImageIds.map(id => ({
//     //             id,
//     //             x: 0.5,
//     //             y: 0.5,
//     //             scale: 1,
//     //             angle: 0
//     //           }))
//     //         }
//     //       ]
//     //     }
//     //   ],
//     //   tags: tags.length ? tags : ['product'],
//     //   options: [],
//     //   is_locked: false,
//     // };
//     // Example variant with price, size, and custom fields
//     const productData = {
//       title,
//       description,
//       blueprint_id: parseInt(categoryId),
//       print_provider_id: parseInt(printProvider),
//       variants: variants.map(v => ({
//         id: parseInt(v.id),
//         price: parseInt(v.price),
//         is_enabled: v.is_enabled ?? true,
//         options: [
//           {
//             name: "Size", 
//             value: v.size || "default_size", // You can set size as per variant
//           },
//           {
//             name: "Color", 
//             value: v.color || "default_color", // Ensure color value is part of variant
//           },
//         ],
//         inventory: v.inventory || 100, // Set the inventory quantity (static or dynamic)
//         sku: v.sku || `sku_${v.id}`, // You can set SKU based on your system
//         retail_price: v.retail_price || `USD ${v.price}`, // Retail price
//         profit: v.profit || 13.73, // Set static profit if needed
//         profit_margin: v.profit_margin || ((v.price - v.profit) / v.price) * 100, // Calculate margin
//         production_cost: v.production_cost || 10, // Static production cost
//         buyer_shipping_cost: v.shipping_cost || 5, // Set shipping cost
//         shipping_option: v.shipping_option || "Standard", // Set shipping option
//       })),
//       images: uploadedImageIds.map(id => ({ id })),
//       print_areas: [
//         {
//           variant_ids: variantIds,
//           placeholders: [
//             {
//               position: "front",
//               images: uploadedImageIds.map(id => ({
//                 id,
//                 x: 0.5,
//                 y: 0.5,
//                 scale: 1,
//                 angle: 0,
//               })),
//             },
//           ],
//         },
//       ],
//       tags: tags.length ? tags : ['product'],
//       options: [], // Add additional options if needed
//       is_locked: false,
//     };
    
// // Proceed with creating the product as before...

//     if (includeSafetyInfo) {
//       productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
//     }

//     // Create product
//     const createResponse = await axios.post(
//       `https://api.printify.com/v1/shops/${shopId}/products.json`,
//       productData,
//       {
//         headers: {
//           Authorization: `Bearer ${printifyToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // Publish product if requested
//     let publishResponse = null;
//     if (publishProduct && createResponse.data?.id) {
//       try {
//         publishResponse = await axios.post(
//           `https://api.printify.com/v1/shops/${shopId}/products/${createResponse.data.id}/publish.json`,
//           {
//             title: true,
//             description: true,
//             images: true,
//             variants: true,
//             tags: true
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       } catch (err) {
//         // If error is thrown, check for "not connected to sales channel"
//         if (
//           err.response &&
//           err.response.data &&
//           err.response.data.error &&
//           err.response.data.error.errors &&
//           err.response.data.error.errors.reason &&
//           err.response.data.error.errors.reason.includes('not connected to sales channel')
//         ) {
//           return safeSend({
//             status: true,
//             message: "Product created as draft in Printify (shop not connected to sales channel).",
//             warning: err.response.data.error.errors.reason,
//             error: err.response.data.error
//           });
//         }
//         return safeSend({
//           status: false,
//           message: err.response?.data?.message || err.message,
//           error: err.response?.data || { message: err.message },
//         });
//       }
//     }

//     // Check for "not connected to sales channel" in publishResponse body
//     if (
//       publishResponse &&
//       publishResponse.data &&
//       publishResponse.data.error &&
//       publishResponse.data.error.errors &&
//       publishResponse.data.error.errors.reason &&
//       publishResponse.data.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return safeSend({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: publishResponse.data.error.errors.reason,
//         error: publishResponse.data.error,
//         status_code:200
//       });
//     }

//     // Success response
//     return safeSend({
//       status: true,
//       message: 'Product created successfully',
//       data: createResponse.data,
//       status_code:200
//     });

//   } catch (err) {
//     console.error("Error in saveProductSave:", err.message);

//     // Fallback: Check for thrown error in catch block
//     if (
//       err.response &&
//       err.response.data &&
//       err.response.data.error &&
//       err.response.data.error.errors &&
//       err.response.data.error.errors.reason &&
//       err.response.data.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: err.response.data.error.errors.reason,
//         error: err.response.data.error,
//         status_code:200
//       });
//     }

//     // All other errors
//     if (err.response) {
//       return res.status(err.response.status || 400).json({
//         status: false,
//         message: err.response.data?.message || err.message,
//         error: err.response.data || { message: err.message },
//         status_code:400
//       });
//     }
//     return res.status(400).json({
//       status: false,
//       message: err.message,
//       error: { message: err.message },
//       status_code:400
//     });
//   }
// };














// exports.saveProductSave = async (req, res) => {
// try {
//   const printifyToken = process.env.PRINTIFY_API_TOKEN;
//   const shopifyApiKey = process.env.SHOPIFY_API_KEY;
//   const shopifyApiPassword = process.env.SHOPIFY_API_PASSWORD;
//   const shopifyShopDomain = process.env.SHOPIFY_SHOP_DOMAIN;

//   // Extract and validate request data
//   const {
//     shopId,
//     title,
//     description,
//     imagePaths = [],
//     imageLinks = [],
//     tags = [],
//     categoryId,
//     printProvider,
//     variants = [],
//     shopifyCollectionId = null  // New parameter for Shopify collection ID
//   } = req.body;

//   console.log("Request body:", JSON.stringify(req.body, null, 2));

//   // Basic validation
//   if (!shopId) {
//     return res.status(400).json({
//       status: false,
//       message: 'Shop ID is required'
//     });
//   }

//   if (variants.length === 0) {
//     return res.status(400).json({
//       status: false,
//       message: 'At least one variant is required'
//     });
//   }

//   const uploadedImageIds = [];

//   // Process images from local paths
//   for (const imagePath of imagePaths) {
//     try {
//       if (!fs.existsSync(imagePath)) {
//         console.error(`Image file not found: ${imagePath}`);
//         continue;
//       }

//       const fileBuffer = fs.readFileSync(imagePath);
//       const base64Image = fileBuffer.toString('base64');
//       const fileName = path.basename(imagePath);

//       console.log(`Uploading image from path: ${fileName}`);
      
//       const uploadResponse = await axios.post(
//         'https://api.printify.com/v1/uploads/images.json',
//         {
//           file_name: fileName,
//           contents: base64Image
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${printifyToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log("Image upload response:", JSON.stringify(uploadResponse.data, null, 2));

//       if (uploadResponse.data && uploadResponse.data.id) {
//         uploadedImageIds.push(uploadResponse.data.id);
//         console.log(`Successfully uploaded image ID: ${uploadResponse.data.id}`);
//       }
//     } catch (err) {
//       console.error(`Error uploading image from path: ${err.message}`);
//       if (err.response && err.response.data) {
//         console.error("API error details:", JSON.stringify(err.response.data, null, 2));
//       }
//     }
//   }

//   // Process images from URLs
//   for (const imageLink of imageLinks) {
//     try {
//       const fileName = imageLink.split('/').pop() || 'image.png';
      
//       console.log(`Uploading image from URL: ${imageLink}`);
      
//       const uploadResponse = await axios.post(
//         'https://api.printify.com/v1/uploads/images.json',
//         {
//           file_name: fileName,
//           url: imageLink
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${printifyToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log("Image upload response:", JSON.stringify(uploadResponse.data, null, 2));

//       if (uploadResponse.data && uploadResponse.data.id) {
//         uploadedImageIds.push(uploadResponse.data.id);
//         console.log(`Successfully uploaded image ID: ${uploadResponse.data.id}`);
//       }
//     } catch (err) {
//       console.error(`Error uploading image from URL: ${err.message}`);
//       if (err.response && err.response.data) {
//         console.error("API error details:", JSON.stringify(err.response.data, null, 2));
//       }
//     }
//   }

//   // Check if we have any images
//   if (uploadedImageIds.length === 0) {
//     return res.status(400).json({
//       status: false,
//       message: 'No images were successfully uploaded'
//     });
//   }

//   // Create a minimalist product payload that focuses only on required fields
//   const productPayload = {
//     title: title || "Untitled Product",
//     description: description || "No description provided",
//     tags: Array.isArray(tags) && tags.length > 0 ? tags : ["product"],
//     blueprint_id: categoryId,
//     print_provider_id: printProvider,
//     variants: variants.map(variant => ({
//       id: variant.id,         // Dynamic variant ID
//       price: variant.price,   // Dynamic variant price
//       is_enabled: variant.is_enabled !== undefined ? variant.is_enabled : true  // Default to true if not provided
//     })),
//     images: uploadedImageIds.map(id => ({ id })),
//     print_areas: [
//       {
//         variant_ids: variants.map(variant => variant.id),  // Use the variant IDs dynamically
//         placeholders: [
//           {
//             position: "front",
//             images: uploadedImageIds.map(id => ({
//               id: id,
//               x: 0.5,
//               y: 0.5,
//               scale: 1,
//               angle: 0
//             }))
//           }
//         ]
//       }
//     ]
//   };

//   // Add publish flag if specified
//   if (req.body.publishProduct) {
//     productPayload.publish = true;
//   }

//   // Log the payload for debugging
//   console.log("Product payload:", JSON.stringify(productPayload, null, 2));

//   // Create the product
//   console.log(`Creating product in shop ${shopId}...`);
//   const createResponse = await axios.post(
//     `https://api.printify.com/v1/shops/${shopId}/products.json`,
//     productPayload,
//     {
//       headers: {
//         'Authorization': `Bearer ${printifyToken}`,
//         'Content-Type': 'application/json'
//       }
//     }
//   );

//   console.log("Product creation response:", JSON.stringify(createResponse.data, null, 2));

//   let shopifyProductId = null;
//   let addedToCollection = false;

//   // If product was published to Shopify and a collection ID was provided,
//   // get the Shopify product ID and add it to the collection
//   if (shopifyCollectionId && createResponse.data && createResponse.data.id) {
//     try {
//       // Step 1: Get the created product details from Printify to find its Shopify ID
//       const printifyProductId = createResponse.data.id;
      
//       // Add a small delay to ensure Printify has time to sync with Shopify
//       console.log("Waiting for Printify to sync with Shopify...");
//       await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay
      
//       // Step 2: Get the Printify product to find its Shopify ID
//       const productDetails = await axios.get(
//         `https://api.printify.com/v1/shops/${shopId}/products/${printifyProductId}.json`,
//         {
//           headers: {
//             'Authorization': `Bearer ${printifyToken}`
//           }
//         }
//       );
      
//       if (productDetails.data && productDetails.data.external && productDetails.data.external.id) {
//         shopifyProductId = productDetails.data.external.id;
//         console.log(`Found Shopify product ID: ${shopifyProductId}`);
        
//         // Step 3: Add the product to the Shopify collection
//         if (shopifyProductId) {
//           // Create a collect object to associate product with collection
//           const collectData = {
//             collect: {
//               product_id: shopifyProductId,
//               collection_id: shopifyCollectionId
//             }
//           };
          
//           console.log(`Adding product to Shopify collection ${shopifyCollectionId}...`);
          
//           const shopifyResponse = await axios.post(
//             `https://${shopifyApiKey}:${shopifyApiPassword}@${shopifyShopDomain}/admin/api/2023-01/collects.json`,
//             collectData,
//             {
//               headers: {
//                 'Content-Type': 'application/json'
//               }
//             }
//           );
          
//           console.log("Shopify collection add response:", JSON.stringify(shopifyResponse.data, null, 2));
//           addedToCollection = true;
//         }
//       } else {
//         console.log("Product hasn't been synchronized to Shopify yet or external ID not found");
//       }
//     } catch (err) {
//       console.error(`Error adding product to Shopify collection: ${err.message}`);
//       if (err.response && err.response.data) {
//         console.error("API error details:", JSON.stringify(err.response.data, null, 2));
//       }
//     }
//   }

//   return res.status(200).json({
//     status: true,
//     message: 'Product created successfully',
//     data: createResponse.data,
//     shopify: shopifyProductId ? {
//       productId: shopifyProductId,
//       addedToCollection: addedToCollection,
//       collectionId: shopifyCollectionId
//     } : null
//   });
// } catch (error) {
//   console.error("Error creating product:", error.message);
//   if (error.response && error.response.data) {
//     console.error("API error details:", JSON.stringify(error.response.data, null, 2));
//   }
  
//   return res.status(500).json({
//     status: false,
//     message: 'Error creating product',
//     error: error.message
//   });
// }
// }  




//fixed code except price perflex
// exports.saveProductSave = async (req, res) => {
//   let alreadySent = false;
//   function safeSend(payload) {
//     if (alreadySent) return;
//     alreadySent = true;

//     // Final check for Printify's not-connected error
//     if (
//       payload &&
//       payload.error &&
//       payload.error.errors &&
//       payload.error.errors.reason &&
//       payload.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: payload.error.errors.reason,
//         error: payload.error
//       });
//     }

//     // If payload is the full response object, check .body
//     if (
//       payload &&
//       payload.body &&
//       payload.body.error &&
//       payload.body.error.errors &&
//       payload.body.error.errors.reason &&
//       payload.body.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: payload.body.error.errors.reason,
//         error: payload.body.error
//       });
//     }

//     // Otherwise, send as-is
//     return res.json(payload);
//   }

//   try {
//     const printifyToken = process.env.PRINTIFY_API_TOKEN;

//     const {
//       shopId,
//       title,
//       description,
//       printProvider,
//       imageLinks = [],
//       variants = [],
//       tags = [],
//       categoryId,
//       includeSafetyInfo = false,
//       publishProduct = false
//     } = req.body;

//     if (!shopId || !categoryId || !printProvider || !title || !description || !variants.length || !imageLinks.length || !tags.length) {
//       return safeSend({
//         status: false,
//         message: 'Missing required fields: shopId, categoryId, printProvider, title, description, variants, images, and tags',
//       });
//     }
//     const catalogRes = await axios.get(
//       `https://api.printify.com/v1/catalog/blueprints/${categoryId}/print_providers/${printProvider}/variants.json`,
//       {
//         headers: {
//           Authorization: `Bearer ${printifyToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     const catalogVariants = catalogRes.data.variants;
//     // Upload images
//     const uploadedImageIds = [];
//     for (const imageLink of imageLinks) {
//       const fileName = imageLink.split('/').pop() || 'image.png';
//       try {
//         const uploadRes = await axios.post(
//           'https://api.printify.com/v1/uploads/images.json',
//           { file_name: fileName, url: imageLink },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         if (uploadRes.data?.id) uploadedImageIds.push(uploadRes.data.id);
//       } catch (e) {
//         console.error(`Upload failed for URL ${imageLink}`, e.response?.data || e.message);
//       }
//     }

//     if (!uploadedImageIds.length) {
//       return safeSend({
//         status: false,
//         message: 'No images were successfully uploaded',
//       });
//     }

//     // Build product payload
//     const dynamicVariants = variants.map(v => {
//       const catalogVariant = catalogVariants.find(cv => cv.id === parseInt(v.id));
//       const baseCost = catalogVariant ? catalogVariant.price : 1000; // fallback if not found
//       const price = Math.round(baseCost * (1 + margin));
//       return {
//         id: parseInt(v.id),
//         price: price,
//         is_enabled: v.is_enabled ?? true
//       };
//     });

//     // 4. Build product payload
//     const variantIds = dynamicVariants.map(v => v.id);
//     const productData = {
//       title,
//       description,
//       blueprint_id: parseInt(categoryId),
//       print_provider_id: parseInt(printProvider),
//       variants: dynamicVariants,
//       images: uploadedImageIds.map(id => ({ id })),
//       print_areas: [
//         {
//           variant_ids: variantIds,
//           placeholders: [
//             {
//               position: "front",
//               images: uploadedImageIds.map(id => ({
//                 id,
//                 x: 0.5,
//                 y: 0.5,
//                 scale: 1,
//                 angle: 0
//               }))
//             }
//           ]
//         }
//       ],
//       tags: tags.length ? tags : ['product'],
//       options: [],
//       is_locked: false,
//     };

//     if (includeSafetyInfo) {
//       productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
//     }

//     // Create product
//     const createResponse = await axios.post(
//       `https://api.printify.com/v1/shops/${shopId}/products.json`,
//       productData,
//       {
//         headers: {
//           Authorization: `Bearer ${printifyToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // Publish product if requested
//     let publishResponse = null;
//     if (publishProduct && createResponse.data?.id) {
//       try {
//         publishResponse = await axios.post(
//           `https://api.printify.com/v1/shops/${shopId}/products/${createResponse.data.id}/publish.json`,
//           {
//             title: true,
//             description: true,
//             images: true,
//             variants: true,
//             tags: true
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       } catch (err) {
//         // If error is thrown, check for "not connected to sales channel"
//         if (
//           err.response &&
//           err.response.data &&
//           err.response.data.error &&
//           err.response.data.error.errors &&
//           err.response.data.error.errors.reason &&
//           err.response.data.error.errors.reason.includes('not connected to sales channel')
//         ) {
//           return safeSend({
//             status: true,
//             message: "Product created as draft in Printify (shop not connected to sales channel).",
//             warning: err.response.data.error.errors.reason,
//             error: err.response.data.error
//           });
//         }
//         return safeSend({
//           status: false,
//           message: err.response?.data?.message || err.message,
//           error: err.response?.data || { message: err.message },
//         });
//       }
//     }

//     // Check for "not connected to sales channel" in publishResponse body
//     if (
//       publishResponse &&
//       publishResponse.data &&
//       publishResponse.data.error &&
//       publishResponse.data.error.errors &&
//       publishResponse.data.error.errors.reason &&
//       publishResponse.data.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return safeSend({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: publishResponse.data.error.errors.reason,
//         error: publishResponse.data.error
//       });
//     }

//     // Success response
//     return safeSend({
//       status: true,
//       message: 'Product created successfully',
//       data: createResponse.data,
//     });

//   } catch (err) {
//     console.error("Error in saveProductSave:", err.message);

//     // Fallback: Check for thrown error in catch block
//     if (
//       err.response &&
//       err.response.data &&
//       err.response.data.error &&
//       err.response.data.error.errors &&
//       err.response.data.error.errors.reason &&
//       err.response.data.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: err.response.data.error.errors.reason,
//         error: err.response.data.error
//       });
//     }

//     // All other errors
//     if (err.response) {
//       return res.status(err.response.status || 400).json({
//         status: false,
//         message: err.response.data?.message || err.message,
//         error: err.response.data || { message: err.message },
//       });
//     }
//     return res.status(400).json({
//       status: false,
//       message: err.message,
//       error: { message: err.message },
//     });
//   }
// };




//final fix perflex
// exports.saveProductSave = async (req, res) => {
//   try {
//     const printifyToken = process.env.PRINTIFY_API_TOKEN;

//     const {
//       shopId,
//       title,
//       description,
//       printProvider,
//       imageLinks = [],
//       variants = [],
//       tags = [],
//       categoryId,
//       includeSafetyInfo = false,
//       publishProduct = false
//     } = req.body;

//     // Validate required fields
//     if (!shopId || !categoryId || !printProvider || !title || !description || !variants.length || !imageLinks.length || !tags.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'Missing required fields: shopId, categoryId, printProvider, title, description, variants, images, and tags',
//       });
//     }

//     // (Optional) Fetch variant info from Printify Catalog API (NO AUTH HEADER!)
//     let catalogVariants = [];
//     try {
//       const catalogRes = await axios.get(
//         `https://api.printify.com/v1/catalog/blueprints/${categoryId}/print_providers/${printProvider}/variants.json`
//       );
//       catalogVariants = catalogRes.data.variants;
//     } catch (e) {
//       // Not critical, just log
//       console.error("Catalog API failed, using frontend prices.", e.response?.data || e.message);
//     }

//     // 1. Upload images to Printify and collect their IDs (AUTH HEADER REQUIRED)
//     const uploadedImageIds = [];
//     for (const imageLink of imageLinks) {
//       const fileName = imageLink.split('/').pop() || 'image.png';
//       try {
//         const uploadRes = await axios.post(
//           'https://api.printify.com/v1/uploads/images.json',
//           { file_name: fileName, url: imageLink },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         if (uploadRes.data?.id) uploadedImageIds.push(uploadRes.data.id);
//       } catch (e) {
//         console.error(`Upload failed for URL ${imageLink}`, e.response?.data || e.message);
//       }
//     }

//     if (!uploadedImageIds.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'No images were successfully uploaded',
//       });
//     }

//     // 2. Use prices as provided by frontend
//     const dynamicVariants = variants.map(v => ({
//       id: typeof v.id === 'string' ? parseInt(v.id) : v.id,
//       price: typeof v.price === 'string' ? parseInt(v.price) : v.price,
//       is_enabled: v.is_enabled ?? true
//     }));

//     // 3. Build product payload
//     const variantIds = dynamicVariants.map(v => v.id);
//     const productData = {
//       title,
//       description,
//       blueprint_id: parseInt(categoryId),
//       print_provider_id: parseInt(printProvider),
//       variants: dynamicVariants,
//       images: uploadedImageIds.map(id => ({ id })),
//       print_areas: [
//         {
//           variant_ids: variantIds,
//           placeholders: [
//             {
//               position: "front",
//               images: uploadedImageIds.map(id => ({
//                 id,
//                 x: 0.5,
//                 y: 0.5,
//                 scale: 1,
//                 angle: 0
//               }))
//             }
//           ]
//         }
//       ],
//       tags: tags.length ? tags : ['product'],
//       options: [],
//       is_locked: false,
//     };

//     if (includeSafetyInfo) {
//       productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
//     }

//     // 4. Create product (AUTH HEADER REQUIRED)
//     const createResponse = await axios.post(
//       `https://api.printify.com/v1/shops/${shopId}/products.json`,
//       productData,
//       {
//         headers: {
//           Authorization: `Bearer ${printifyToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // 5. Publish product if requested (AUTH HEADER REQUIRED)
//     let publishResponse = null;
//     if (publishProduct && createResponse.data?.id) {
//       try {
//         publishResponse = await axios.post(
//           `https://api.printify.com/v1/shops/${shopId}/products/${createResponse.data.id}/publish.json`,
//           {
//             title: true,
//             description: true,
//             images: true,
//             variants: true,
//             tags: true
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       } catch (err) {
//         if (
//           err.response &&
//           err.response.data &&
//           err.response.data.error &&
//           err.response.data.error.errors &&
//           err.response.data.error.errors.reason &&
//           err.response.data.error.errors.reason.includes('not connected to sales channel')
//         ) {
//           return res.status(200).json({
//             status: true,
//             message: "Product created as draft in Printify (shop not connected to sales channel).",
//             warning: err.response.data.error.errors.reason,
//             error: err.response.data.error
//           });
//         }
//         return res.status(400).json({
//           status: false,
//           message: err.response?.data?.message || err.message,
//           error: err.response?.data || { message: err.message },
//         });
//       }
//     }

//     if (
//       publishResponse &&
//       publishResponse.data &&
//       publishResponse.data.error &&
//       publishResponse.data.error.errors &&
//       publishResponse.data.error.errors.reason &&
//       publishResponse.data.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: publishResponse.data.error.errors.reason,
//         error: publishResponse.data.error
//       });
//     }

//     // Success response
//     return res.status(200).json({
//       status: true,
//       message: 'Product created successfully',
//       data: createResponse.data,
//     });

//   } catch (err) {
//     console.error("Error in saveProductSave:", err.message);

//     if (
//       err.response &&
//       err.response.data &&
//       err.response.data.error &&
//       err.response.data.error.errors &&
//       err.response.data.error.errors.reason &&
//       err.response.data.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: err.response.data.error.errors.reason,
//         error: err.response.data.error
//       });
//     }

//     if (err.response) {
//       return res.status(err.response.status || 400).json({
//         status: false,
//         message: err.response.data?.message || err.message,
//         error: err.response.data || { message: err.message },
//       });
//     }
//     return res.status(400).json({
//       status: false,
//       message: err.message,
//       error: { message: err.message },
//     });
//   }
// };





// perfl last confm code
// exports.saveProductSave = async (req, res) => {
//   try {
//     const printifyToken = process.env.PRINTIFY_API_TOKEN;

//     const {
//       shopId,
//       title,
//       description,
//       printProvider,
//       imageLinks = [],
//       variants = [],
//       tags = [],
//       categoryId,
//       includeSafetyInfo = false,
//       publishProduct = false
//     } = req.body;

//     // Validate required fields
//     if (!shopId || !categoryId || !printProvider || !title || !description || !variants.length || !imageLinks.length || !tags.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'Missing required fields: shopId, categoryId, printProvider, title, description, variants, images, and tags',
//       });
//     }

//     // 1. Upload all images to Printify and collect their IDs
//     const uploadedImageIds = [];
//     for (const imageLink of imageLinks) {
//       const fileName = imageLink.split('/').pop() || 'image.png';
//       try {
//         const uploadRes = await axios.post(
//           'https://api.printify.com/v1/uploads/images.json',
//           { file_name: fileName, url: imageLink },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         if (uploadRes.data?.id) uploadedImageIds.push(uploadRes.data.id);
//       } catch (e) {
//         console.error(`Upload failed for URL ${imageLink}`, e.response?.data || e.message);
//       }
//     }

//     if (!uploadedImageIds.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'No images were successfully uploaded',
//       });
//     }

//     // 2. Prepare variants for Printify (only id, price, is_enabled)
//     const printifyVariants = variants.map(v => ({
//       id: typeof v.id === 'string' ? parseInt(v.id) : v.id,
//       price: typeof v.price === 'string' ? parseInt(v.price) : v.price,
//       is_enabled: v.is_enabled ?? true
//     }));

//     // 3. Build product payload for Printify
//     const variantIds = printifyVariants.map(v => v.id);
//     const productData = {
//       title,
//       description,
//       blueprint_id: parseInt(categoryId),
//       print_provider_id: parseInt(printProvider),
//       variants: printifyVariants,
//       images: uploadedImageIds.map(id => ({ id })), // All images will show in Printify/store
//       print_areas: [
//         {
//           variant_ids: variantIds,
//           placeholders: [
//             {
//               position: "front",
//               images: uploadedImageIds.map(id => ({
//                 id,
//                 x: 0.5,
//                 y: 0.5,
//                 scale: 1,
//                 angle: 0
//               }))
//             }
//           ]
//         }
//       ],
//       tags: tags.length ? tags : ['product'],
//       options: [],
//       is_locked: false,
//     };

//     if (includeSafetyInfo) {
//       productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
//     }

//     // 4. Create product in Printify
//     let createResponse;
//     try {
//       createResponse = await axios.post(
//         `https://api.printify.com/v1/shops/${shopId}/products.json`,
//         productData,
//         {
//           headers: {
//             Authorization: `Bearer ${printifyToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     } catch (err) {
//       // Universal error handler for "not connected to sales channel"
//       let reason = null;
//       if (
//         err.response &&
//         err.response.data
//       ) {
//         if (
//           err.response.data.error &&
//           err.response.data.error.errors &&
//           err.response.data.error.errors.reason &&
//           err.response.data.error.errors.reason.includes('not connected to sales channel')
//         ) {
//           reason = err.response.data.error.errors.reason;
//         } else if (
//           err.response.data.errors &&
//           err.response.data.errors.reason &&
//           err.response.data.errors.reason.includes('not connected to sales channel')
//         ) {
//           reason = err.response.data.errors.reason;
//         }
//       }
//       if (reason) {
//         return res.status(200).json({
//           status: true,
//           message: "Product created as draft in Printify (shop not connected to sales channel).",
//           warning: reason,
//           error: err.response.data.error || err.response.data.errors,
//           variants
//         });
//       }
//       return res.status(err.response?.status || 400).json({
//         status: false,
//         message: err.response?.data?.message || err.message,
//         error: err.response?.data || { message: err.message },
//       });
//     }

//     // 5. Publish product if requested
//     let publishResponse = null;
//     if (publishProduct && createResponse.data?.id) {
//       try {
//         publishResponse = await axios.post(
//           `https://api.printify.com/v1/shops/${shopId}/products/${createResponse.data.id}/publish.json`,
//           {
//             title: true,
//             description: true,
//             images: true,
//             variants: true,
//             tags: true
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       } catch (err) {
//         // Universal error handler for "not connected to sales channel"
//         let reason = null;
//         if (
//           err.response &&
//           err.response.data
//         ) {
//           if (
//             err.response.data.error &&
//             err.response.data.error.errors &&
//             err.response.data.error.errors.reason &&
//             err.response.data.error.errors.reason.includes('not connected to sales channel')
//           ) {
//             reason = err.response.data.error.errors.reason;
//           } else if (
//             err.response.data.errors &&
//             err.response.data.errors.reason &&
//             err.response.data.errors.reason.includes('not connected to sales channel')
//           ) {
//             reason = err.response.data.errors.reason;
//           }
//         }
//         if (reason) {
//           return res.status(200).json({
//             status: true,
//             message: "Product created as draft in Printify (shop not connected to sales channel).",
//             warning: reason,
//             error: err.response.data.error || err.response.data.errors,
//             variants
//           });
//         }
//         return res.status(400).json({
//           status: false,
//           message: err.response?.data?.message || err.message,
//           error: err.response?.data || { message: err.message },
//         });
//       }
//     }

//     // Also handle this case if it appears in the publish response
//     if (
//       publishResponse &&
//       publishResponse.data &&
//       (
//         (publishResponse.data.error &&
//           publishResponse.data.error.errors &&
//           publishResponse.data.error.errors.reason &&
//           publishResponse.data.error.errors.reason.includes('not connected to sales channel')
//         ) ||
//         (publishResponse.data.errors &&
//           publishResponse.data.errors.reason &&
//           publishResponse.data.errors.reason.includes('not connected to sales channel')
//         )
//       )
//     ) {
//       const reason = publishResponse.data.error
//         ? publishResponse.data.error.errors.reason
//         : publishResponse.data.errors.reason;
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: reason,
//         error: publishResponse.data.error || publishResponse.data.errors,
//         variants
//       });
//     }

//     // Success response
//     return res.status(200).json({
//       status: true,
//       message: 'Product created successfully',
//       data: createResponse.data,
//       variants // Return your variants array (with options) for your UI
//     });

//   } catch (err) {
//     // ---- UNIVERSAL ERROR HANDLER ----
//     let reason = null;
//     if (
//       err.response &&
//       err.response.data
//     ) {
//       if (
//         err.response.data.error &&
//         err.response.data.error.errors &&
//         err.response.data.error.errors.reason &&
//         err.response.data.error.errors.reason.includes('not connected to sales channel')
//       ) {
//         reason = err.response.data.error.errors.reason;
//       } else if (
//         err.response.data.errors &&
//         err.response.data.errors.reason &&
//         err.response.data.errors.reason.includes('not connected to sales channel')
//       ) {
//         reason = err.response.data.errors.reason;
//       }
//     }
//     if (reason) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: reason,
//         error: err.response.data.error || err.response.data.errors,
//         variants: req.body.variants
//       });
//     }

//     return res.status(err.response?.status || 400).json({
//       status: false,
//       message: err.response?.data?.message || err.message,
//       error: err.response?.data || { message: err.message },
//     });
//   }
// };







// exports.saveProductSave = async (req, res) => {
//   try {
//     const printifyToken = process.env.PRINTIFY_API_TOKEN;

//     const {
//       shopId,
//       title,
//       description,
//       printProvider,
//       imageLinks = [],
//       variants = [],
//       tags = [],
//       categoryId,
//       includeSafetyInfo = false,
//       publishProduct = false,
//       margin = 0.4 // Default 40% margin
//     } = req.body;

//     // Validate required fields
//     if (!shopId || !categoryId || !printProvider || !title || !description || !variants.length || !imageLinks.length || !tags.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'Missing required fields: shopId, categoryId, printProvider, title, description, variants, images, and tags',
//       });
//     }

//     // 1. Fetch variant base costs from Printify Catalog API (NO AUTH HEADER!)
//     const catalogRes = await axios.get(
//       `https://api.printify.com/v1/catalog/blueprints/${categoryId}/print_providers/${printProvider}/variants.json`
//     );
//     const catalogVariants = catalogRes.data.variants;

//     // 2. Upload images to Printify and collect their IDs (AUTH HEADER REQUIRED)
//     const uploadedImageIds = [];
//     for (const imageLink of imageLinks) {
//       const fileName = imageLink.split('/').pop() || 'image.png';
//       try {
//         const uploadRes = await axios.post(
//           'https://api.printify.com/v1/uploads/images.json',
//           { file_name: fileName, url: imageLink },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         if (uploadRes.data?.id) uploadedImageIds.push(uploadRes.data.id);
//       } catch (e) {
//         console.error(`Upload failed for URL ${imageLink}`, e.response?.data || e.message);
//       }
//     }

//     if (!uploadedImageIds.length) {
//       return res.status(400).json({
//         status: false,
//         message: 'No images were successfully uploaded',
//       });
//     }

//     // 3. Build dynamic variants with calculated prices
//     const dynamicVariants = variants.map(v => {
//       const catalogVariant = catalogVariants.find(cv => cv.id === parseInt(v.id));
//       const baseCost = catalogVariant ? catalogVariant.price : 1000; // fallback if not found
//       const price = Math.round(baseCost * (1 + margin));
//       return {
//         id: parseInt(v.id),
//         price: price,
//         is_enabled: v.is_enabled ?? true
//       };
//     });

//     // 4. Build product payload
//     const variantIds = dynamicVariants.map(v => v.id);
//     const productData = {
//       title,
//       description,
//       blueprint_id: parseInt(categoryId),
//       print_provider_id: parseInt(printProvider),
//       variants: dynamicVariants,
//       images: uploadedImageIds.map(id => ({ id })),
//       print_areas: [
//         {
//           variant_ids: variantIds,
//           placeholders: [
//             {
//               position: "front",
//               images: uploadedImageIds.map(id => ({
//                 id,
//                 x: 0.5,
//                 y: 0.5,
//                 scale: 1,
//                 angle: 0
//               }))
//             }
//           ]
//         }
//       ],
//       tags: tags.length ? tags : ['product'],
//       options: [],
//       is_locked: false,
//     };

//     if (includeSafetyInfo) {
//       productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
//     }

//     // 5. Create product (AUTH HEADER REQUIRED)
//     const createResponse = await axios.post(
//       `https://api.printify.com/v1/shops/${shopId}/products.json`,
//       productData,
//       {
//         headers: {
//           Authorization: `Bearer ${printifyToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // 6. Publish product if requested (AUTH HEADER REQUIRED)
//     let publishResponse = null;
//     if (publishProduct && createResponse.data?.id) {
//       try {
//         publishResponse = await axios.post(
//           `https://api.printify.com/v1/shops/${shopId}/products/${createResponse.data.id}/publish.json`,
//           {
//             title: true,
//             description: true,
//             images: true,
//             variants: true,
//             tags: true
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${printifyToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       } catch (err) {
//         if (
//           err.response &&
//           err.response.data &&
//           err.response.data.error &&
//           err.response.data.error.errors &&
//           err.response.data.error.errors.reason &&
//           err.response.data.error.errors.reason.includes('not connected to sales channel')
//         ) {
//           return res.status(200).json({
//             status: true,
//             message: "Product created as draft in Printify (shop not connected to sales channel).",
//             warning: err.response.data.error.errors.reason,
//             error: err.response.data.error
//           });
//         }
//         return res.status(400).json({
//           status: false,
//           message: err.response?.data?.message || err.message,
//           error: err.response?.data || { message: err.message },
//         });
//       }
//     }

//     if (
//       publishResponse &&
//       publishResponse.data &&
//       publishResponse.data.error &&
//       publishResponse.data.error.errors &&
//       publishResponse.data.error.errors.reason &&
//       publishResponse.data.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: publishResponse.data.error.errors.reason,
//         error: publishResponse.data.error
//       });
//     }

//     // Success response
//     return res.status(200).json({
//       status: true,
//       message: 'Product created successfully',
//       data: createResponse.data,
//     });

//   } catch (err) {
//     console.error("Error in saveProductSave:", err.message);

//     if (
//       err.response &&
//       err.response.data &&
//       err.response.data.error &&
//       err.response.data.error.errors &&
//       err.response.data.error.errors.reason &&
//       err.response.data.error.errors.reason.includes('not connected to sales channel')
//     ) {
//       return res.status(200).json({
//         status: true,
//         message: "Product created as draft in Printify (shop not connected to sales channel).",
//         warning: err.response.data.error.errors.reason,
//         error: err.response.data.error
//       });
//     }

//     if (err.response) {
//       return res.status(err.response.status || 400).json({
//         status: false,
//         message: err.response.data?.message || err.message,
//         error: err.response.data || { message: err.message },
//       });
//     }
//     return res.status(400).json({
//       status: false,
//       message: err.message,
//       error: { message: err.message },
//     });
//   }
// };

exports.saveProductSave = async (req, res) => {
  try {
    const printifyToken = process.env.PRINTIFY_API_TOKEN;

    const {
      shopId,
      title,
      description,
      printProvider,
      imageLinks = [],
      variants = [],
      tags = [],
      categoryId,
      includeSafetyInfo = false,
      publishProduct = false
    } = req.body;

    // Validate required fields
    if (!shopId || !categoryId || !printProvider || !title || !description || !variants.length || !imageLinks.length || !tags.length) {
      return res.status(400).json({
        status: false,
        message: 'Missing required fields: shopId, categoryId, printProvider, title, description, variants, images, and tags',
      });
    }

    // Debug - Log the incoming request
    console.log('Received product creation request:', {
      shopId, categoryId, printProvider, title, 
      variantsCount: variants.length,
      imagesCount: imageLinks.length
    });

    // Check for valid variants for this blueprint and provider
    try {
      console.log(`Fetching valid variants for blueprint ${categoryId} and provider ${printProvider}...`);
      const providerResponse = await axios.get(
        `https://api.printify.com/v1/catalog/blueprints/${categoryId}/print_providers/${printProvider}/variants.json`,
        {
          headers: {
            Authorization: `Bearer ${printifyToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Valid variant IDs from Printify:', 
        providerResponse.data.variants.map(v => v.id)
      );
      
      // Check if our variants exist in the valid list
      const validVariantIds = new Set(providerResponse.data.variants.map(v => v.id));
      const invalidVariants = variants.filter(v => !validVariantIds.has(parseInt(v.id)));
      
      if (invalidVariants.length > 0) {
        console.error('Invalid variant IDs detected:', 
          invalidVariants.map(v => v.id)
        );
        return res.status(400).json({
          status: false,
          message: 'Some variant IDs are not valid for this product type and provider',
          invalidVariants: invalidVariants.map(v => v.id),
          validVariants: Array.from(validVariantIds)
        });
      }
    } catch (e) {
      console.error('Error checking variant validity:', e.response?.data || e.message);
      // Continue anyway, as we might have the correct variants
    }

    // 1. Upload all images to Printify and collect their IDs
    const uploadedImageIds = [];
    for (const imageLink of imageLinks) {
      const fileName = imageLink.split('/').pop() || 'image.png';
      try {
        console.log(`Uploading image: ${fileName}`);
        const uploadRes = await axios.post(
          'https://api.printify.com/v1/uploads/images.json',
          { file_name: fileName, url: imageLink },
          {
            headers: {
              Authorization: `Bearer ${printifyToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (uploadRes.data?.id) {
          uploadedImageIds.push(uploadRes.data.id);
          console.log(`Image uploaded successfully, ID: ${uploadRes.data.id}`);
        }
      } catch (e) {
        console.error(`Upload failed for URL ${imageLink}`, e.response?.data || e.message);
      }
    }

    if (!uploadedImageIds.length) {
      return res.status(400).json({
        status: false,
        message: 'No images were successfully uploaded',
      });
    }

    // 2. Prepare variants for Printify (only id, price, is_enabled)
    const printifyVariants = variants.map(v => ({
      id: typeof v.id === 'string' ? parseInt(v.id) : v.id,
      price: typeof v.price === 'string' ? parseFloat(v.price) : v.price,
      is_enabled: v.is_enabled ?? true
    }));

    // 3. Build product payload for Printify
    // Make sure variant IDs are integers
    const variantIds = printifyVariants.map(v => parseInt(v.id));
    
    console.log('Using variant IDs:', variantIds);
    
    const productData = {
      title,
      description,
      blueprint_id: parseInt(categoryId),
      print_provider_id: parseInt(printProvider),
      variants: printifyVariants,
      images: uploadedImageIds.map(id => ({ id })), // All images will show in Printify/store
      
      // MODIFIED: Changed print_areas from array to object with named positions and added required placeholders field
      print_areas: {
        front: {
          variant_ids: variantIds,
          placeholders: [
            {
              position: "front",
              images: uploadedImageIds.map(id => ({
                id,
                x: 0.5,
                y: 0.5,
                scale: 1,
                angle: 0
              }))
            }
          ]
        }
      },
      
      tags: tags.length ? tags : ['product'],
      options: [],
      is_locked: false,
    };

    if (includeSafetyInfo) {
      productData.safety_information = "GPSR information: John Doe, test@example.com, 123 Main St, Apt 1, New York, NY, 10001, US\nProduct information: Gildan, 5000, 2 year warranty in EU and UK as per Directive 1999/44/EC\nWarnings, Hazard: No warranty, US\nCare instructions: Machine wash: warm (max 40C or 105F), Non-chlorine bleach as needed, Tumble dry: medium, Do not iron, Do not dryclean";
    }

    // Debug - Log what we're sending to Printify
    console.log('Sending to Printify:', JSON.stringify(productData, null, 2));

    // 4. Create product in Printify
    let createResponse;
    try {
      createResponse = await axios.post(
        `https://api.printify.com/v1/shops/${shopId}/products.json`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${printifyToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Product created successfully:', createResponse.data.id);
    } catch (err) {
      // Debug - Log detailed error from Printify
      console.error('Printify API Error Response:', JSON.stringify(err.response?.data, null, 2));
      
      // Universal error handler for "not connected to sales channel"
      let reason = null;
      if (
        err.response &&
        err.response.data
      ) {
        if (
          err.response.data.error &&
          err.response.data.error.errors &&
          err.response.data.error.errors.reason &&
          err.response.data.error.errors.reason.includes('not connected to sales channel')
        ) {
          reason = err.response.data.error.errors.reason;
        } else if (
          err.response.data.errors &&
          err.response.data.errors.reason &&
          err.response.data.errors.reason.includes('not connected to sales channel')
        ) {
          reason = err.response.data.errors.reason;
        }
      }
      if (reason) {
        return res.status(200).json({
          status: true,
          message: "Product created as draft in Printify (shop not connected to sales channel).",
          warning: reason,
          error: err.response.data.error || err.response.data.errors,
          variants
        });
      }
      return res.status(err.response?.status || 400).json({
        status: false,
        message: err.response?.data?.message || err.message,
        error: err.response?.data || { message: err.message },
      });
    }

    // 5. Publish product if requested
    let publishResponse = null;
    if (publishProduct && createResponse.data?.id) {
      try {
        console.log(`Publishing product ${createResponse.data.id}...`);
        publishResponse = await axios.post(
          `https://api.printify.com/v1/shops/${shopId}/products/${createResponse.data.id}/publish.json`,
          {
            title: true,
            description: true,
            images: true,
            variants: true,
            tags: true
          },
          {
            headers: {
              Authorization: `Bearer ${printifyToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Product published successfully');
      } catch (err) {
        console.error('Error publishing product:', JSON.stringify(err.response?.data, null, 2));
        // Universal error handler for "not connected to sales channel"
        let reason = null;
        if (
          err.response &&
          err.response.data
        ) {
          if (
            err.response.data.error &&
            err.response.data.error.errors &&
            err.response.data.error.errors.reason &&
            err.response.data.error.errors.reason.includes('not connected to sales channel')
          ) {
            reason = err.response.data.error.errors.reason;
          } else if (
            err.response.data.errors &&
            err.response.data.errors.reason &&
            err.response.data.errors.reason.includes('not connected to sales channel')
          ) {
            reason = err.response.data.errors.reason;
          }
        }
        if (reason) {
          return res.status(200).json({
            status: true,
            message: "Product created as draft in Printify (shop not connected to sales channel).",
            warning: reason,
            error: err.response.data.error || err.response.data.errors,
            variants
          });
        }
        return res.status(400).json({
          status: false,
          message: err.response?.data?.message || err.message,
          error: err.response?.data || { message: err.message },
        });
      }
    }

    // Also handle this case if it appears in the publish response
    if (
      publishResponse &&
      publishResponse.data &&
      (
        (publishResponse.data.error &&
          publishResponse.data.error.errors &&
          publishResponse.data.error.errors.reason &&
          publishResponse.data.error.errors.reason.includes('not connected to sales channel')
        ) ||
        (publishResponse.data.errors &&
          publishResponse.data.errors.reason &&
          publishResponse.data.errors.reason.includes('not connected to sales channel')
        )
      )
    ) {
      const reason = publishResponse.data.error
        ? publishResponse.data.error.errors.reason
        : publishResponse.data.errors.reason;
      return res.status(200).json({
        status: true,
        message: "Product created as draft in Printify (shop not connected to sales channel).",
        warning: reason,
        error: publishResponse.data.error || publishResponse.data.errors,
        variants
      });
    }

    // Success response
    return res.status(200).json({
      status: true,
      message: 'Product created successfully',
      data: createResponse.data,
      variants // Return your variants array (with options) for your UI
    });

  } catch (err) {
    console.error('Unexpected error in saveProductSave:', err);
    
    // ---- UNIVERSAL ERROR HANDLER ----
    let reason = null;
    if (
      err.response &&
      err.response.data
    ) {
      if (
        err.response.data.error &&
        err.response.data.error.errors &&
        err.response.data.error.errors.reason &&
        err.response.data.error.errors.reason.includes('not connected to sales channel')
      ) {
        reason = err.response.data.error.errors.reason;
      } else if (
        err.response.data.errors &&
        err.response.data.errors.reason &&
        err.response.data.errors.reason.includes('not connected to sales channel')
      ) {
        reason = err.response.data.errors.reason;
      }
    }
    if (reason) {
      return res.status(200).json({
        status: true,
        message: "Product created as draft in Printify (shop not connected to sales channel).",
        warning: reason,
        error: err.response.data.error || err.response.data.errors,
        variants: req.body.variants
      });
    }

    return res.status(err.response?.status || 400).json({
      status: false,
      message: err.response?.data?.message || err.message,
      error: err.response?.data || { message: err.message },
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
          status_code:200,
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
