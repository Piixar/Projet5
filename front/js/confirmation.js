        const init = {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : sessionStorage.getItem('confirmation')
        };

        console.log(init);
        
        fetch("http://localhost:3000/api/products/order", init)
        .then((response) => response.json())
        .then((validation) => {
            document.getElementById("orderId").innerText = validation.orderId;
            // // On clear la mémoire
            sessionStorage.removeItem("cart");
            sessionStorage.removeItem("confirmation");
        });

