// function getAvailableLearningSource() {
//   /*@params
//    * this function return the  first available website in the list of possible course pages
//    *
//    * */
//
//   // TODO: implement the function to get the available course pages and return the link
//   const COURSE_URLS = [
//     "https://tutsnode.org/",
//     "https://tutsnode.net/",
//     "https://tutflix.org/",
//     "https://duforum.in/",
//     "https://courseclub.me/",
//     "https://freecoursesite.com/",
//   ];
//
//   //TODO: inspect link goes here !
//   //
//
//   return COURSE_URLS[0];
// }

async function getAvailableLearningSource() {
  /*
   * This function returns the first available website in the list of possible course pages
   * by checking each URL to see if it responds successfully.
   */

  const COURSE_URLS = [
    "https://tutsnode.org/",
    "https://tutsnode.net/",
    "https://tutflix.org/",
    "https://duforum.in/",
    "https://courseclub.me/",
    "https://freecoursesite.com/",
  ];

  for (const url of COURSE_URLS) {
    try {
      const response = await fetch(url, { method: "HEAD" }); // Use HEAD to minimize data transfer
      if (response.ok) {
        return url; // Return the first URL that responds with a 200 OK status
      }
    } catch (error) {
      console.warn(`Failed to fetch ${url}:`, error.message);
      // Continue to the next URL if there's a network or fetch error
    }
  }

  return "../pages/sorryPage.html"; // Return null if no website responds successfully
}

// TODO: implement a function to set the iframe with the available course page , then when user click return , we use the available course page

async function changeIframeToTutsNode() {
  const iframe = document.getElementById("displayIFrame");
  availableCoursePage = await getAvailableLearningSource();
  console.log(availableCoursePage);
  iframe.src = availableCoursePage;
}
