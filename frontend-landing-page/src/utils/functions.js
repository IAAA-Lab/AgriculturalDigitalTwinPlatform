function copy() {
  const el = document.createElement("input");
  el.value = window.location.href;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

function getFormattedDate(date) {
  return date.split("T")[0];
}

export { copy, getFormattedDate };
