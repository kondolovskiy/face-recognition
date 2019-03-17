const path = require('path');
const fs = require('fs');
const fr = require('face-recognition');
const modelState = require('./model.json');

const dataPath = path.resolve('./images');
// const classNames = ['viktor', 'andriy', 'artem', 'romanl', 'romang'];
const classNames = ['viktor'];

const imagesByClass = classNames.map(c => {
        const classPath = `${dataPath}/test`;
        const allFiles = fs.readdirSync(classPath);

        return allFiles
            .filter(f => f.includes('png'))
            .map(f => path.join(classPath, f))
            .map(fp => fr.loadImage(fp))
    }
);

const numTrainingFaces = 10;
// const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces));
const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces));

const recognizer = fr.FaceRecognizer();

recognizer.load(modelState);

const errors = classNames.map(_ => []);
testDataByClass.forEach((faces, label) => {
    const name = classNames[label];
    console.log();
    console.log('testing %s', name);
    faces.forEach((face, i) => {
        const prediction = recognizer.predictBest(face);
        console.log('%s (%s)', prediction.className, prediction.distance);

        // count number of wrong classifications
        if (prediction.className !== name) {
            errors[label] = errors[label] + 1
        }
    })
});

// print the result
const result = classNames.map((className, label) => {
    const numTestFaces = testDataByClass[label].length;
    const numCorrect = numTestFaces - errors[label].length;
    const accuracy = parseInt((numCorrect / numTestFaces) * 10000) / 100;
    return `${className} ( ${accuracy}% ) : ${numCorrect} of ${numTestFaces} faces have been recognized correctly`
});
console.log('result:');
console.log(result);