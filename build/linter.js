const parse = require('json-to-ast');

let referenceSize = null;
const errorArray = [];

const link = (str) => {

    const settings = {
        loc: true,
        source: 'data.json'
    };

    const jsonPars = parse(str, settings)

    stepBlock(jsonPars)

}

const stepBlock = (jsonPars, num = 0) => {
    // console.log(jsonPars['type'])

    if (jsonPars['type'] === 'Object') {
        const parsPbject = jsonPars['children']

        for (let i = 0; i < parsPbject.length; i++) {
            if (parsPbject[i]['key']['value'] === 'block') {
                // Ищем блок Warning
                if (parsPbject[i]['value']['value'] === 'warning') {
                    regulationsWarning(parsPbject)
                    // console.log('Это варнинг',parsPbject)    
                }
                // console.log('Блок', parsPbject[i]['value']['value'])        
            } else if (parsPbject[i]['value']['type'] === 'Array') {
                stepBlock(parsPbject[i]['value'])
            }
        }
    } else if (jsonPars['type'] === 'Array') {
        const parsPbject = jsonPars['children']
        for (let i = 0; i < parsPbject.length; i++) {
            stepBlock(parsPbject[i])
            // console.log(parsPbject[i]['type'])    
        }
    }
}



const regulationsWarning = (block) => {
    console.log(block['type'])
    if (block['type'] === undefined) {//При входе тип не будет определен пока не точно
        for (let i = 0; i < block.length; i++) {
            if (block[i]['key']['value'] === 'content') {
                regulationsWarning(block[i]['value'])//Начинаем разбор 
            }

        }
    }else if(block['type']==='Array'){
        const parsPbject = block['children']
        for (let i = 0; i < parsPbject.length; i++) {
            regulationsWarning(parsPbject[i])    
        }
    }else if (block['type'] === 'Object') {
        const parsPbject = block['children']

        for (let i = 0; i < parsPbject.length; i++) {
            if (parsPbject[i]['key']['value'] === 'block') {
                
                if(parsPbject[i]['value']['value']==='text1'){
                    console.log(parsPbject[i]['value'])    
                }
                // console.log('Тут block', parsPbject[i]['value']['value'])

                // console.log(parsPbject[i]['key'])
                // Ищем блок Warning
                // if (parsPbject[i]['value']['value'] === 'warning') {
                //     regulationsWarning(parsPbject)
                //     // console.log('Это варнинг',parsPbject)    
                // }
                // console.log('Блок', parsPbject[i]['value']['value'])        
            } else if (parsPbject[i]['value']['type'] === 'Array') {
                regulationsWarning(parsPbject[i]['value'])
               
                // console.log('Тут массив')
                // console.log(parsPbject[i]['value'])
                // console.log(parsPbject[i]['value'])
                // stepBlock(parsPbject[i]['value'])
            }
        }
    }



    // console.log(block)
    // for (key in block){
    //     console.log(key)   
    // }

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

const masArrya = (content, levl = 0) => {

    for (let i = 0; i < content.length; i++) {

        if (content[i].block != undefined && content[i].block === 'text') {

            if (content[i].mods != undefined && content[i].mods.size != undefined) {
                if (referenceSize === null) {
                    referenceSize = content[i].mods.size;
                } else if (content[i].mods.size != undefined && content[i].mods.size !== referenceSize) {
                    seterrorArray("WARNING.TEXT_SIZES_SHOULD_BE_EQUAL", "Тексты в блоке warning должны быть одного размера")

                }
            }
        }

        let testArrya = content[i];

        for (let key in testArrya) {

            if (key === "content") {
                masArrya(testArrya[key], ++levl)
            }
        }

    }

}

const seterrorArray = (code = "", error = "") => {
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
