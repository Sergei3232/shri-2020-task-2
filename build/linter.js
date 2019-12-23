const parse = require('json-to-ast');

let referenceSize = null;
const errorArray = [];

const link = (str)=>{
    
    const settings = {      
      loc: true,
      source: 'data.json'
    };
    
    const jsonPars = parse(str, settings)
    
    let item = 1
   
    stepBlock(jsonPars)
   
}

const stepBlock = (jsonPars, num = 0) =>{
   
    let item = 1;
    for (key in jsonPars){

        if(key === 'type' && jsonPars[key] === 'Object'){//type = 'Object' - это {..} - children это значения внутри фигурных скобок 
            for (let i = 0; i < jsonPars['children'].length; i++){
                stepBlock(jsonPars['children'][i])        
            }
        }else if(key === 'type' && jsonPars[key] === 'Property'){
            console.log(jsonPars['key']['value'])
            console.log(typeof jsonPars['value'])
            console.log(jsonPars)
            // console.log(jsonPars[key]['key'])
            // console.log('Это объекты внутри обвертки')
        }
        // console.log(item++, key, jsonPars[key])
    }
    // // console.log(typeof str['type'])
    // console.log(typeof str['children'])
    // console.log(typeof str['loc'])
    // for (key in str['children']){
    //     console.log(item, 'Ключ', str[key])
    //     console.log(item, 'Тип', typeof str['children'][key])
    //     item++
    // //     // console.log('blockWarning')
    // }
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
