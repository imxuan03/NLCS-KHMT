//Cập nhật số lượng vé trong Chuyến bay của tôi
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if(inputsQuantity.length>0){
    inputsQuantity.forEach(input => {
        input.addEventListener("change", (e)=> {
            const flightId = input.getAttribute("flight-id");
            const quantity = parseInt(input.value) ;

            if(quantity>0){
                 window.location.href = `/cart/update/${flightId}/${quantity}`
            }
           
        })
    })
}
//End Cập nhật số lượng vé trong Chuyến bay của tôi