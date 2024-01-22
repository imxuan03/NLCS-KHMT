// Button Status 
const buttonStatus = document.querySelectorAll("[button-status]");

let url = new URL(window.location.href);

if(buttonStatus.length>0){
    buttonStatus.forEach(button => {
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("button-status");

            // url.searchParams.set("status", status);
            if(status !=""){
                url.searchParams.set("status", status);
            }else{
                url.searchParams.delete("status");
            }

            //chuyển hướng theo url đó
            window.location.href = url.href;
        })
    });
}

//End Button Status 

// form Search  
const formSearch = document.querySelector("#form-search")

if(formSearch){
    formSearch.addEventListener("submit", (e)=>{

        let url = new URL(window.location.href);

        //ngăn ngừa hành vi mặc định, tránh load lại trang
        e.preventDefault();

        const value = e.target.elements.keyword.value;

        if(value !=""){
            url.searchParams.set("keyword", value);
        }else{
            url.searchParams.delete("keyword");
        }

        //chuyển hướng theo url đó
        window.location.href = url.href;
    }); 
}
// end form Search 