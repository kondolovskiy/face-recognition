const faceapi = require('face-api.js');

async function run() {
    await faceapi.loadSsdMobilenetv1Model('./weights');
    await faceapi.loadFaceLandmarkModel('./weights');
    await faceapi.loadFaceRecognitionModel('./weights');

    matchData()
}

async function matchData() {
    const labels = ['viktor'];

    const labeledFaceDescriptors = await Promise.all(
        labels.map(async label => {
            // fetch image data from urls and convert blob to HTMLImage element
            const imgUrl = `./images/${label}/1.png`;
            const img = await faceapi.fetchImage(imgUrl);

            // detect the face with the highest score in the image and compute it's landmarks and face descriptor
            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

            if (!fullFaceDescription) {
                throw new Error(`no faces detected for ${label}`)
            }

            const faceDescriptors = [fullFaceDescription.descriptor];
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
        })
    );


    const data = serialize(labeledFaceDescriptors);

    console.log(JSON.stringify(data));
}

function serialize(descriptors) {
    return descriptors.map(descriptor => {
        const descriptors = descriptor.descriptors.map(d => Array.from(d));
        return {
            label: descriptor.label,
            descriptors
        }
    })
}

function deserialize(data) {
    return data.map(object => {
        const descriptors = object.descriptors.map(d => new Float32Array(d));

        return new faceapi.LabeledFaceDescriptors(
            object.label,
            descriptors
        );
    })
}