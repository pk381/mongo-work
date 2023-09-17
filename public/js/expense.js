
// displaying user name
document.getElementById("user_name").innerText = localStorage.getItem('userName');


let expenses = document.getElementById("items");

let details = document.querySelectorAll("input");

const token = localStorage.getItem('token');

document.getElementById("submit").addEventListener("click",async (e) => {
  
  e.preventDefault();

  let obj = {
    amount: details[0].value,
    description: details[1].value,
    category: document.getElementById("category").value
  };

  try {

    const res = await axios.post('http://localhost:4000/expense/add-expense', obj, { headers: {Authorization: token } });

    addExpense(res.data.expense);

    details[0].value = "";
    details[1].value = "";
    document.getElementById("category").value = "";
    
  } catch(err) {
    console.log(err);
  }
});

window.addEventListener("DOMContentLoaded", async () => {

  try {
    const page = 1;
    await showPage(page, 3);  
  } 
  catch(err) {
    console.log(err);
  }
});

let dynamicPagination = document.getElementById("dynamic_pagination");

dynamicPagination.addEventListener("change", ()=>{
  let pageSize = parseInt(dynamicPagination.value);

  showPage(1, pageSize);

});

async function showPage(page, pageSize){

  expenses.innerHTML = "";

  console.log("showPage");

  const res = await axios.get(`http://localhost:4000/expense/get-expenses?page=${page}&pageSize=${pageSize}`,{headers:{"Authorization":token}});

  for (var i = 0; i < res.data.expenses.length; i++) {

    console.log(res.data.expenses[i]);
      addExpense(res.data.expenses[i]);
  }

  showPagination(res.data, pageSize);

}


function showPagination(details, pageSize){

  console.log(details);

  console.log("showpagination");

  let newItem = document.createElement("li");

  newItem.className = "list-group-item mx-1";

  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");

  prevBtn.appendChild(document.createTextNode("Page "+ details.previousPage));
  prevBtn.className = "btn btn-black btn-sm mx-1 float-left";

  nextBtn.appendChild(document.createTextNode("Page " + details.nextPage));
  nextBtn.className = "btn btn-black btn-sm float-right";


  if(details.hasNextPage){
    console.log("next ",details.hasNextPage);
    newItem.appendChild(nextBtn);
  }
  if(details.hasPreviousPage){
    console.log("pre ",details.hasPreviousPage);

    newItem.appendChild(prevBtn);
  }

  prevBtn.onclick = ()=>{
    showPage(details.previousPage, pageSize);
  }

  nextBtn.onclick = ()=>{
    showPage(details.nextPage, pageSize);
  }

  expenses.appendChild(newItem);
  
}


function addExpense(obj) {
  
  let newItem = document.createElement("li");

  newItem.className = "list-group-item m-1 py-1";

  newItem.appendChild(
    document.createTextNode("" + obj.amount + " " + obj.description + " " + obj.category)
  );

  let deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger btn-sm float-right";

  deleteBtn.appendChild(document.createTextNode("Delete"));

  newItem.appendChild(deleteBtn);

  deleteBtn.onclick = async (e)=>{

    let li = e.target.parentElement;

    console.log("deleting");

    try{

    console.log(obj);
     await axios.delete(`http://localhost:4000/expense/delete-expense/${obj._id}`,
      {headers:{"Authorization":token}});
     expenses.removeChild(li);
    }
    catch(err){
      console.log(err);
    }
    
  };

  expenses.appendChild(newItem);
}
