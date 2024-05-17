const jimp = require('jimp');

//ESSA FUNÇÃO SERVE PARA RETORNAR UMA STRING COM O VALOR CSS HEXADECIMAL, USANDO O OPERADOR 
//LEFT SHIFT PARA CRIAR A STRING A PARTIR DE 1, SETANDO A QUATIDADE DE CASAS, 
//E NO FINAL, QUEBRANDO A STRING NO 1 QUE FOI USADO, MAS HÁ UMA FUNÇÃO NO JIMP PARA PEGAR A COR, QUE TAMBEM PODE SER USADA
const convertRgbHex = (r, g, b) => {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const analyzeImageColors = async (imagePath) => {
    try {
        
        const image = await jimp.read(imagePath);
        const colorCount = {};
        const fallCount = {};

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {

            const r = image.bitmap.data[idx];
            const g = image.bitmap.data[idx + 1];
            const b = image.bitmap.data[idx + 2];

            const hexColor = convertRgbHex(r, g, b);
            
            if (colorCount[hexColor]) {
                colorCount[hexColor]++;
            } else {
                colorCount[hexColor] = 1;
            }

            //QUANDO UM PIXEL VERMELHO FOR ENCONTRADO
            if (hexColor == 'FF0000') {

                //ENTRANDO NOVAMENTE NO SCAN, MAS DESSA VEZ, APENAS PARA A COLUNA DO PIXEL
                image.scan(x, y, x, image.bitmap.height, (x, y, idx) => {

                  let columnIterationPixel = image.getPixelColor(x, y);
                  // NAO USAREI ESSA OPCAO POIS FICA MAL FORMATADO NA COR DO PIXEL, POR CONTA DO ALPHA
                  // columnIterationPixel = columnIterationPixel.toString(16);
                  // console.log(columnIterationPixel);
                  columnIterationPixel = jimp.intToRGBA(columnIterationPixel);
                  let pixelColor = convertRgbHex(columnIterationPixel['r'], columnIterationPixel['g'], columnIterationPixel['b'],);

                  
                  if (pixelColor == '0000FF') {
                    // if (fallCount['WATER']) {
                    //   console.log('entrou');
                    //   fallCount['WATER']++;
                    //   return null;                     
                    // } else {
                    //   fallCount['WATER'] = 1;
                    //   return null;
                    // }
                    console.log(pixelColor);
                  }

                  pixelColor = 0;

                });

                fallCount['GROUND'] = colorCount['FF0000'] - fallCount['WATER'];
            } 
        });

        console.log("stars:  " + colorCount['FFFFFF'] + " pixels");
        console.log("meteors:  " + colorCount['FF0000'] + " pixels");
        console.log("water:  " + colorCount['0000FF'] + " pixels");
        console.log("ground:  " + colorCount['000000'] + " pixels");
        console.log(fallCount);

    } catch (error) {
        console.error('Erro ao carregar ou processar a imagem:', error);
    }
};

// CAMINHO RELATIVO DA IMAGTEM
const imagePath = './meteor_challenge_01.png';

analyzeImageColors(imagePath);

//#FFFFFF
//#0000FF
//#FF0000
//#FF0000FF