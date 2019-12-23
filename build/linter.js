let referenceSize = null;
const errorArray = [];

var link = (str)=>{
    
    const jsonPars = JSON.parse(str)
    for (let key in jsonPars){
        
        if(key === "content"){
            
            masArrya(jsonPars[key])   
        }
    
    } 
    // for (let key in jsonPars){
    //     console.log( jsonPars[key])
    //     console.log( "key",typeof key)
    //     console.log( "jsonPars[key]",typeof jsonPars[key])

    //     if (key === 'block' && jsonPars[key] === 'warning'){
    //         parseWarningBlock(jsonPars[key])    
    //     }
    
    // }
    console.log(errorArray);
} 

// const parseWarningBlock = (jsonPars) =>{

//     for (let key in jsonPars){
        
//         if(key === "content"){
            
//             masArrya(jsonPars[key])   
//         }
    
//     } 

// }

const masArrya = (content, levl = 0)=>{

    for (let i=0; i<content.length; i++){
        
        if(content[i].block != undefined && content[i].block === 'text'){

            if(content[i].mods != undefined && content[i].mods.size != undefined){
                if(referenceSize === null){    
                    referenceSize = content[i].mods.size;    
                }else if(content[i].mods.size != undefined && content[i].mods.size !== referenceSize){    
                    seterrorArray("WARNING.TEXT_SIZES_SHOULD_BE_EQUAL", "Тексты в блоке warning должны быть одного размера")
                    // errorArray.push(
                    //     {code: "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
                    //     error: "Тексты в блоке warning должны быть одного размера",
                    //     });    
                }    
            }
        }

        let testArrya = content[i];

        for (let key in testArrya){
                
            if(key === "content"){
                masArrya(testArrya[key], ++levl)    
            }   
        }
               
    }  
     
}

const seterrorArray = (code = "", error= "")=>{
    errorArray.push({
        code: code,
        error: error,
        location: {
            start: { column: 0, line: 0 },
            end: { column: 0, line: 0 }
        }     
    })        
}

const json = `{
    "block": "warning",
    "content": [
        {
            "block": "placeholder",
            "mods": { "size": "m" },
            "content": [
                {
                    "block": "text",
                    "mods": { "size": "m" }
                },
                {
                    "block": "text",
                    "mods": { "size": "m" }
                }
            ]
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