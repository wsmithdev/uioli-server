const getDates = () => {
    const end_date =  new Date().toISOString().split('T')[0]
    let start_date = new Date()
    start_date.setDate(start_date.getDate() - 30)
    start_date = start_date.toISOString().split('T')[0]
    return {start_date, end_date}
}

module.exports = { getDates };