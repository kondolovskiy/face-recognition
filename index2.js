const path = require('path');
const fs = require('fs');
const fr = require('face-recognition');


const dataPath = path.resolve('./images');
// const classNames = ['viktor', 'andriy', 'artem', 'romanl', 'romang'];
const classNames = ['viktor'];

const imagesByClass = classNames.map(c => {
        const classPath = `${dataPath}/${c}`;
        const allFiles = fs.readdirSync(classPath);

        return allFiles
            .filter(f => f.includes('png'))
            .map(f => path.join(classPath, f))
            .map(fp => fr.loadImage(fp))
    }
);

const numTrainingFaces = 10;
const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces));
// const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces));

const recognizer = fr.FaceRecognizer();

trainDataByClass.forEach((faces, label) => {
    const name = classNames[label];
    recognizer.addFaces(faces, name)
});

const modelState = recognizer.serialize();
fs.writeFileSync('model.json', JSON.stringify(modelState));