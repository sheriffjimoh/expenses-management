"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [category, setCategory] = useState("");

  const [data, setData] = useState([]);

  async function fetchData() {
    try {
      await fetch("api/category")
        .then((response) => response.json())
        .then((data) => setData(data));
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
        .then((data) =>{
            if(data.status === 400){
              alert("Category already exists");
            }
            if (data.status === 500){
              alert("Failed to process data");
            }
            if (data.status === 200){
              alert("Data saved successfully");
               setCategory("");
            }
    })
        .catch((error) => console.log(error));
      
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="shadow-md md:min-w-xl p-3">
      <form className="flex  items-center justify-center">
        <input
          type="text"
          placeholder="Category"
          className="border border-gray-300 text-black rounded p-2 "
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white  p-2"
          onClick={(e) => {
            e.preventDefault();
            saveDataToJSON();
          }}
        >
          Submit
        </button>
      </form>
      <div className="flex flex-col items-center justify-center mt-5">
        <h2 className="text-lg font-bold">Category List</h2>
        <ul className="mt-3 w-full">
          {data.map((item: { slug: string; category: String}) => (
           // display it in a list with link to the category page
            <li key={item.slug} className="text-blue-500 dark:bg-slate-200 p-4 my-3">
              <a href={`/${item.slug}`} className="flex justify-between w-full">
                <span className="text-gray-500">{item.category}</span>

              <span className="text-gray-500">N2,00000</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </main>
  );
}
