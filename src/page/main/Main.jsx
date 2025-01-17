import { useState } from "react";

import { priceCommaHandler } from "../app/common/commonFunction.jsx";

import drinkMenu from "./drinkMenu.js";
import dessertMenu from "./dessertMenu.js";

const Main = () => {
  const [selectedMenu, setSelectedMenu] = useState("drink");

  // 현재 선택한 메뉴 토글
  const currentMenu = selectedMenu === "drink" ? drinkMenu : dessertMenu;

  return (
    <div className="container">
      <h1 className="flex font-paperlogy-8ExtraBold text-black text-4xl pt-10 justify-center">
        어서오세요~
      </h1>

      {/* 메뉴바 */}
      <div className="flex justify-center pt-3">
        <button
          className={`mr-3 px-4 py-2 rounded-lg ${
            selectedMenu === "drink" ? "bg-amber-800 text-white" : ""
          } hover:bg-amber-800`}
          onClick={() => setSelectedMenu("drink")}
        >
          음료
        </button>
        <button
          className={`mr-3 px-4 py-2 rounded-lg ${
            selectedMenu === "dessert" ? "bg-amber-800 text-white" : ""
          } hover:bg-amber-800`}
          onClick={() => setSelectedMenu("dessert")}
        >
          후식
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5">
        {currentMenu &&
          currentMenu?.map((item) => (
            <div
              key={item.seq}
              className="bg-orange-400 rounded-lg shadow-md hover:shadow-lg overflow-hidden cursor-pointer"
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-20 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-gray-700">
                  {priceCommaHandler(item.price)} 원
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Main;
