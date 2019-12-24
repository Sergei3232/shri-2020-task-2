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
                if(jsonPars['children'][i]['key']['value'] === 'block'){
                    if(jsonPars['children'][i]['value']['value'] === 'warning'){
                        regulationsWarning(jsonPars['children'])
                    }                            
                }
                // console.log(jsonPars['children'][i]['key']['value'])
                // console.log(jsonPars['children'][i]['value']['type'])
                // console.log(jsonPars['children'][i]['key']['value'] === 'block')
                // console.log(typeof jsonPars['children'][i]['value'])
                      
            }
        }else if(key === 'type' && jsonPars[key] === 'Property'){

        }
        
    }
    
}

    
const regulationsWarning = (block, levl = 0)=>{
    
    let nom = 1;
    for (key in block){
        console.log(levl, block[key]['key']['value'], block[key]['value']['value'])
        // console.log(levl, block[key]['value']['value'])
        // console.log(block[key]['type'])
        
        if(block[key]['type'] === 'Property'){
            if(block[key]['value']['type'] === 'Array'){
                for(let i = 0; i < block[key]['value']['children'].length; i++){
                    if (block[key]['value']['children'][i]['type'] === 'Object'){
                        regulationsWarning(block[key]['value']['children'][i]['children'], ++levl)    
                    }
                            // regulationsWarning(block[key]['value']['children'][i])
                            // console.log(i, block[key]['value']['children'][i]['type'] === 'Object')    
                        }    
            }
            // if(block[key]['value']['type'] === 'Array'){
            //     console.log('Key!',block[key])

            //     console.log('children!',block[key]['value']['children'])    
            // }
            // regulationsWarning(block[key]['value'])

            // console.log(nom++,block[key]['value']['type'])        
        }

        // if(block[key]['value']['type'] === 'Array'){
        //     for(let i = 0; i < block[key]['value']['children'].length; i++){
        //         // regulationsWarning(block[key]['value']['children'][i])
        //         console.log(block[key]['value']['children'][i])    
        //     }
        //     // regulationsWarning(block[key]['value']['children'])
        //     // console.log(block[key]['value']['children'])
        //     // console.log(block[key]['value']['children'])    
        // }else if(block[key]['value']['type'] === 'Object'){
        //     console.log('Объект')
        // }

        // console.log(block[key]['value']['children'])
        // console.log(jsonPars['children'][i]['value']['type'])
    }
}


const json = `{
    "block": "warning",
    "content": [
        {
            "block": "placeholder",
            "mods": { "size": "m" },
            "content": [
                {
                    "block": "text1",
                    "mods": { "size": "m" }
                },
                {
                    "block": "text2",
                    "mods": { "size": "m" }
                }
            ]
        },
        {
            "elem": "content",
            "content": [
                {
                    "block": "text3",
                    "mods": { "size": "m" }
                },
                {
                    "block": "text4",
                    "mods": { "size": "l" }
                }
            ]
        }
    ]
}`;

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



const json1 = `{
    "block": {"warning": "Test"}
    
}`;

link(json)
