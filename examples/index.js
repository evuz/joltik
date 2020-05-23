/** @jsx j */
import { updateElement, j, render } from "../src";
import { enableHooks } from "../src/hooks";
import { Greeting } from "./greeting";
import { ListWithStyles } from "./list-with-styles";
import { List1, List2 } from "./lists";
import { Post } from "./post";
import { Counter } from "./counter";

enableHooks();

// Counter example
render(<Counter />, document.getElementById("counter"));

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
