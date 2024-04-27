//NAV Header
// Lấy đường dẫn path hiện tại của trang (không bao gồm domain)
const currentPath = window.location.pathname;

// Lấy tất cả các đường link
const links = document.querySelectorAll('.nav_header_link_active');
// Lặp qua từng đường link
links.forEach(link => {
    // Lấy đường dẫn path từ href của đường link
    const linkPath = link.getAttribute('href');
    // Kiểm tra xem đường dẫn path hiện tại có bắt đầu bằng đường dẫn path của đường link hay không
    if (currentPath.startsWith(linkPath)) {
        // Nếu có, thêm class active-link
        link.classList.add('active-link');
    }
    if( (currentPath.startsWith("/checkout"))  && linkPath==="/cart"){
        link.classList.add('active-link');
    }
});

//End NAV Header

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

// //VND Price - adjust price format
document.querySelectorAll('.vnd-price').forEach(function(element) {
    var vndPrice = element.innerText;
    
    // Thực hiện các thay đổi định dạng ở đây cho mỗi phần tử

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const newPrice = VND.format(vndPrice);
    element.innerText = newPrice;
});

//end VND Price - adjust price format


//format date
//###########################################
// Lấy tất cả các phần tử có class '.date-format'
const dateElements = document.querySelectorAll('.date-format');
// Lặp qua từng phần tử và thay đổi nội dung
dateElements.forEach(dateElement => {
    // Lấy ngày tháng từ phần tử
    const dateString = dateElement.textContent.trim();
    // Tách thành phần ngày, tháng và năm
    const [year, month, day] = dateString.split('-');
    // Chuyển đổi tháng và ngày thành chuỗi và thêm số 0 nếu cần
    const formattedMonth = month.length === 1 ? '0' + month : month;
    const formattedDay = day.length === 1 ? '0' + day : day;
    // Tạo chuỗi mới với định dạng mong muốn
    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
    // Gán chuỗi mới vào phần tử
    dateElement.textContent = formattedDate;
});
//###########################################
//end format date