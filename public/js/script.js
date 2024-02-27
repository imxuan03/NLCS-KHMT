// Sort 
const sort = document.querySelector("[sort]");

if(sort){
    let url = new URL(window.location.href);

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");


    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

            //chuyển hướng theo url đó
        window.location.href = url.href;
    })

    //xóa sắp xếp
    sortClear.addEventListener("click", ()=> {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    })

    //hiển thị lựa chọn
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    if(sortKey&&sortValue){
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected=true;
    }
}
// End Sort 

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]")
if(buttonPagination.length>0){
    let url = new URL(window.location.href);

    buttonPagination.forEach(button=>{
        button.addEventListener("click", ()=>{
            const page = button.getAttribute("button-pagination");
               
            url.searchParams.set("page", page);

            //chuyển hướng theo url đó
            window.location.href = url.href;

        });
    });
}
//End Paginantion

// form Search  
const formSearch = document.querySelector("[form-search]")

if(formSearch){
    formSearch.addEventListener("submit", (e)=>{

        let url = new URL(window.location.href);

        //ngăn ngừa hành vi mặc định, tránh load lại trang
        e.preventDefault();
        
        //Điểm đi
        const departureCity = e.target.elements.departureCity.value;
        const departureDate = e.target.elements.departureDate.value;
        //Điểm đến
        const arrivalCity = e.target.elements.arrivalCity.value;
        const arrivalDate = e.target.elements.arrivalDate.value;

        if(departureCity !=""){
            url.searchParams.set("departureCity", departureCity);
        }else{
            url.searchParams.delete("departureCity");
        }

        if(departureDate !=""){
            url.searchParams.set("departureDate", departureDate);
        }else{
            url.searchParams.delete("departureDate");
        }

        if(arrivalCity !=""){
            url.searchParams.set("arrivalCity", arrivalCity);
        }else{
            url.searchParams.delete("arrivalCity");
        }

        if(arrivalDate !=""){
            url.searchParams.set("arrivalDate", arrivalDate);
        }else{
            url.searchParams.delete("arrivalDate");
        }

        // //chuyển hướng theo url đó
        window.location.href = url.href;
    }); 
}
// end form Search 

//show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(()=>{
        showAlert.classList.add("alert-hidden");
    }, time);
    
    
    closeAlert.addEventListener("click", ()=>{
        showAlert.classList.add("alert-hidden");
    })

}
// end show alert

//upload image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagPreview = uploadImage.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", (e)=>{
        if(e.target.files.length){
            const image = URL.createObjectURL(e.target.files[0]);

            uploadImagPreview.src = image;
        }
    })
}
//end upload image