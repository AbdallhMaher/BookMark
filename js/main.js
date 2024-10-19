"use strict";
let bookName = document.querySelector('#name');
let bookUrl = document.querySelector('#url');
let addButton = document.querySelector('#addBtn');
let tableBody = document.querySelector('#tableBody');
let searchInput = document.querySelector('#searchInput');
let alertBoxName = document.querySelector('#alertName');
let alertBoxUrl = document.querySelector('#alertUrl');
let currentIndex = null;
let animatedRowIndex= null;
let bookMarks=[];

if (localStorage.getItem("bookMarks") != null) {
  bookMarks = JSON.parse( localStorage.getItem("bookMarks"))
  displayBooks();
  toggleSearchBar()
}
function toggleSearchBar() {
  searchInput.parentElement.style.display =bookMarks.length > 0 ?'block':'none';
}
function validateSiteName() {
  const name=bookName.value.trim();
  const siteNamePattern =  /^[a-zA-Z][a-zA-Z0-9-_ ]{2,49}$/;
  if (name ==="") {
    alertBoxName.classList.remove('d-none');
    alertBoxName.firstElementChild.innerHTML ='name is requerid'    
    return false
  }
  if (!siteNamePattern.test(name)) {
    alertBoxName.classList.remove('d-none');
    alertBoxName.firstElementChild.innerHTML = 'Invalid name: use 3-50 characters (letters, numbers, hyphens, underscores)';
    return false;
  }
  for (let i = 0; i < bookMarks.length; i++) {
    if (name === bookMarks[i].siteName && i !==currentIndex) {
      alertBoxName.classList.remove('d-none');
      alertBoxName.firstElementChild.innerHTML ='name already exists'    
      return false
    }
    
  }
  alertBoxName.classList.add('d-none');  
  return true
}
function validateSiteUrl() {
  const url=bookUrl.value.trim();
  const urlPattern = /^(https?:\/\/)?([\w.-]+)+\.\w{2,}(\/\S*)?$/;
  
  for (let i = 0; i < bookMarks.length; i++) {
    if (url === bookMarks[i].siteUrl &&i !==currentIndex) {
      alertBoxUrl.classList.remove('d-none');
      alertBoxUrl.firstElementChild.innerHTML ='url already exists'    
      return false
    }
    
  }
  if (url ==="") {
    alertBoxUrl.classList.remove('d-none');
    alertBoxUrl.firstElementChild.innerHTML ='url is requerid'
    console.log('url is requerid');
    return false
  }
  if (!urlPattern.test(url)) {
    alertBoxUrl.classList.remove('d-none');
    alertBoxUrl.firstElementChild.innerHTML = 'Please enter a valid URL (e.g., https://example.com)';    
    return false;
  }
  alertBoxUrl.classList.add('d-none');  
  return true
  
}
addButton.addEventListener('click',function (eventInfo) {
  const isNameValid = validateSiteName();
  const isUrlValid = validateSiteUrl();
   if (isNameValid && isUrlValid) {
    let bookMark={
      siteName : bookName.value,
      siteUrl : bookUrl.value
     }
    if (currentIndex !== null) {
      bookMarks[currentIndex] = bookMark;
      addButton.innerHTML = 'Submit';
      animatedRowIndex =currentIndex;
      currentIndex = null;       

    }else{
  
       bookMarks.push(bookMark);   
       animatedRowIndex =bookMarks.length -1;
    }
     
     localStorage.setItem("bookMarks",JSON.stringify(bookMarks))
     displayBooks();
     clearForm();
     toggleSearchBar();
   }
})

function displayBooks() {
  let marks = ``;
  for (let i = 0; i < bookMarks.length; i++) {
     marks +=`
     <tr id="row-${i}">
     <td>${i+1}</td>
     <td>`+bookMarks[i].siteName+`</td>
     <td> <a href=`+bookMarks[i].siteUrl+` class="btn btn-primary" target="_blank">visit</a>
     </td>
     <td><button onclick="uptadeBook(${i});"class="btn btn-outline-danger btn-sm">Uptade</button></td>
     <td><button onclick="deleteBook(${i});" class="btn btn-outline-warning btn-sm">Delete</button></td>
     </tr>
     `    
  }
  tableBody.innerHTML=marks;
  if (animatedRowIndex !== null) {
    const animatedRow = document.querySelector(`#row-${animatedRowIndex}`);
    animatedRow.classList.add('add-animation');
    setTimeout(() => animatedRow.classList.remove('add-animation'), 1500);
    animatedRowIndex = null; // Reset the index after animation
  }
}
searchInput.addEventListener('keyup',function () {
  let searchValue =searchInput.value.toLowerCase();
  let marks = ``;
  for (let i = 0; i < bookMarks.length; i++) {
    if (bookMarks[i].siteName.toLowerCase().includes(searchValue)===true) {
      marks +=`
     <tr>
     <td>${i+1}</td>
     <td>`+bookMarks[i].siteName.toLowerCase().replace(searchValue,"<span class='text-danger fw-bold'>"+searchValue +"</span>")+`</td>
     <td> <a href=`+bookMarks[i].siteUrl+` class="btn btn-primary" target="_blank">visit</a>
     </td>
     <td><button onclick="uptadeBook(${i});"class="btn btn-outline-danger btn-sm">Uptade</button></td>
     <td><button onclick="deleteBook(${i});" class="btn btn-outline-warning btn-sm">Delete</button></td>
     </tr>
     `    
      
    }
    
  }
  tableBody.innerHTML=marks;

})
function uptadeBook(index) {
   currentIndex = index;
  bookName.value = bookMarks[index].siteName;
  bookUrl.value =bookMarks[index].siteUrl;
  addButton.innerHTML ='Uptade';  
  document.querySelector('.form-project').scrollIntoView({
    behavior: 'smooth'  });
}
function deleteBook(index) {
  const row = document.querySelector(`#row-${index}`);  
  row.classList.add('delete-animation');
  setTimeout(()=>{
    bookMarks.splice(index,1);
    localStorage.setItem("bookMarks",JSON.stringify(bookMarks))
     displayBooks();
     toggleSearchBar();
  },1500)
}

function clearForm() {
  bookName.value ="";
  bookUrl.value="";
}

