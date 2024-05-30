const { readFile, writeFile } = require("fs").promises;
import path from "path";
import data from "../../data/expenses.json";
import { Category, Expense, connectToDatabase } from "@/lib/mongoDb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase(); // Await if it's an async function
    const allExp = await Expense.find({});
    console.log(NextResponse.json(allExp, { status: 200 }));
    return NextResponse.json(allExp, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to process data" });
  }
}

export async function HEAD(request: Request) {
  return new Response("Hello World HEAD");
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    await connectToDatabase(); // Await if it's an async function
    const existingExpense = await Expense.findOne({
      name: json.name,
      categoryId: json.categoryId,
    });
    console.log(existingExpense);
    if (existingExpense) {
      return new Response("Expenses already exists", { status: 400 });
    } else {
      const newExpenses = new Expense({
        categoryId: json.categoryId,
        amount: json.amount,
        name: json.name,
      });
      // Save the expense to the database
      const result = await newExpenses.save();
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
//     console.log(json);
//     const filePath = path.resolve("src/app/data/expenses.json");
//     let data = await readFile(filePath, "utf8");

//     let existingData = [];
//     if (data) {
//       existingData = JSON.parse(data);

//       const expensesExist = existingData.find(
//         (item: { name: any; category_slug: any }) =>
//           item.name === json.name && item.category_slug === json.category_slug
//       );
//       if (expensesExist) {
//         return new Response("Category already exists", { status: 400 });
//       }
//     }

//     json.id = existingData.length + 1;
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

export async function PUT(request: Request) {
  return new Response("Hello World PUT");
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const filePath = path.resolve("src/app/data/expenses.json");
  let data = await readFile(filePath, "utf8");

  let existingData = [];
  if (data) {
    existingData = JSON.parse(data);
    const expensesExist = existingData.find(
      (item: { id: any }) => item.id === id
    );
    if (!expensesExist) {
      return new Response("Expenses does not exist", { status: 400 });
    }
  }
  const newData = existingData.filter((item: { id: any }) => item.id !== id);

  await writeFile(filePath, JSON.stringify(newData, null, 2));
  return new Response("Data deleted successfully", { status: 200 });
}

export async function PATCH(request: Request) {
  return new Response("Hello World PATCH");
}
