// import express from "express"
// import dotenv from 'dotenv'


// dotenv.config()
// const router = express.Router()

// router.post('/api/send-appointment', async(req, res) => {
//     try {
//         const {email, name, phone, service, others} = req.body

//         if (!email || !name || !service) {
//             return res.status(400).json({
//                 error: "Missing required fields",
//                 required: ['email', 'name', 'service']
//             })
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({error: "Invalid email format"})
//         }

//         const serviceNames = {
//             website: 'Website Development',
//             app: "Mobile App Development",
//             agent: "AI Agent Development"
//         }

//         const serviceName = serviceNames[service] || service

//         const response = await fetch('https://api.resend.com/emails', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
//             },
//             body: JSON.stringify({
//         from: 'leonard@ibonnis.com', // Use your verified domain in production
//         to: 'loluoch710@gmail.com',
//         subject: `New Appointment Request - ${serviceName}`,
//         html: `
//           <!DOCTYPE html>
//           <html>
//           <head>
//             <meta charset="utf-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           </head>
//           <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
//             <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//               <!-- Header -->
//               <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 30px; border-radius: 10px 10px 0 0;">
//                 <h1 style="color: white; margin: 0; font-size: 24px; text-align: center;">
//                   New Appointment Request
//                 </h1>
//               </div>
              
//               <!-- Content -->
//               <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//                 <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Client Information</h2>
                
//                 <div style="margin: 20px 0;">
//                   <p style="margin: 10px 0; color: #4b5563; line-height: 1.6;">
//                     <strong style="color: #1f2937;">Name:</strong> ${name}
//                   </p>
//                   <p style="margin: 10px 0; color: #4b5563; line-height: 1.6;">
//                     <strong style="color: #1f2937;">Email:</strong> 
//                     <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
//                   </p>
//                   ${phone ? `
//                     <p style="margin: 10px 0; color: #4b5563; line-height: 1.6;">
//                       <strong style="color: #1f2937;">Phone:</strong> 
//                       <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
//                     </p>
//                   ` : ''}
//                   <p style="margin: 10px 0; color: #4b5563; line-height: 1.6;">
//                     <strong style="color: #1f2937;">Service Type:</strong>
//                   </p>
//                   <div style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 6px; margin-top: 5px; font-weight: 600;">
//                     ${serviceName}
//                   </div>
//                 </div>
                
//                 ${others ? `
//                   <div style="margin: 25px 0;">
//                     <h3 style="color: #1f2937; margin-bottom: 10px; font-size: 18px;">Project Details</h3>
//                     <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
//                       <p style="margin: 0; color: #4b5563; white-space: pre-wrap; line-height: 1.6;">${others}</p>
//                     </div>
//                   </div>
//                 ` : ''}
                
//                 <!-- Footer -->
//                 <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
//                   <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
//                     📅 Submitted on ${new Date().toLocaleString('en-US', { 
//                       dateStyle: 'full', 
//                       timeStyle: 'short' 
//                     })}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </body>
//           </html>
//         `
//       })
//         })

//         const data = await response.json()

//         if (!response.ok) {
//             console.error('Resend API error:', data)
//             return res.status(response.status).json({
//                 error: 'Failed to send email',
//                 message: data.message || "Unknown error from email service"
//             })
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Appointment email sent successfully',
//             data
//         })
//     } catch (error) {
//         console.error('Server error:', error)
//         res.status(500).json({
//             error: "Internal serbver error",
//             message: error instanceof Error ? error.message : 'Unknown error'
//         })
//     }
// })

// export default router
//////////////////////////////////////////////////

import express from "express"
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

router.post('/api/send-appointment', async (req, res) => {
    try {
        const { email, name, phone, service, others } = req.body

        // Validation
        if (!email || !name || !service) {
            return res.status(400).json({
                error: "Missing required fields",
                required: ['email', 'name', 'service']
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        const serviceNames = {
            website: 'Website Development',
            app: "Mobile App Development",
            agent: "AI Agent Development"
        }

        const serviceName = serviceNames[service] || service

        // Send email using Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'leonard@ibonnis.com', // Make sure this domain is verified in Resend
                to: 'loluoch710@gmail.com',
                subject: `New Appointment Request - ${serviceName}`,
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px; text-align: center;">
                  New Appointment Request
                </h1>
              </div>
              
              <!-- Content -->
              <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Client Information</h2>
                
                <div style="margin: 20px 0;">
                  <p style="margin: 10px 0; color: #4b5563; line-height: 1.6;">
                    <strong style="color: #1f2937;">Name:</strong> ${name}
                  </p>
                  <p style="margin: 10px 0; color: #4b5563; line-height: 1.6;">
                    <strong style="color: #1f2937;">Email:</strong> 
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                  </p>
                  ${phone ? `
                    <p style="margin: 10px 0; color: #4b5563; line-height: 1.6;">
                      <strong style="color: #1f2937;">Phone:</strong> 
                      <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
                    </p>
                  ` : ''}
                  <p style="margin: 10px 0; color: #4b5563; line-height: 1.6;">
                    <strong style="color: #1f2937;">Service Type:</strong>
                  </p>
                  <div style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 6px; margin-top: 5px; font-weight: 600;">
                    ${serviceName}
                  </div>
                </div>
                
                ${others ? `
                  <div style="margin: 25px 0;">
                    <h3 style="color: #1f2937; margin-bottom: 10px; font-size: 18px;">Project Details</h3>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
                      <p style="margin: 0; color: #4b5563; white-space: pre-wrap; line-height: 1.6;">${others}</p>
                    </div>
                  </div>
                ` : ''}
                
                <!-- Footer -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
                    📅 Submitted on ${new Date().toLocaleString('en-US', { 
                      dateStyle: 'full', 
                      timeStyle: 'short' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Resend API error:', data)
            return res.status(response.status).json({
                error: 'Failed to send email',
                message: data.message || "Unknown error from email service"
            })
        }

        // Success response
        res.status(200).json({
            success: true,
            message: 'Appointment email sent successfully',
            data
        })

    } catch (error) {
        console.error('Server error:', error)
        res.status(500).json({
            error: "Internal server error", // Fixed typo: "serbver" -> "server"
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
})

export default router