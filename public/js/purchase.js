document.getElementById("buy_premium").addEventListener("click", async () => {

  try {
    let token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:4000/purchase/premiummembership",
      { headers: { Authorization: token } }
    );

    const options = {
      key: res.data.key_id,
      order_id: res.data.order.id,

      handler: async function (result) {
        const res = await axios.post(
          "http://localhost:4000/purchase/updatestatus",
          {
            order_id: options.order_id,
            payment_id: result.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("you are premium member");

        document.getElementById("buy_premium").style.visibility = "hidden";
        document.querySelector("#msg").textContent = "You Are Premium User";

        console.log(res.data.token)
    
        localStorage.setItem("token", res.data.token);
        localStorage.setItem('isPremium', true);
        
        window.location.href = "/expense"
      },
    };

    const rzpl = new Razorpay(options);

    rzpl.open();
    rzpl.on("payment.failed", async function (res) {
      await axios.post(
        "http://localhost:4000/purchase/updatefailure",
        {
          order_id: res.data.order.id,
        },
        { headers: { Authorization: token } }
      );
      alert("something went wrong");
    });
  } catch (err) {
    console.log(err);
  }
});
