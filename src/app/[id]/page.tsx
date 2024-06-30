"use client";
import { numberWithCommas } from "@/lib";
import React, { useState, useEffect } from "react";
type Id = {
  params: {
    id: string;
  };
};
export default function Expenses({ params: { id } }: Id) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState({ category: "" });
  const [total, setTotal] = useState(0);

  async function fetchData() {
    try {
      await fetch(`api/expenses`)
        .then((response) => response.json())
        .then((data) => {
          data = data.filter((item: any) => item.categoryId === id);
          setData(data);
          const total = data.reduce(
            (acc: any, item: any) => acc + parseInt(item.amount),
            0
          );
          setTotal(total);
        });
    } catch (error) {
      console.error(error);
    }
  }

  // get category and filter the data based on the category slug

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        await fetch("api/category")
          .then((response) => response.json())
          .then((data) => {
            const category = data.find((item: any) => item._id === id);
            setCategory(category);
          });
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
    fetchData();
  }, [id]);



  function deleteData(id: any) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setIsLoading(true);
      try {
        fetch("api/expenses", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        })
          .then((data) => {
            if (data.status === 400) {
              alert("Category does not exist");
            }
            if (data.status === 200) {
              alert("Data deleted successfully");
              fetchData();
            }
          })
          .catch((error) => console.log(error))
          .finally(() => setIsLoading(false));
      } catch (error) {
        console.error(error);
      }
    }
  }
 
  async function saveDataToJSON() {
    setIsLoading(true);
    const data = {
      categoryId: id,
      amount,
      name,
    };

    try {
      await fetch("api/expenses", {
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
            setName("");
            setAmount("");
            fetchData();
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className='px-5 mt-10'>
      <button
        onClick={() => window.history.back()}
        className='bg-blue-500 text-white p-2 m-2'
      >
        &lt; Back
      </button>
      <div className='shadow-md mx-auto'>
        <div className='flex md:flex-row   justify-between  my-5  w-full border-b'>
          <h1 className='text-xl font-bold text-center my-3'>
            {category?.category}
          </h1>
          <h1 className='text-sm font-bold text-center my-3'>
            Total: {numberWithCommas(total)}
          </h1>
        </div>
        <form className='flex md:flex-row flex-col  items-center justify-center'>
          <input
            type='text'
            placeholder='Name of Expense'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border text-black border-gray-300 p-2 m-2 md:w-auto w-full'
          />
          <input
            type='number'
            placeholder='Amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='border text-black border-gray-300 p-2 m-2 md:w-auto w-full'
          />
          <button
            type='button'
            onClick={saveDataToJSON}
            className='bg-blue-500 text-white p-2 m-2 md:w-auto w-full'
          >
            Save
          </button>
        </form>

        <div className='flex flex-col md:w-auto items-center justify-center mt-10'>
          <h2 className='text-lg font-bold'>Expenses List</h2>
          <ul className='mt-3  w-full'>
            {data.map((item: any) => (
              <li
                key={item.id}
                className='flex justify-between p-2  w-full border-b'
              >
                <span className="capitalize">{item.name}</span>
                <span>{numberWithCommas(Number(item.amount))}</span>

                <button
                  className='bg-red-500 text-white p-2'
                  onClick={() => {
                    deleteData(item._id);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
