const isPremium = localStorage.getItem("isPremium");

// console.log("isPremium ", isPremium);

if (isPremium === "true") {
  console.log("premium user");
  document.getElementById("buy_premium").style.visibility = "hidden";
  document.querySelector("#msg").textContent = "Premium User";
} else {
  document.getElementById("premium").style.visibility = "hidden";
  document.getElementById("premium_user").style.visibility = "hidden";

  // console.log("not a premium user");
}

document.getElementById("leaderBoardBtn").addEventListener("click", async ()=> {

  try {
    let token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:4000/premium/leaderboard",
      {
        headers: { Authorization: token },
      }
    );

    let boardList = document.getElementById("leaderBoard");
    
    // console.log(res);

    res.data.forEach((details) => {

      let newItem = document.createElement("li");
      
      newItem.className = "list-group-item my-1 py-1 px-3";

      newItem.appendChild(
        document.createTextNode(
          `Name:- ${details.name} Total Expense:- ${details.totalExpense}`
        )
      );

      boardList.appendChild(newItem);
    });
  } catch (err) {
    console.log(err);
  }

});


document.getElementById("downloadBtn").addEventListener("click", async ()=>{
  
  try{
    const res = await axios.get("http://localhost:4000/premium/download", 
    {
      headers: { Authorization: token }
    });

    if(res.status === 201){
      
      var a = document.createElement("a");
      a.href = res.data.url;
      a.download = "my-expense.csv";
      a.click();
    }
    else{
      console.log("some error");
    }
    
  }
  catch(err){
    console.log(err);
  }
});


document.getElementById("show_user_files").addEventListener("click", async()=>{

  // console.log("geting files");
  
  try{

    const res = await axios.get("http://localhost:4000/premium/all-files",{
      headers: { Authorization: token },
    });

    console.log(res.data.fileUrls);

    res.data.fileUrls.forEach(row =>{
      console.log(row.createdAt)
      download(row.fileUrl, row.createdAt);
    });
    
  } 
  catch (err) {
    console.log(err);
  }
});

function download(url, time){

  try{

    let fileList = document.getElementById("files");
    let li = document.createElement("li");

    li.className = "list-group-item my-1 mx-0";
    let downloadBtn = document.createElement('button');
    downloadBtn.className = "btn btn-black btn-sm float-right";

    let date = document.createTextNode(time);

    li.appendChild(date);
    downloadBtn.appendChild(document.createTextNode("Download again"));

    downloadBtn.onclick = ()=>{

      var a = document.createElement("a");
      a.href = url;
      a.download = "my-expense.csv";
      a.click();

    }
  
    li.appendChild(downloadBtn);
    fileList.appendChild(li);
  }
  catch(err){
    console.log(err);
  }


}

