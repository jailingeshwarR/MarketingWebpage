import type { APIRoute } from "astro";
import db from "../../../prisma/db";

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

    // Define a proper type for formUpdate
    type FormUpdate = {
      referForm?: Array<Record<string, any>>;
      ctaForm?: Record<string, any>;
      contactForm?: Record<string, any>;
    };

    const formUpdate: FormUpdate = {};

    if (formType === "refer") {
      // Handle Refer form logic
      const { friendName, friendEmail, friendPhone, ...rest } = formContent;

      if (!friendName || !friendEmail || !friendPhone) {
        return new Response(
          JSON.stringify({
            error: "Friend details are required for refer form.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Prepare the new referral entry
      const newReferral = { friendName, friendEmail, friendPhone, ...rest };

      const existingData = await db.formData.findUnique({
        where: { email: emailAddress },
      });

      const existingReferForm = existingData?.referForm || [];
      const updatedReferForm = [...existingReferForm, newReferral];

      formUpdate.referForm = updatedReferForm;
    } else {
      // General form (CTA or Contact form)
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
