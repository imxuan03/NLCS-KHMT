module.exports = (query) => {
    let objectSearch = {
        departureCity: "",
        regexDepartureCity: "",
        arrivalCity: "",
        regexArrivalCity: "",
        departureDate: "",
        arrivalDate: "",
    }

    if(query.departureCity){
        objectSearch.departureCity = query.departureCity;
        const regex = new RegExp(objectSearch.departureCity, "i");
        objectSearch.regexDepartureCity = regex;
    }

    if(query.arrivalCity){
        objectSearch.arrivalCity = query.arrivalCity;
        const regex = new RegExp(objectSearch.arrivalCity, "i");
        objectSearch.regexArrivalCity = regex;
    }

    if(query.departureDate){
        objectSearch.departureDate = query.departureDate;
    }

    if(query.arrivalDate){
        objectSearch.arrivalDate = query.arrivalDate;
    }

    return objectSearch;
}


