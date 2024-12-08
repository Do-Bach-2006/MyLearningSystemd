function getAvailableLearningSource() {
  /*@params
   * this function return the  first available website in the list of possible course pages
   *
   * */

  // TODO: implement the function to get the available course pages and return the link
  const COURSE_URLS = [
    "https://tutsnode.org/",
    "https://tutsnode.net/",

    "https://tutflix.org/",
    "https://duforum.in/",
  ];

  //TODO: inspect link goes here !
  //

  return COURSE_URLS[0];
}

// TODO: implement a function to set the iframe with the available course page , then when user click return , we use the available course page

function changeIframeToTutsNode() {
  const iframe = document.getElementById("displayIFrame");
  availableCoursePage = getAvailableLearningSource();
  iframe.src = availableCoursePage;
}
