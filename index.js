const jimp = require('jimp');

//ESSA FUNÇÃO SERVE PARA RETORNAR UMA STRING COM O VALOR CSS HEXADECIMAL, USANDO O OPERADOR 
//LEFT SHIFT PARA CRIAR A STRING A PARTIR DE 1, SETANDO A QUATIDADE DE CASAS, 
//E NO FINAL, QUEBRANDO A STRING NO 1 QUE FOI USADO, MAS HÁ UMA FUNÇÃO NO JIMP PARA PEGAR A COR, QUE TAMBEM PODE SER USADA
const convertRgbHex = (r, g, b) => {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const isOnArray = (arr, item) => {

}

const analyzeImageColors = async (imagePath) => {
  try {
      
    const image = await jimp.read(imagePath);
    const colorCount = {};

    let redColumns = [];
    let filteredRedColumns = [];
    let blueColumns = [];
    let blueRow = 0;
    
    console.log(image.bitmap.width);
    

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {

      const r = image.bitmap.data[idx];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];

      let hexColor = convertRgbHex(r, g, b);
      
      if (colorCount[hexColor]) {
        colorCount[hexColor]++;
      } else {
        colorCount[hexColor] = 1;
      }

      //QUANDO UM PIXEL VERMELHO FOR ENCONTRADO
      if (hexColor == 'FF0000') { 
        redColumns.push(x);              
      }

      if (hexColor == '0000FF') {
        if(blueColumns[0] == null){
          blueRow = y;
        }
        
        if (blueRow == y) {
          blueColumns.push(x);
        }
      }

    });

    console.log("stars:  " + colorCount['FFFFFF'] + " pixels");
    console.log("meteors:  " + colorCount['FF0000'] + " pixels");
    console.log("water:  " + colorCount['0000FF'] + " pixels");
    console.log("ground:  " + colorCount['000000'] + " pixels");
    console.log(redColumns);
    console.log(blueColumns);

    filteredRedColumns = redColumns.filter((column) => !blueColumns.includes(column));
    console.log(filteredRedColumns);
    console.log("QUANTIDADE DE METOROES QUE VAO CAIR NA TERRA:  " + filteredRedColumns.length + " meteoros");
    console.log("QUANTIDADE DE METOROES QUE VAO CAIR NA AGUA:  " + (redColumns.length - filteredRedColumns.length) + " meteoros");

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