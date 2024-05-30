const { readFile, writeFile } = require("fs").promises;
import path from "path";
import data from "../../data/category.json";

export async function GET(request: Request) {
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  });
}
export async function HEAD(request: Request) {
  return new Response("Hello World HEAD");
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const filePath = path.resolve("src/app/data/category.json");
    let data = await readFile(filePath, "utf8");

    let existingData = [];
    if (data) {
      existingData = JSON.parse(data);
      // Check if the category already exists in the JSON file before saving it
      const categoryExists = existingData.find(
        (item: { category: any }) => item.category === json.category
      );
      if (categoryExists) {
        return new Response("Category already exists", { status: 400 });
      }
    }
    json.id = existingData.length + 1;
    json.slug = json.category.toLowerCase().replace(/ /g, "-");
    json.date = new Date().toISOString();
    existingData.push(json);
    await writeFile(filePath, JSON.stringify(existingData, null, 2));

    return new Response("Data saved successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to process data", { status: 500 });
  }
}

export async function PUT(request: Request) {
}

export async function DELETE(request: Request) {
  return new Response("Hello World DELETE");
}

export async function PATCH(request: Request) {
  return new Response("Hello World PATCH");
}
