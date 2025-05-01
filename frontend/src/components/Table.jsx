import React, { useState } from "react";
//import axios from "axios";

const Table = ({ heading, items }) => {
  const handleClick = (item) => {
    // Handle the click event here, e.g., navigate to another page or show details
    console.log(`Clicked on item: ${item}`);
  };
  const [selectedIndex, setselectedIndex] = useState(1);

  return (
    <>
      <h1 className="text-orange-200 font-extrabold text-3xl mx-auto text-center my-12">
        {heading}
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-10">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                onClick={() => {
                  handleClick(item);
                  setselectedIndex(index);
                }} // Add onClick event to each row
                key={item}
                className={
                  selectedIndex === index
                    ? "bg-red-700"
                    : "odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                }
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
