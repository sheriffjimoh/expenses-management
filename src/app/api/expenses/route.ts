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


export async function PUT(request: Request) {
  return new Response("Hello World PUT");
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await connectToDatabase(); // Await if it's an async function
    const existingExpense = await Expense.findOne({ _id: id });

    if (!existingExpense) {
      return new Response("Expenses does not exist", { status: 400 });
    } else {
      await Expense.deleteOne({ _id: id });
      return new Response("Data deleted successfully", { status: 200 });
    }
  } catch (err) {
    console.error("DELETE Expenses ERROR::",err);
    return new Response("Failed to process data", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  return new Response("Hello World PATCH");
}
