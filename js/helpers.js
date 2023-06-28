export function debounce(func, delay){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  }
}

export function saveToLocalStorage(name, data){
  window.localStorage.setItem(name, data);
}

export function loadFromLocalStorage(name){
  return window.localStorage.getItem(name);
}