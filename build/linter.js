
let globalObject = null

if (typeof global === 'undefined') {
    globalObject = window
} else if (typeof globalThis === 'undefined') {
    globalObject = global
}

globalObject.link = (str) => {

    const parse = require('json-to-ast')

    const typeError = { //Объект куда записываем ключевые моменты при сравннеии...Эталонный размер блока текст и т.д.
        buttonPosition: 0,
        textSize: false,
        placeholder: false
    }
    const sizeTextBox = []   //Записываем эталонны размер для блока варнинг при каждой отправке блока на проверку будет создаватсья размер
    const errorArray = []   //Массив возврата ошибок
    let locWarning = null //Позиция текущего блока Варнинг 

    const settings = {
        loc: true,
        source: 'data.json'
    };
    const jsonPars = parse(str, settings)

    const stepBlock = (jsonPars) => {
        if (jsonPars['type'] === 'Object') {
            const parsPbject = jsonPars['children']

            for (let i = 0; i < parsPbject.length; i++) {
                if (parsPbject[i]['key']['value'] === 'block') {
                    // Ищем блок Warning
                    if (parsPbject[i]['value']['value'] === 'warning') {
                        sizeTextBox.push(0)
                        locWarning = parsPbject[i]['loc']
                        regulationsWarning(parsPbject)
                    }

                } else if (parsPbject[i]['value']['type'] === 'Array') {
                    stepBlock(parsPbject[i]['value'])
                }
            }
        } else if (jsonPars['type'] === 'Array') {
            const parsPbject = jsonPars['children']
            for (let i = 0; i < parsPbject.length; i++) {
                stepBlock(parsPbject[i])
            }
        }
    }

    const regulationsWarning = (block) => {
        if (block['type'] === undefined) {//При входе тип не будет определен пока не точно
            for (let i = 0; i < block.length; i++) {
                if (block[i]['key']['value'] === 'content') {
                    regulationsWarning(block[i]['value'])//Начинаем разбор 
                }

            }
        } else if (block['type'] === 'Array') {
            const parsPbject = block['children']
            for (let i = 0; i < parsPbject.length; i++) {
                regulationsWarning(parsPbject[i])
            }
        } else if (block['type'] === 'Object') {
            const parsPbject = block['children']
            // console.log(1, parsPbject[1])
            for (let i = 0; i < parsPbject.length; i++) {
                // console.log(i,parsPbject[i]['key']['value'], parsPbject[i]['value']['value'])
                if (parsPbject[i]['key']['value'] === 'block') {

                    if (parsPbject[i]['value']['value'] === 'text') {

                        let indexBox = i + 1;
                        while (parsPbject[indexBox] !== undefined && parsPbject[indexBox]['key']['value'] === 'mods') {
                            sizeCheck(parsPbject[indexBox])
                            indexBox++
                        }

                    } else if (parsPbject[i]['value']['value'] === 'button') {
                        // Тут тут записываем позицию button                  
                        typeError.buttonPosition = parsPbject[i]['loc']['start']['line']
                    } else if (parsPbject[i]['value']['value'] === 'placeholder') {
                        if (typeError.buttonPosition !== 0 && typeError.buttonPosition < parsPbject[i]['loc']['start']['line']) {
                            
                            if (!typeError.placeholder) {
                                typeError.placeholder = true
                                seterrorArray("WARNING.INVALID_BUTTON_POSITION", "Блок placeholder после button")
                            }
                        }
                        console.log('placeholder')
                    }

                } else if (parsPbject[i]['value']['type'] === 'Array') {
                    regulationsWarning(parsPbject[i]['value'])
                }
            }
        }
    }

    const sizeCheck = (boxSize) => {

        if (!typeError.textSize) {
            if (boxSize['value']['type'] === 'Object') {
                const parsPbject = boxSize['value']['children']

                for (let i = 0; i < parsPbject.length; i++) {
                    if (parsPbject[i]['key']['value'] === 'size') {

                        if (sizeTextBox[sizeTextBox.length - 1] === 0) {
                            sizeTextBox[sizeTextBox.length - 1] = parsPbject[i]['value']['value']
                        } else if (sizeTextBox[sizeTextBox.length - 1] !== parsPbject[i]['value']['value']) {
                            seterrorArray("WARNING.TEXT_SIZES_SHOULD_BE_EQUAL", "Тексты в блоке warning должны быть одного размера")
                            typeError.textSize = true
                        }

                    }

                }
            }
        }


    }

    const seterrorArray = (code = "", error = "") => {
        const location = {
            start: null,
            end: null
        }

        if (locWarning !== null) {
            location.start = { start: { column: locWarning['start']['column'], line: locWarning['start']['line'] } }
            location.end = { column: locWarning['end']['column'], line: locWarning['end']['line'] }
        }
        errorArray.push({
            code: code,
            error: error,
            location: location
        })
    }

    stepBlock(jsonPars)
    return errorArray
}

const json = `{
    "block": "grid",
    "mods": {
        "m-columns": "10"
    },
    
    "content": [
        {
            "block": "grid",
            "elem": "fraction",
            "elemMods": {
                "m-col": "2"
            },
            "content": [
                {
                    "block": "payment"
                }
            ]
        },
        {
            "block": "grid",
            "elem": "fraction",
            "elemMods": {
                "m-col": "8"
            },
            "content": [
                {
                    "block": "offer"
                }
            ]
        }
    ]
 }`;

console.log(globalObject.link(json))