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
    console.log(NextResponse.json(allCat, { status: 200 }));
    return NextResponse.json(allCat, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to process data" });
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

// export async function POST(request: Request) {
//   try {
//     const json = await request.json();
//     const filePath = path.resolve("src/app/data/category.json");
//     let data = await readFile(filePath, "utf8");
//     console.log(data);
//     let existingData = [];
//     if (data) {
//       existingData = JSON.parse(data);
//       // Check if the category already exists in the JSON file before saving it
//       const categoryExists = existingData.find(
//         (item: { category: any }) => item.category === json.category
//       );
//       if (categoryExists) {
//         return new Response("Category already exists", { status: 400 });
//       }
//     }
//     json.id = existingData.length + 1;
//     json.slug = json.category.toLowerCase().replace(/ /g, "-");
//     json.date = new Date().toISOString();
//     existingData.push(json);
//     // Write the updated data back to the JSON file
//     await writeFile(filePath, JSON.stringify(existingData, null, 2));

//     return new Response("Data saved successfully", { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response("Failed to process data", { status: 500 });
//   }
// }

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {
  return new Response("Hello World DELETE");
}

export async function PATCH(request: Request) {
  return new Response("Hello World PATCH");
}
