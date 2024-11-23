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

    const formData = await db.formData.create({
      data: {
        formData: formDataObject,
        email: formDataObject.emailAddress,
      },
    });

    const previousPageLocation = request.headers.get("Referer");

    return new Response(
      JSON.stringify({
        result: formData,
        message: "Form submission successful!",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Location": previousPageLocation ?? "/",
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
