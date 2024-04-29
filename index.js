const test = () => {
    try {
    // do something 
    throw new Error(`error`)
    return {success: 'OK'}
    }catch(error){
        // return error;
    } finally {
        console.log(`in finally block`)
    }
    
}
console.log(test());//adejrtdd
