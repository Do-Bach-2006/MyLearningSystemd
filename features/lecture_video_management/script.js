//import { get_all_courses } from "./utils/get_course_directories.mjs";

//const courses = get_all_courses();

const courses_container = document.getElementById("courses-container");

function create_new_course_button(course_object) {
  //create the div
  const div = document.createElement("div");
  div.classList.add("course");

  //create the content
  const h4 = document.createElement("h4");
  h4.textContent = course_object.name;

  div.appendChild(h4);

  return div;
}

const courses = [
  { name: "bach" },
  { name: "giang" },
  { name: "bill" },
  { name: "thu" },
  { name: "ngoc" },
  { name: "phuoc" },
  { name: "min" },
  { name: "mao" },
  { name: "khoa" },
  { name: "hoc" },
  { name: "duy" },
  { name: "ngan" },
  { name: "nam" },
];

courses.forEach((course) => {
  courses_container.appendChild(create_new_course_button(course));
  console.log("i was here !");
});
