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
    let previewCanvas = document.getElementById("feuerwerk-canvas");
    FeuerwerkNamespace.canvasRenderingContext = previewCanvas.getContext("2d");
    let fireworkSelectionDiv1 = document.getElementById("feuerwerk-1");
    let fireworkSelectionDiv2 = document.getElementById("feuerwerk-2");
    let fireworkSelectionDiv3 = document.getElementById("feuerwerk-3");
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
    let activeFeuerwerke = [];
    function handleLoad() {
        selectedFeuerwerkButton.classList.add("selected");
        previewCanvas.width = previewCanvas.clientWidth;
        previewCanvas.height = previewCanvas.clientHeight;
        previewCanvas.addEventListener("mouseup", handleClickOnCanvas);
        fireworkSelectionDiv1.addEventListener("click", handleClickFeuerwerk);
        fireworkSelectionDiv2.addEventListener("click", handleClickFeuerwerk);
        fireworkSelectionDiv3.addEventListener("click", handleClickFeuerwerk);
        setSavedFeuerwerke();
        window.setInterval(update, 20);
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
        });
    }
    function getCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(serverUrl + "?command=find&collection=Feuerwerk");
            let json = yield response.json();
            return json;
        });
    }
    function fetchSavedFeuerwerke() {
        return __awaiter(this, void 0, void 0, function* () {
            let databaseResponse = yield getCollection();
            if (databaseResponse.status == "failure") {
                alert("Bitte baue erst deine Feuerwerkskörper zusammen!");
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
    function update() {
        FeuerwerkNamespace.canvasRenderingContext.fillRect(0, 0, FeuerwerkNamespace.canvasRenderingContext.canvas.width, FeuerwerkNamespace.canvasRenderingContext.canvas.height);
        for (let firecracker of activeFeuerwerke) {
            firecracker.draw(1 / 50);
        }
        for (let i = activeFeuerwerke.length - 1; i >= 0; i--) {
            if (activeFeuerwerke[i].expendable) {
                activeFeuerwerke.splice(i, 1);
            }
        }
    }
    function handleClickOnCanvas(_event) {
        let boundingClientRect = previewCanvas.getBoundingClientRect();
        let canvasX = _event.pageX - boundingClientRect.left - previewCanvas.clientLeft;
        let canvasY = _event.pageY - boundingClientRect.top - previewCanvas.clientTop;
        try {
            let firecracker = new FeuerwerkNamespace.Feuerwerk(canvasX, canvasY, selectedFeuerwerk.primaryColor, selectedFeuerwerk.secondaryColor, parseInt(selectedFeuerwerk.radius), parseInt(selectedFeuerwerk.particles));
            activeFeuerwerke.push(firecracker);
        }
        catch (e) {
            console.log(e);
        }
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
    }
})(FeuerwerkNamespace || (FeuerwerkNamespace = {}));
