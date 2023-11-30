import { token } from "./cookies.js";

// Jika token null maka diarahkan ke pmb.ulbi.ac.id
if (token === "") {
	window.location.assign("https://pmb.ulbi.ac.id");
}