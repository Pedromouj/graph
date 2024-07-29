// src/App.js

import React, { useEffect, useState } from "react";
import GraphNetwork from "./Graph/GraphNetwork";
import { arrayImages } from "./Graph/dataimg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faX } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const nodes = [
    { id: "banana", name: "banana", img: "/img/banana.jfif" },
    { id: "apple", name: "apple", img: "/img/apple.jfif" },
    { id: "strawberry", name: "strawberry", img: "/img/strawberry.jfif" },
  ];

  const links = [
    { source: "banana", target: "apple", value: 1 },
    { source: "strawberry", target: "banana", value: 1 },
    { source: "strawberry", target: "apple", value: 1 },
  ];
  const [showX, setShowX] = useState(false);

  const [nodeElment, setNodeElement] = useState(nodes);
  const [linkElment, setLinkElement] = useState(links);
  const [sourceValue, setSourceValue] = useState("banana");
  const [targetValue, setTargetValue] = useState("strawberry");
  const [inptValue, setInptValue] = useState("");

  const addElementInGraph = () => {
    const link = { source: sourceValue, target: targetValue, value: 1 };
    setLinkElement((prev) => [...prev, link]);
    console.log(linkElment);
  };

  const addNode = () => {
    const selectedImg = arrayImages.filter((item) =>
      item?.name?.toLowerCase().includes(inptValue?.toLowerCase())
    );
    const path =
      selectedImg.length !== 0 ? selectedImg[0].path : "/img/Noimage.png";
    const node = { id: inptValue, name: inptValue, img: path };
    setNodeElement((prev) => [...prev, node]);
  };

  return (
    <div>
      <div className="flex items-center gap-10 w-[90%] mx-auto mt-5  overflow-auto ">
        <div className="w-1/2 flex flex-col px-1 items-center gap-1">
          <label className="font-medium text-left w-full" htmlFor="ad_node">
            Add new node :
          </label>
          <div className="flex items-center gap-1 w-full">
            <input
              type="text"
              id="ad_node"
              placeholder="grapes , orange , lemon...."
              onChange={(e) => setInptValue(e.target.value)}
              className="p-1 bg-white border shadow  w-full rounded outline-none px-1"
            />
            <button
              onClick={addNode}
              className="bg-blue-600 text-white p-1 w-24 rounded"
            >
              Add
            </button>
          </div>
        </div>
        <div className="w-[50%] flex  items-center gap-1 mt-5">
          <div className="flex  w-full gap-5 items-center">
            <label className=" font-medium " htmlFor={"source#"}>
              Source:
            </label>
            <select
              defaultValue={sourceValue}
              onChange={(e) => setSourceValue(e.target.value)}
              id="source#"
              className="border p-1 shadow rounded cursor-pointer"
            >
              {nodeElment.map((item) => (
                <option value={item.id}>{item.id}</option>
              ))}
            </select>

            <label className=" font-medium " htmlFor={"target#"}>
              Target:
            </label>
            <select
              defaultValue={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              id="target#"
              className="border p-1  shadow rounded cursor-pointer"
            >
              {nodeElment.map((item) => (
                <option value={item.id}>{item.id}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={addElementInGraph}
          className="w-[25%] bg-blue-600 text-white p-1  rounded mt-5 "
        >
          add
        </button>
        <button
          onClick={() => setShowX((prev) => !prev)}
          className="w-[25%] h-8 bg-red-600 text-white p-1 font-bold flex items-center justify-center rounded mt-5 "
        >
          <FontAwesomeIcon
            icon={showX ? faX : faTrash}
            className="text-white w-4 h-4"
          />
        </button>
      </div>
      <i className="flex  mt-2 w-[90%] mx-auto">
        You can add any fruit you want.
      </i>
      <GraphNetwork
        nodes={nodeElment}
        links={linkElment}
        setNodeElement={setNodeElement}
        setLinkElement={setLinkElement}
        showX={showX}
      />
    </div>
  );
};

export default App;
