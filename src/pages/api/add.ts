import type { APIRoute } from "astro";
import db from "../../../prisma/db";
import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.text();

    if (!rawBody) {
      return new Response(
        JSON.stringify({ error: "Request body cannot be empty." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let formDataObject;
    try {
      formDataObject = JSON.parse(rawBody);
    } catch (err) {
      console.error("Error parsing JSON:", err);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { emailAddress, formType, ...formContent } = formDataObject;

    if (!emailAddress || !formType) {
      return new Response(
        JSON.stringify({
          error: "Email and form type are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    type FormUpdate = {
      referForm?: Array<Record<string, any>>;
      ctaForm?: Record<string, any>;
      contactForm?: Record<string, any>;
    };

    const formUpdate: FormUpdate = {};

    if (formType === "refer") {
      const { friendName, friendEmail, friendPhone, ...rest } = formContent;

      if (!friendName || !friendEmail || !friendPhone) {
        return new Response(
          JSON.stringify({
            error: "Friend details are required for refer form.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const newReferral = { friendName, friendEmail, friendPhone, ...rest };

      const existingData = await db.formData.findUnique({
        where: { email: emailAddress },
      });

      const existingReferForm = existingData?.referForm || [];
      const updatedReferForm = [...existingReferForm, newReferral];

      formUpdate.referForm = updatedReferForm;
    } else {
      formUpdate[`${formType}Form`] = formContent;
    }

    const formData = await db.formData.upsert({
      where: { email: emailAddress },
      update: {
        ...formUpdate,
        updatedAt: new Date(),
      },
      create: {
        email: emailAddress,
        ...formUpdate,
      },
    });

    const generateHtmlTemplate = (formType: string, formData: any) => `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #004085; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
          New Form Submission (${formType})
        </h2>
        <p style="font-size: 14px; color: #555;">
          Below are the details of the form submission:
        </p>
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #f7f7f7; text-align: left; border-bottom: 1px solid #ddd;">
      <th style="padding: 8px;">Field</th>
      <th style="padding: 8px;">Value</th>
    </tr>
  </thead>
  <tbody>
    ${Object.entries(formData)
        .map(
          ([key, value]) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${key}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          ${Array.isArray(value)
              ? `<ul>${value
                .map((item) => `<li>${JSON.stringify(item, null, 2)}</li>`)
                .join("")}</ul>`
              : value && typeof value === "object"
                ? `<ul>${Object.entries(value)
                  .map(
                    ([k, v]) => `<li><strong>${k}:</strong> ${v ?? "N/A"}</li>`
                  )
                  .join("")}</ul>`
                : value ?? "N/A"
            }
        </td>
      </tr>
    `
        )
        .join("")}
  </tbody>
</table>

        <p style="text-align: center; color: #777; font-size: 12px;">
          Sent by <strong>Jayalakshmi Wood Corner</strong>
        </p>
      </div>
    `;

    // Email transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.GOOGLE_PASS,
      },
    });

    const mailOptions = {
      from: `"Jayalakshmi Wood Corner" <${process.env.FROM_EMAIL}>`,
      to: process.env.TOEMAIL,
      subject: `New Form Submission (${formType})`,
      text: `Form submission details:\n\n${JSON.stringify(formData, null, 2)}`, // Fallback text
      html: generateHtmlTemplate(formType, formData), // HTML content
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        result: formData,
        message: "Form submission successful!",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in form submission:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process form submission.",
        details: error.message || error,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
