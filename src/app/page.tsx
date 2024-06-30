"use client";
import { numberWithCommas } from "@/lib";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
interface Category {
  _id: string;
  total: number;
  name: string;
}

export default function Home() {
  const [category, setCategory] = useState("");
  const [data, setData] = useState<Category[]>([]);
  // fetch expenses data

  async function fectExpenses(_id: any) {
    let total = 0;
    const response = await fetch("api/expenses");
    let data = await response.json();
    // filter the data based on the category _id
    data = data.filter((item: { categoryId: any }) => item.categoryId === _id);
    // sum the total amount of expenses
    total = data.reduce(
      (acc: any, item: { amount: any }) => acc + Number(item.amount),
      0
    );
    return Math.floor(total);
  }

  async function fetchData() {
    try {
      const { data: categories } = await axios.get("api/category");
      const promises = categories.map(
        async (category: { _id: any; total: number }) => {
          const total = await fectExpenses(category._id);
          category.total = total;
          return category;
        }
      );
      const updatedCategories = await Promise.all(promises);
      setData(updatedCategories);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
 
    fetchData();
  }, [category]);

  async function saveDataToJSON() {
    const data = {
      category,
    };

    try {
      await fetch("api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((data) => {
          if (data.status === 400) {
            alert("Category already exists");
          }
          if (data.status === 500) {
            alert("Failed to process data");
          }
          if (data.status === 200) {
            alert("Data saved successfully");
            setCategory("");
            fetchData();
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-5 mt-10'>
      <div className='shadow-md md:min-w-xl p-3'>
        <h1 className='text-3xl font-bold text-center my-3'>
          Expenses Management App
        </h1>
        <form className='flex  items-center justify-center mt-10 w-full'>
          <input
            type='text'
            placeholder='Category'
            className='border text-black border-gray-300 p-2 m-2  w-full rounded-md'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button
            className='bg-blue-500 text-white  p-2  px-5 rounded-md '
            onClick={(e) => {
              e.preventDefault();
              saveDataToJSON();
            }}
          >
            Save
          </button>
        </form>
        <div className='flex flex-col items-center justify-center mt-5 w-full'>
          <h2 className='text-lg font-bold'>Category List</h2>
          <ul className='mt-3 w-full'>
            {data.map((item: { _id: string; name: String; total: number }) => (
              // display it in a list with link to the category page
              <li
                key={item._id}
                className='text-blue-500 dark:bg-slate-200 p-4 my-3'
              >
                <Link
                  href={`/${item._id}`}
                  className='flex justify-between w-full'
                >
                  <span className='font-bold text-gray-500 capitalize'>{item.name}</span>

                  <span className='text-gray-500'>
                    {numberWithCommas(item?.total)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
