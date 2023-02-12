"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var FeuerwerkNamespace;
(function (FeuerwerkNamespace) {
    window.addEventListener("load", handleLoad);
    let previewCanvas = document.getElementById("feuerwerk-preview-canvas");
    let canvasRenderingContext = previewCanvas.getContext("2d");
    let radiusSlider = document.getElementById("firecracker-setup-radius");
    let particalSlider = document.getElementById("firecracker-setup-particel");
    let primaryColorPicker = document.getElementById("firecracker-setup-color-primary");
    let secondaryColorPicker = document.getElementById("firecracker-setup-color-secondary");
    let fireworkSelectionDiv1 = document.getElementById("feuerwerk-1");
    let fireworkSelectionDiv2 = document.getElementById("feuerwerk-2");
    let fireworkSelectionDiv3 = document.getElementById("feuerwerk-3");
    let saveButton = document.getElementById("save-feuerwerk-button");
    let resetButton = document.getElementById("reset-feuerwerk-button");
    let centerHorizontal;
    let centerVertical;
    let selectedFeuerwerkButton = fireworkSelectionDiv1;
    let serverUrl = "https://webuser.hs-furtwangen.de/~buckjosu/Database/";
    let feuerwerke = [
        {
            feuerwerkId: "feuerwerk-1",
            particles: "0",
            radius: "0",
            primaryColor: "#ffffff",
            secondaryColor: "#000000"
        },
        {
            feuerwerkId: "feuerwerk-2",
            particles: "0",
            radius: "0",
            primaryColor: "#ff0000",
            secondaryColor: "#000000"
        },
        {
            feuerwerkId: "feuerwerk-3",
            particles: "0",
            radius: "0",
            primaryColor: "#000000",
            secondaryColor: "#000000"
        }
    ];
    let selectedFeuerwerk = feuerwerke[0];
    function handleLoad() {
        selectedFeuerwerkButton.classList.add("selected");
        previewCanvas.width = previewCanvas.clientWidth;
        previewCanvas.height = previewCanvas.clientHeight;
        centerHorizontal = previewCanvas.width / 2;
        centerVertical = previewCanvas.height / 2;
        radiusSlider.addEventListener("change", handleChangeParameter);
        particalSlider.addEventListener("change", handleChangeParameter);
        primaryColorPicker.addEventListener("change", handleChangeParameter);
        secondaryColorPicker.addEventListener("change", handleChangeParameter);
        fireworkSelectionDiv1.addEventListener("click", handleClickFeuerwerk);
        fireworkSelectionDiv2.addEventListener("click", handleClickFeuerwerk);
        fireworkSelectionDiv3.addEventListener("click", handleClickFeuerwerk);
        saveButton.addEventListener("click", () => handleSaveFeuerwerk(selectedFeuerwerk.feuerwerkId, selectedFeuerwerk.primaryColor, selectedFeuerwerk.secondaryColor, selectedFeuerwerk.particles, selectedFeuerwerk.radius));
        resetButton.addEventListener("click", setSavedFeuerwerke);
        setSavedFeuerwerke();
    }
    function setSavedFeuerwerke() {
        return __awaiter(this, void 0, void 0, function* () {
            let databaseFeuerwerke = yield fetchSavedFeuerwerke();
            if (databaseFeuerwerke.length < 1) {
                return;
            }
            else if (databaseFeuerwerke.length == feuerwerke.length) {
                feuerwerke = databaseFeuerwerke;
            }
            else {
                for (let i = 0; i < databaseFeuerwerke.length; i++) {
                    let index = feuerwerke.findIndex((feuerwerk) => feuerwerk.feuerwerkId == databaseFeuerwerke[i].feuerwerkId);
                    if (index != -1) {
                        feuerwerke[index] = databaseFeuerwerke[i];
                    }
                }
            }
            let index = feuerwerke.findIndex((feuerwerk) => feuerwerk.feuerwerkId == selectedFeuerwerk.feuerwerkId);
            selectedFeuerwerk = feuerwerke[index];
            setParameters();
            renderPreview();
        });
    }
    function getCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(serverUrl + "?command=find&collection=Feuerwerk");
            let json = yield response.json();
            return json;
        });
    }
    function createCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(serverUrl + "?command=create&collection=Feuerwerk");
            feuerwerke.forEach((feuerwerk) => __awaiter(this, void 0, void 0, function* () {
                yield handleSaveFeuerwerk(feuerwerk.feuerwerkId, feuerwerk.primaryColor, feuerwerk.secondaryColor, feuerwerk.particles, feuerwerk.radius);
            }));
        });
    }
    function fetchSavedFeuerwerke() {
        return __awaiter(this, void 0, void 0, function* () {
            let databaseResponse = yield getCollection();
            if (databaseResponse.status == 'failure') {
                yield createCollection();
                databaseResponse = yield getCollection();
                setParameters();
                renderPreview();
            }
            let data = databaseResponse.data;
            let keys = Object.keys(data);
            let databaseFeuerwerke = keys.map((key) => {
                data[key].primaryColor = "#" + data[key].primaryColor;
                data[key].secondaryColor = "#" + data[key].secondaryColor;
                return data[key];
            });
            return databaseFeuerwerke;
        });
    }
    function handleClickFeuerwerk(_event) {
        let feuerwerkDiv = _event.currentTarget;
        selectedFeuerwerkButton.classList.remove("selected");
        selectedFeuerwerkButton = feuerwerkDiv;
        selectedFeuerwerkButton.classList.add("selected");
        let findFeuerwerkResult = feuerwerke.find((feuerwerk) => feuerwerk.feuerwerkId == selectedFeuerwerkButton.id);
        if (findFeuerwerkResult) {
            selectedFeuerwerk = findFeuerwerkResult;
        }
        setParameters();
        renderPreview();
    }
    function setParameters() {
        radiusSlider.value = selectedFeuerwerk.radius + "";
        particalSlider.value = selectedFeuerwerk.particles + "";
        primaryColorPicker.value = selectedFeuerwerk.primaryColor;
        secondaryColorPicker.value = selectedFeuerwerk.secondaryColor;
    }
    function handleChangeParameter() {
        selectedFeuerwerk.particles = particalSlider.value;
        selectedFeuerwerk.radius = radiusSlider.value;
        selectedFeuerwerk.primaryColor = primaryColorPicker.value;
        selectedFeuerwerk.secondaryColor = secondaryColorPicker.value;
        renderPreview();
    }
    function renderPreview() {
        canvasRenderingContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        canvasRenderingContext.save();
        let circleSteps = Math.PI * 2 / Number(selectedFeuerwerk.particles);
        for (let i = 0; i < Math.PI * 2; i += circleSteps) {
            drawExplosion(i, 2);
        }
        canvasRenderingContext.restore();
    }
    function drawExplosion(_radiusParticle, _lineWidth) {
        canvasRenderingContext.setTransform(1, 0, 0, 1, centerHorizontal, centerVertical);
        canvasRenderingContext.rotate(_radiusParticle);
        let gradient = canvasRenderingContext.createLinearGradient(-_lineWidth / 2, 0, _lineWidth, Number(selectedFeuerwerk.radius));
        gradient.addColorStop(0, selectedFeuerwerk.primaryColor);
        gradient.addColorStop(1, selectedFeuerwerk.secondaryColor);
        canvasRenderingContext.fillStyle = gradient;
        canvasRenderingContext.fillRect(-_lineWidth / 2, 0, _lineWidth, Number(selectedFeuerwerk.radius));
    }
    function handleSaveFeuerwerk(_feuerwerkId, _primaryColor, _secondaryColor, _particals, _radius) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(serverUrl + "?command=find&collection=Feuerwerk&data={%22feuerwerkId%22:%22" + _feuerwerkId + "%22}");
            let json = yield response.json();
            let id = Object.keys(json.data)[0];
            if (json.data.length >= 1) {
                yield fetch(serverUrl + "?command=update&collection=Feuerwerk&id=" + id + "&data={%22primaryColor%22:%22" + _primaryColor.replace("#", "") + "%22,%22secondaryColor%22:%22" + _secondaryColor.replace("#", "") + "%22,%22particles%22:%22" + _particals + "%22,%22radius%22:%22" + _radius + "%22}");
            }
            else {
                yield fetch(serverUrl + "?command=insert&collection=Feuerwerk&data={%22feuerwerkId%22:%22" + _feuerwerkId + "%22,%22primaryColor%22:%22" + _primaryColor.replace("#", "") + "%22,%22secondaryColor%22:%22" + _secondaryColor.replace("#", "") + "%22,%22particles%22:%22" + _particals + "%22,%22radius%22:%22" + _radius + "%22}");
            }
        });
    }
})(FeuerwerkNamespace || (FeuerwerkNamespace = {}));
