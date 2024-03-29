# IMPLEMENTATION

---
**:warning: NOTE**

You'll need the `samples` folder in the project directory to run this code. Download the folder from [this](https://drive.google.com/drive/folders/1TK3yzgJvrcNq2otPVoul0si__fo6_G7U?usp=sharing) link

---

* Datasets : Emnist for english, [Devanagari Character Set](https://www.kaggle.com/rishianand/devanagari-character-set)

## Phase 1 (Python)

- <span style="color:green">[:heavy_check_mark:] Starting simple by training a deep neural network for recognising handwritten english alphabets.</span>
- <span style="color:#FF9C33">[:zzz:] Testing the neural network and optimising it to work with different sized inputs.</span>
    - ><span style="font-size:0.8em"> :eyes: 'optimising for different sized inputs' could be a step after we've established how our UI is gonna handle drawing. So I'm skipping this 'optimise' step for now.<span>

## Phase 2 (Javascript)

- <span title="inside phase-01-step-02.ipynb file" style="color:green">[:heavy_check_mark:] Exporting the neural network trained in Phase 1 to tensorflowjs compatible format.</span>
- <span style="color:green">[:heavy_check_mark:] Scripting the prediction part again using the exported model.</span>
- <span style="color:green">[:heavy_check_mark:] Testing and optimising it similar to what we did in Phase 1 (this time in JS)</span>
    - ><span style="font-size:0.8em"> :eyes: Initial testing shows that if a small character is drawn, it becomes smudged on it's way to the neural network, affecting prediction. Will have to figure out a way to reduce smudging and span the character equally. It should be <span title="Ryan George Reference">`super easy, barely an inconvenience`<span> but I feel too lazy right now.<span>
    - ><span style="font-size:0.8em"> :scream: It was not <strong>`super easy`</strong> but <strong>`very inconvenient`</strong>. Please somebody help me, I'm crying.<span>
    - ><span style="font-size:0.8em"> :grimacing: It was apparantly because I trained the same neural network on both capital and lower case alphabets keeping them in the same class. This made it difficult for the network to identify patterns. </span>
    - ><span style="font-size:0.8em"> :neutral_face: Now since I was not able to separate the capital and lower case alphabets from the English character set, I decided to jump to Hindi. This worked better than English with more accurate predictions from the frontend. I think we'll have to come up with a more elegant drawing solution for the frontend. Cause it's pretty shit.</span>


## Phase 3 (Python/Javascript)

- <span style="color:#FF9C33">[:heavy_check_mark:] Following the steps in Phase 1 and 2 for more languages like Hindi and Hebrew.</span>
    - ><span style="font-size:0.8em"> :pushpin: Change of plans here, First find another drawing solution for the frontend.</span>

## Phase 4 (HTML/Javascript)

- Creating a simple UI that takes in image of a handwritten alphabet and predicts the alphabet.
- Script to smoothen the input image if necessary. (will take some good time)

## Phase 5 (HTML/Javascript)

- Improving the UI
- Creating a drawable area and scripts to convert the input to image.
- Recording a sample video (similar to the one on experiments.google)
- Using scripts from Phase 2 to implement prediction for captured image from drawing area.
- Integrating the sample video with the prediction script.

## Phase 6 (HTML/Python/Javascript)

- Any ui/non-ui fixes if required.
- Following all above steps for more languages.
- Recording more videos.
- Finishing touches.
- Any suggested changes --
