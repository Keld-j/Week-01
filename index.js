let net;

// First we have a couple of constants, that will be referred later

const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');

async function app() {
  console.log('Loading mobilenet..');

  // Load the model and wait for it to be fully loaded
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  // Initialise the webcam - see the code below
  await setupWebcam();

  // Retrieves an image from the webcam and associates it with the classId retrieved from pressing the button (see below)
    const addExample = classId => {

      // Get the intermediate activation of MobileNet 'conv_preds' and pass that
      // to the KNN classifier.
      const activation = net.infer(webcamElement, 'conv_preds');

      // Pass the intermediate activation to the classifier.
      classifier.addExample(activation, classId);
    };

    // When clicking the button, add an example for that particular class (3 classwes for 3 buttons)
    document.getElementById('class-a').addEventListener('click', () => addExample(0));
    document.getElementById('class-b').addEventListener('click', () => addExample(1));
    document.getElementById('class-c').addEventListener('click', () => addExample(2));

    // Keep grabbing images from the webcam for as long as the page is running.
    while (true) {
      if (classifier.getNumClasses() > 0) {
        // Get the activation from mobilenet from the webcam.
        const activation = net.infer(webcamElement, 'conv_preds');
        // Get the most likely class and confidences from the classifier module.
        const result = await classifier.predictClass(activation);

        const classes = ['Class A', 'Class B', 'Class C'];
        document.getElementById('console').innerText = `
          prediction: ${classes[parseInt(result.label)]}\n
          probability: ${result.confidences[parseInt(result.label)]}
        `;
      }
      await tf.nextFrame();
    }
  }

  async function setupWebcam() {
    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;
      navigator.getUserMedia = navigator.getUserMedia ||
          navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
          navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true},
          stream => {
            webcamElement.srcObject = stream;
            webcamElement.addEventListener('loadeddata',  () => resolve(), false);
          },
          error => reject());
      } else {
        reject();
      }
    });
  }

app();
