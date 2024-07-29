// src/GraphNetwork.js

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Modal from "./Modal";
import { arrayImages } from "./dataimg";

const GraphNetwork = ({
  nodes,
  links,
  setLinkElement,
  setNodeElement,
  showX,
}) => {
  const [inptValue, setInpValue] = useState({ value: "" });
  const [item, setItem] = useState({});
  const [path, setPath] = useState({ value: "" });
  const svgRef = useRef();
  const [showPop, setShowPop] = useState(false);
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content
    const width = 900;
    const height = 700;

    // Define arrowhead marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 35)
      .attr("refY", 0)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Create simulation
    svg.call(
      d3
        .zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", function () {
          container.attr("transform", d3.event.transform);
        })
    );

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(230)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 2)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value))
      .attr("marker-end", "url(#arrowhead)");
    // Draw nodes
    const container = svg.append("g");

    const node = container
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation, container))
      .on("click", showModal);
    node.append("circle").attr("r", 28).attr("fill", "#000");

    node.append("title").text((d) => d.id);

    node
      .append("image")
      .attr("xlink:href", (d) => d.img)
      .attr("x", -25)
      .attr("y", -25)
      .attr("width", 50)
      .attr("class", "rounded-img") // Apply class for circular images
      .attr("height", 50);

    node
      .append("text")
      .attr("dy", 50)
      .attr("text-anchor", "middle")
      .text((d) => d.name);

    if (showX) {
      node
        .append("text")
        .attr("dx", -10) // Adjust x position as needed
        .attr("dy", -35) // Adjust y position as needed (above the node)
        .attr("font-size", 12)
        .attr("class", "emoji")
        .attr("fill", "red")
        .text("❌")
        .style("cursor", "pointer")
        .on("click", function (event, d) {
          event.stopPropagation();
          const deletedNode = nodes.filter((item) => item.id !== d.id);
          const deletedLink = links.filter(
            (item) => item.source.id !== d.id && item.target.id !== d.id
          );
          const deletedItem = arrayImages.filter(
            (item) => item.id.toLowerCase() === d.id.toLowerCase()
          );
          alert(`${deletedItem[0].name} deleted successfully`);
          setNodeElement(deletedNode);
          setLinkElement(deletedLink);
        });
    }

    // Update simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag behavior
    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // .style.borderRadius = "50%";
  }, [nodes, links, showX]);

  const showModal = (event, d) => {
    setItem(d);
    setInpValue({ value: d.name });
    setPath({ value: d.img });
    console.log(d);
    setShowPop((prev) => !prev);
  };

  const updateNode = () => {
    const updatedItem = {
      id: item.id,
      name: inptValue.value,
      img: path.value,
      index: item.index,
      vx: item.vx,
      vy: item.vy,
      x: item.x,
      y: item.y,
      fx: item.fx,
      fy: item.fy,
    };
    const index = nodes.findIndex((itm) => itm.id === updatedItem.id);
    nodes[index] = updatedItem;
    const arrNodes = [...nodes];
    setNodeElement(arrNodes);
    console.log(links);

    const newLinkElements = links.map((link) => ({
      ...link,
      source: link.source.id === updatedItem.id ? updatedItem : link.source,
      target: link.target.id === updatedItem.id ? updatedItem : link.target,
    }));
    console.log(newLinkElements);
    setLinkElement(newLinkElements);
    setShowPop(false);
  };

  return (
    <div className="flex flex-">
      <svg
        ref={svgRef}
        className="border-2 rounded shadow-lg mt-5 w-[90%] mx-auto"
        height={600}
      />
      <Modal isOpen={showPop} setIsOpen={setShowPop}>
        <div className="flex flex-col items-center gap-2 w-full p-2">
          <div className="flex flex-col items-center gap-2 w-full">
            <label className="w-full" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={inptValue.value}
              onChange={(e) => setInpValue({ value: e.target.value })}
              className="p-1 bg-white w-full rounded border shadow "
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="w-full" htmlFor="source#">
              Image Type
            </label>
            <select
              value={path.value}
              onChange={(e) => setPath({ value: e.target.value })}
              id="source#"
              className="border p-1 w-full"
            >
              {arrayImages.map((item) => (
                <option value={item.path}>{item.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={updateNode}
            type="button"
            className="bg-blue-600 text-white p-1 rounded w-52 mt-4"
          >
            Update
          </button>
          {/* <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="w-full" htmlFor="source#">
                Source
              </label>
              <select
                // defaultValue={targetValue}
                // onChange={(e) => setTargetValue(e.target.value)}
                id="source#"
                className="border p-1 w-full"
              >
                {nodes.map((item) => (
                  <option value={item.id}>{item.id}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="w-full" htmlFor="Target#">
                Target
              </label>
              <select
                // defaultValue={targetValue}
                // onChange={(e) => setTargetValue(e.target.value)}
                id="Target#"
                className="border p-1 w-full"
              >
                {nodes.map((item) => (
                  <option value={item.id}>{item.id}</option>
                ))}
              </select>
            </div>
          </div> */}
        </div>
      </Modal>
    </div>
  );
};

export default GraphNetwork;
