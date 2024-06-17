const { readFile, writeFile } = require("fs").promises;
import { Category, connectToDatabase } from "@/lib/mongoDb";
import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   return new Response(JSON.stringify(data), {
//     headers: {
//       "content-type": "application/json",
//     },
//   });
// }
export async function HEAD(request: Request) {
  return new Response("Hello World HEAD");
}

export async function GET() {
  try {
    await connectToDatabase(); // Await if it's an async function
    const allCat = await Category.find({});
    return NextResponse.json(allCat, { status: 200 });
  } catch (err) {
    console.error("Category::",err);
    return NextResponse.json({ message: err});
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase(); // Await if it's an async function
    const existCat = await Category.findOne({ name: data.category });
    if (existCat) {
      return new Response("Category already exists", { status: 400 }); // 400 status for a bad request
    } else {
      const newCat = new Category({
        name: data.category,
        slug: data.category.toLowerCase(),
      });
      console.log(newCat);
      const result = await newCat.save();
      console.log(result);
      return new Response("Data saved successfully", { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response("Failed to process data", { status: 500 });
  }
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {
  return new Response("Hello World DELETE");
}

export async function PATCH(request: Request) {
  return new Response("Hello World PATCH");
}




