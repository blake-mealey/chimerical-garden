exports.onRouteUpdate = ({ location }) => scrollToAnchor(location);

function scrollToAnchor(location) {
  if (location && location.hash) {
    const element = document.querySelector(location.hash);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
      });
    }
  }
}
