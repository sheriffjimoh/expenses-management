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
    <main className="flex min-h-screen flex-col items-center justify-between p-5 mt-10">
      <div className="shadow-md md:min-w-xl p-3">
        <h1 className="text-3xl font-bold text-center my-3">Expenses Management App</h1>
      <form className="flex  items-center justify-center mt-10">
        <input
          type="text"
          placeholder="Category"
          className="border text-black border-gray-300 p-2 m-2 md:w-auto w-full"
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
          Save
        </button>
      </form>
      <div className="flex flex-col items-center justify-center mt-5 w-full">
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
