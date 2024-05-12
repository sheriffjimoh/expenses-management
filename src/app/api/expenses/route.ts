const { readFile, writeFile } = require("fs").promises;
import path from "path";
import data from "../../data/expenses.json";

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
     const json= await request.json()
    const filePath = path.resolve("src/app/data/expenses.json");
    let data = await readFile(filePath, "utf8");

    let existingData = [];
    if (data) {
      existingData = JSON.parse(data);

      const expensesExist = existingData.find((item: { name: any; category_slug: any }) => item.name === json.name && item.category_slug === json.category_slug);
      if (expensesExist) {
        return new Response("Category already exists", { status: 400 });
      }
    }

    json.id = existingData.length + 1;
    json.date = new Date().toISOString();
    existingData.push(json);
    // Write the updated data back to the JSON file
    await writeFile(filePath, JSON.stringify(existingData, null, 2));

    return new Response("Data saved successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to process data", { status: 500 });
  }
}

export async function PUT(request: Request) {
  return new Response("Hello World PUT");
}

export async function DELETE(request: Request) {
 
    const { id } =  await request.json();
    const filePath = path.resolve("src/app/data/expenses.json");
    let data = await readFile (filePath, "utf8");
   
    let existingData = [];
    if (data) {
      existingData = JSON.parse(data);
      const expensesExist = existingData.find((item: { id: any }) => item.id === id);
      if (!expensesExist) {
        return new Response("Expenses does not exist", { status: 400 });
      }
    }
    const newData = existingData.filter((item: { id: any }) => item.id !== id);

    await writeFile (filePath, JSON.stringify(newData, null, 2));
    return new Response("Data deleted successfully", { status: 200 });

}

export async function PATCH(request: Request) {
  return new Response("Hello World PATCH");
}
