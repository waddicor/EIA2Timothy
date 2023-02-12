namespace FeuerwerkNamespace {

    window.addEventListener("load", handleLoad);

    let previewCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("feuerwerk-preview-canvas");
    let canvasRenderingContext: CanvasRenderingContext2D= <CanvasRenderingContext2D>previewCanvas.getContext("2d");
    let radiusSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("firecracker-setup-radius");
    let particalSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("firecracker-setup-particel");
    let primaryColorPicker: HTMLInputElement = <HTMLInputElement>document.getElementById("firecracker-setup-color-primary");
    let secondaryColorPicker: HTMLInputElement = <HTMLInputElement>document.getElementById("firecracker-setup-color-secondary");
    let fireworkSelectionDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById("feuerwerk-1");
    let fireworkSelectionDiv2: HTMLDivElement = <HTMLDivElement>document.getElementById("feuerwerk-2");
    let fireworkSelectionDiv3: HTMLDivElement = <HTMLDivElement>document.getElementById("feuerwerk-3");
    let saveButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("save-feuerwerk-button");
    let resetButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("reset-feuerwerk-button");
    let centerHorizontal: number;
    let centerVertical: number;
    let selectedFeuerwerkButton: HTMLDivElement = fireworkSelectionDiv1;
    let serverUrl: string = "https://webuser.hs-furtwangen.de/~waddicor/Database/"
    let feuerwerke: IFeuerwerk[] = [
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
    let selectedFeuerwerk: IFeuerwerk = feuerwerke[0];

    function handleLoad(): void {
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

    async function setSavedFeuerwerke(): Promise<void> {
        let databaseFeuerwerke: IFeuerwerk[] = await fetchSavedFeuerwerke();  
        
        if (databaseFeuerwerke.length < 1) {
            return;
        } else if (databaseFeuerwerke.length == feuerwerke.length) {
            feuerwerke = databaseFeuerwerke;
        } else {
            for(let i: number = 0; i < databaseFeuerwerke.length; i++) {
                let index: number = feuerwerke.findIndex((feuerwerk) => feuerwerk.feuerwerkId == databaseFeuerwerke[i].feuerwerkId)
                if (index != -1) {                  
                    feuerwerke[index] = databaseFeuerwerke[i];            
                }
            }
        }

        let index: number = feuerwerke.findIndex((feuerwerk) => feuerwerk.feuerwerkId == selectedFeuerwerk.feuerwerkId);
        selectedFeuerwerk = feuerwerke[index];

        setParameters();
        renderPreview();
    }

    async function getCollection(): Promise<IMingiDbResponse> {
        let response: Response = await fetch(serverUrl + "?command=find&collection=Feuerwerk")
        let json: IMingiDbResponse = await response.json()
        return json
    }

    async function createCollection(): Promise<any> {
        await fetch(serverUrl + "?command=create&collection=Feuerwerk")
        feuerwerke.forEach(async (feuerwerk) => {
            await handleSaveFeuerwerk(feuerwerk.feuerwerkId, feuerwerk.primaryColor, feuerwerk.secondaryColor, feuerwerk.particles, feuerwerk.radius )
        })
    }

    async function fetchSavedFeuerwerke(): Promise<IFeuerwerk[]> {
        let databaseResponse: IMingiDbResponse = await getCollection()

        if (databaseResponse.status == 'failure') {
            await createCollection()
            databaseResponse = await getCollection()
            setParameters();
            renderPreview();
        }
        let data = databaseResponse.data;
        let keys = Object.keys(data)
        let databaseFeuerwerke = keys.map((key) => {
            data[key].primaryColor =  "#" + data[key].primaryColor
            data[key].secondaryColor =  "#" + data[key].secondaryColor
            return data[key]
        })
        return databaseFeuerwerke
    }

    function handleClickFeuerwerk(_event: Event): void {
        let feuerwerkDiv: HTMLDivElement = <HTMLDivElement>_event.currentTarget;
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

    function setParameters(): void {
        radiusSlider.value = selectedFeuerwerk.radius + "";
        particalSlider.value = selectedFeuerwerk.particles + "";
        primaryColorPicker.value = selectedFeuerwerk.primaryColor;
        secondaryColorPicker.value = selectedFeuerwerk.secondaryColor;
    }

    function handleChangeParameter(): void {
        selectedFeuerwerk.particles = particalSlider.value;
        selectedFeuerwerk.radius = radiusSlider.value;
        selectedFeuerwerk.primaryColor = primaryColorPicker.value;
        selectedFeuerwerk.secondaryColor = secondaryColorPicker.value;
        renderPreview();
    }

    function renderPreview(): void {        
        canvasRenderingContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        canvasRenderingContext.save();
        
        let circleSteps: number = Math.PI * 2 / Number(selectedFeuerwerk.particles); 

        for (let i: number = 0; i < Math.PI * 2; i += circleSteps) { 
            drawExplosion(i, 2); 
        }
        canvasRenderingContext.restore();
    }

    function drawExplosion(_radiusParticle: number, _lineWidth: number): void {
        canvasRenderingContext.setTransform(1, 0, 0, 1, centerHorizontal, centerVertical); 
        canvasRenderingContext.rotate(_radiusParticle);

        let gradient: CanvasGradient = canvasRenderingContext.createLinearGradient(-_lineWidth / 2, 0, _lineWidth, Number(selectedFeuerwerk.radius)); 

        gradient.addColorStop(0, selectedFeuerwerk.primaryColor);
        gradient.addColorStop(1, selectedFeuerwerk.secondaryColor);

        canvasRenderingContext.fillStyle = gradient;
        canvasRenderingContext.fillRect(-_lineWidth / 2, 0, _lineWidth, Number(selectedFeuerwerk.radius)); 
    }

    async function handleSaveFeuerwerk(_feuerwerkId: string, _primaryColor: string, _secondaryColor: string, _particals: string, _radius: string): Promise<void> {

        let response = await fetch(serverUrl + "?command=find&collection=Feuerwerk&data={%22feuerwerkId%22:%22" + _feuerwerkId + "%22}")

        let json: IMingiDbResponse = await response.json()
        let id = Object.keys(json.data)[0]
        if (json.data.length >= 1) {
            await fetch(serverUrl + "?command=update&collection=Feuerwerk&id=" + id + "&data={%22primaryColor%22:%22" + _primaryColor.replace("#", "") + "%22,%22secondaryColor%22:%22" + _secondaryColor.replace("#", "") + "%22,%22particles%22:%22" + _particals + "%22,%22radius%22:%22" + _radius + "%22}")
        } else {
            await fetch(serverUrl + "?command=insert&collection=Feuerwerk&data={%22feuerwerkId%22:%22" + _feuerwerkId + "%22,%22primaryColor%22:%22" + _primaryColor.replace("#", "") + "%22,%22secondaryColor%22:%22" + _secondaryColor.replace("#", "") + "%22,%22particles%22:%22" + _particals + "%22,%22radius%22:%22" + _radius + "%22}")
        }

    }
}