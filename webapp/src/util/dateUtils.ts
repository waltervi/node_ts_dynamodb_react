

const DatesHelper = {
    compare : (date0 : Date, date1 : Date)=>{
        const d0 = parseInt(date0.getUTCFullYear().toString() + date0.getUTCMonth().toString()+ date0.getUTCDay().toString())
        const d1 = parseInt(date1.getUTCFullYear().toString() + date1.getUTCMonth().toString()+ date1.getUTCDay().toString())

        let result = 0
        if(d0 > d1 ){
            result = 1
        }
        else if(d0 < d1 ){
            result = -1
        }
        return result
    }

}

const DateUtils = {
    Dates : DatesHelper


}


export default DateUtils