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