const jimp = require('jimp');

const convertRgbHex = (r, g, b) => {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const analyzeImageColors = async (imagePath) => {
    try {
        
        const image = await jimp.read(imagePath);
        const colorCount = {};

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
        });

        //console.log(colorCount);
        console.log(colorCount.keys());
    } catch (error) {
        console.error('Erro ao carregar ou processar a imagem:', error);
    }
};

// Caminho da imagem a ser analisada
const imagePath = './meteor_challenge_01.png';

// Chama a função para analisar a imagem
analyzeImageColors(imagePath);
