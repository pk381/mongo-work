let message = document.getElementById('message');

let name = document.getElementById('name');
let email = document.getElementById('email');
let password = document.getElementById('password');

document.getElementById('sign_up').addEventListener('click', async (e)=>{

    e.preventDefault();

    let obj = {
        name: name.value,
        email: email.value,
        password: password.value
    }

    try{
        const res = await axios.post("http://localhost:4000/user/sign_up", obj);

        if(res.data.user === 'userExist'){
            message.innerText = "Email already exist";
        }
        else{

            window.location.href = "/user/login";
        }      
    }
    catch(err){
        console.log(err);
    }
   
});