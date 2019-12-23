const parse = require('json-to-ast');

let referenceSize = null;
const errorArray = [];

const link = (str)=>{
    
    const settings = {      
      loc: true,
      source: 'data.json'
    };
    
    const jsonPars = parse(str, settings);
    
    let item = 1;
    for (const key in  jsonPars.children){
        
    // console.log(item, 'Ключ', jsonPars.children[key]['key']['value'])
        if (jsonPars.children[key]['value']['value'] === undefined){
    // console.log(item, 'Значение:', jsonPars.children[key]['value']['children'])
            const blockWarning = jsonPars.children[key]['value']['children']
            // console.log(blockWarning[0])
            let item1 = 1;
            for(log in blockWarning){
                console.log(item1, blockWarning[log])
                console.log(item1++,typeof blockWarning[log])
                let item12 = 1   
                for(log1 in blockWarning[log]){
                    // console.log(item1, item12++, blockWarning[log][log1])    
                } 
            }
            // stepBlock(blockWarning) 
        }else{
    // console.log(item, 'Значение', jsonPars.children[key]['value']['value'])
        }        
        

        item++
    }
}

const stepBlock = (str) =>{
    let item = 1;
    console.log(typeof str['type'])
    console.log(typeof str['children'])
    console.log(typeof str['loc'])
    for (key in str['children']){
        console.log(item, 'Ключ', str[key])
        console.log(item, 'Тип', typeof str['children'][key])
        item++
    //     // console.log('blockWarning')
    }
}
    // console.log('Текущий children', jsonPars.children)
    // console.log('Текущий loc', jsonPars.loc)
    // console.log(typeof jsonPars)
    // for (const element in jsonPars) {

    //     console.log(typeof jsonPars[element]);

    //     // console.log('Ключ', jsonPars[element])
    //     // console.log('Значение', jsonPars[element])
    //   }
    // const jsonPars = JSON.parse(str)

    // for (const element of jsonPars) {
    //     console.log(element);
    //   }

    // console.log(typeof jsonPars['block'])
    // for (let key in jsonPars){
         
    //     if(key === 'block' && jsonPars[key] === 'warning'){
    //         if(key === "content"){
            
    //             masArrya(jsonPars[key])   
    //         }
    //     }
        
    
    // } 
    // console.log(errorArray)
// } 




const masArrya = (content, levl = 0)=>{

    for (let i=0; i<content.length; i++){
        
        if(content[i].block != undefined && content[i].block === 'text'){

            if(content[i].mods != undefined && content[i].mods.size != undefined){
                if(referenceSize === null){    
                    referenceSize = content[i].mods.size;    
                }else if(content[i].mods.size != undefined && content[i].mods.size !== referenceSize){    
                    seterrorArray("WARNING.TEXT_SIZES_SHOULD_BE_EQUAL", "Тексты в блоке warning должны быть одного размера")
                        
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
 
const json1 = `{
    "block": {"warning": "Test"}
    
}`;

link(json)
