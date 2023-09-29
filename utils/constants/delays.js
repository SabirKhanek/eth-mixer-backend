const delays = [
        {id: '-1', value:'Mix Now'},
        {id: '1', value: '1 hour'},
        {id: '2', value: '2 hours'},
        {id: '3', value: '4 hours'},
        {id: '4', value: '8 hours'},
        {id: '5', value: '16 hours'},
        {id: '6', value: '48 hours'},
        {id: '7', value: '72 hours'},
]

module.exports.delays = delays

module.exports.getDelayValueById = (id) => {
    return delays.find(delay=>delay.id===id).value
}