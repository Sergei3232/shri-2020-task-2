var link = (str)=>{
    
    const jsonPars = JSON.parse(str)
    
    for (let key in jsonPars){
        console.log("in", key)
        console.log(typeof jsonPars[key])
        console.log(jsonPars[key])    
    }
    
} 


const json = `{
    "block": "warning",
    "content": [
        {
            "block": "placeholder",
            "mods": { "size": "m" }
        },
        {
            "elem": "content",
            "content": [
                {
                    "block": "text",
                    "mods": { "size": "m" }
                },
                {
                    "block": "text",
                    "mods": { "size": "l" }
                }
            ]
        }
    ]
}`;

link(json)