/** @jsx j */
import { updateElement, j, render, createElement } from "../src";
import { Greeting } from "./greeting";
import { ListWithStyles } from "./list-with-styles";
import { List1, List2 } from "./lists";
import { Post } from "./post";
import { Counter } from "./counter";

// Counter example
const counter = document.getElementById("counter");
let component = <Counter onClick={handleClick} />;

render(component, counter);

function handleClick() {
  counter.firstChild.replaceWith(createElement(component));
}

// Static example
render(Post, document.getElementById("static"));

// Diffing example
const diffing = document.getElementById("diffing");
render(List1, diffing);
document.getElementById("reload").addEventListener("click", () => {
  updateElement(diffing, List2, List1);
});

// Props example
render(ListWithStyles, document.getElementById("props"));

// Functional component
render(<Greeting name={"Dani"} />, document.getElementById("functional"));
