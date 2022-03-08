const canvas = new fabric.Canvas('canvas');

// Canvas with aspect ratio of 16:9
const width = window.innerWidth * 0.9;
const height = width * 9 / 16;
canvas.setWidth(width);
canvas.setHeight(height);

// HTML elements
const elInputImage = document.getElementById('input-svg');
const elInputColor = document.getElementById('input-color');
const elInputBackground = document.getElementById('input-background');

const showColorPicker = (visible = true) => {
    elInputColor.type = visible
        ? 'color'
        : 'hidden';
};

const changeColor = (event) => {
    const color = event.target.value;
    const activeObject = canvas.getActiveObject();
    activeObject.set({
        fill: color,
    });
}

elInputImage.onchange = (event) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
        const svg = event.target.result;
        fabric.loadSVGFromString(svg, (objects, options) => {
            const obj = fabric.util.groupSVGElements(objects, options);

            // Scale object to fit canvas and then center it
            const scale = Math.min(
                canvas.width / obj.width,
                canvas.height / obj.height
            );

            obj.scale(scale * 0.8);

            // Change object pivot to center
            obj.set({
                left: canvas.width / 2,
                top: canvas.height / 2,
                angle: 0,
                originX: 'center',
                originY: 'center',
            });

            // Set object center to canvas center
            obj.set({
                left: canvas.width / 2,
                top: canvas.height / 2,
                angle: 0,
                centeredScaling: true,
                centeredRotation: true,
            });

            const background = canvas.backgroundImage;

            canvas.clear()
                .add(obj)
                .setActiveObject(obj);

            if (background) {
                canvas.setBackgroundImage(background);
            }

            showColorPicker();
        });
    };

    fileReader.readAsText(event.target.files[0]);
};

elInputBackground.onchange = (event) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;

        image.onload = () => {
            const img = new fabric.Image(image);
            img.set({
                left: canvas.width / 2,
                top: canvas.height / 2,
                angle: 0,
                originX: 'center',
                originY: 'center',
            });

            // Fit image to canvas
            const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
            );

            img.scale(scale);
            canvas.setBackgroundImage(img);
        };
    };

    fileReader.readAsDataURL(event.target.files[0]);
};

elInputColor.oninput = changeColor;

function render() {
    canvas.renderAll();
    requestAnimationFrame(render);
}

render();