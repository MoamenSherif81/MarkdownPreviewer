import { debounce, loadFromLocalStorage, saveToLocalStorage } from "./helpers.js";

const markdownTextArea = document.querySelector('.markdown__textarea');
const markdownPreviwer = document.querySelector('.markdown__preview');
const markdownDocs = document.querySelector('.markdown__docs');
const markdownEditor = document.querySelector('.markdown__editor');
const navItems = document.querySelectorAll('.nav__item');
const tabItems = document.querySelectorAll('.tab__item');
const LOCAL_STORAGE_NAME = `markdown`;

initializeApp();

function initializeApp(){
  markdownTextArea.innerHTML = loadFromLocalStorage(LOCAL_STORAGE_NAME) || '';
  markdownParser();

  markdownTextArea.addEventListener('input', debounce(() => markdownParser(), 500));
  markdownTextArea.addEventListener('keydown', handleTabClick);

  getDocsData();

  navItems.forEach(navItem => navItem.addEventListener('click', () => handleNavClick(navItem)));
}

function handleNavClick(element){
  const target = element.dataset.target;
  if(target === 'markdown__docs'){
    markdownDocs.classList.remove('d-none')
    markdownEditor.classList.add('d-none')
  } else {
    markdownDocs.classList.add('d-none')
    markdownEditor.classList.remove('d-none')
    tabItems.forEach(tabItem => {
      if(tabItem.dataset.id === target) 
        tabItem.classList.add('active');
      else 
        tabItem.classList.remove('active');
    })
  }
}

function markdownParser(){
  markdownPreviwer.innerHTML = marked.parse(markdownTextArea.value);
  
  hljs.highlightAll();

  saveToLocalStorage(LOCAL_STORAGE_NAME, markdownTextArea.value);
}

function handleTabClick(e){
  const textArea = e.target;
  if (e.key == 'Tab') {
    e.preventDefault();

    //Get Start and End positions of current selection
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;

    const charCount = countTabsNeeded(textArea.value, start, end);

    textArea.value = addTabsToString(textArea.value, start, end);
    
    textArea.selectionStart = start + 1;
    textArea.selectionEnd = end + charCount;

    markdownEditorHandler();
  }
}

function countTabsNeeded(str, start, end){
  console.log(str);
  return str.substring(start, end).split('\n').length;
}

function addTabsToString(str, start, end){
  return str.substring(0, start) + "\t" + 
  str.substring(start, end).replace('\n', '\n\t') + 
  str.substring(end);
}

function getDocsData(){
  fetch('./data/data.json')
    .then(res => res.json())
    .then(data => displayDocsData(data.basic_syntax))
}

function displayDocsData(data){
  let dataHtml = '';
  data.forEach((ele) => {
    let examples = '';
    ele.examples.forEach((example) => { 
      examples += `
        <div class="single__example">
          <h4>Markdown:</h4>
          <p>${example.markdown}</p>
          <h4>Preview:</h4>
          <p>${example.html}</p>
        </div>
      `
    })
    dataHtml += `
      <div class="docs__item">
        <h3>${ele.name}</h3>
        <p>${ele.description}</p>
        <div class="docs__examples">
          ${examples}
        </div>
      </div>
      <hr />
    `
  })
  markdownDocs.innerHTML = dataHtml;
  hljs.highlightAll();
}

//Some Configurations to marked library to remove the warnings
marked.use({
  mangle: false,
  headerIds: false
});