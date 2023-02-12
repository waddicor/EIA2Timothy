namespace FeuerwerkNamespace {
    window.addEventListener("load", handleLoad);

    let previewCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("feuerwerk-canvas");
    export let canvasRenderingContext: CanvasRenderingContext2D= <CanvasRenderingContext2D>previewCanvas.getContext("2d");
    let fireworkSelectionDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById("feuerwerk-1");
    let fireworkSelectionDiv2: HTMLDivElement = <HTMLDivElement>document.getElementById("feuerwerk-2");
    let fireworkSelectionDiv3: HTMLDivElement = <HTMLDivElement>document.getElementById("feuerwerk-3");
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
    let activeFeuerwerke: Feuerwerk[] = [];

    function handleLoad(): void {
        selectedFeuerwerkButton.classList.add("selected");

        previewCanvas.width = previewCanvas.clientWidth;
        previewCanvas.height = previewCanvas.clientHeight;

        previewCanvas.addEventListener("mouseup", handleClickOnCanvas);
        fireworkSelectionDiv1.addEventListener("click", handleClickFeuerwerk);
        fireworkSelectionDiv2.addEventListener("click", handleClickFeuerwerk);
        fireworkSelectionDiv3.addEventListener("click", handleClickFeuerwerk);
        
        setSavedFeuerwerke()
        window.setInterval(update, 20)
    }

    async function setSavedFeuerwerke(): Promise<void> {
        let databaseFeuerwerke: IFeuerwerk[] = await fetchSavedFeuerwerke();  
        if (databaseFeuerwerke.length < 1) {
            return;
        } else if (databaseFeuerwerke.length == feuerwerke.length) {
            feuerwerke = databaseFeuerwerke;
        } else {
            for(let i: number = 0; i < databaseFeuerwerke.length; i++) {
                let index = feuerwerke.findIndex((feuerwerk) => feuerwerk.feuerwerkId == databaseFeuerwerke[i].feuerwerkId)
                if (index != -1) {                  
                    feuerwerke[index] = databaseFeuerwerke[i];            
                }
            }
        }
        let index = feuerwerke.findIndex((feuerwerk) => feuerwerk.feuerwerkId == selectedFeuerwerk.feuerwerkId);
        selectedFeuerwerk = feuerwerke[index];
    }

    async function getCollection(): Promise<IMingiDbResponse> {
        let response: Response = await fetch(serverUrl + "?command=find&collection=Feuerwerk")
        let json: IMingiDbResponse = await response.json()
        return json
    }

    async function fetchSavedFeuerwerke(): Promise<IFeuerwerk[]> {
        let databaseResponse: IMingiDbResponse = await getCollection()
        if (databaseResponse.status == "failure") {
            alert("Bitte baue erst deine Feuerwerkskörper zusammen!")
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

    function update(): void {
        canvasRenderingContext.fillRect(0, 0, canvasRenderingContext.canvas.width, canvasRenderingContext.canvas.height); 

        for (let firecracker of activeFeuerwerke) {   
            firecracker.draw(1 / 50);
        }

        for (let i: number = activeFeuerwerke.length - 1; i >= 0; i--) { 
            if (activeFeuerwerke[i].expendable) {
                activeFeuerwerke.splice(i, 1);
            }
        }
    }

    function handleClickOnCanvas(_event: MouseEvent): void {
        let boundingClientRect: DOMRect = previewCanvas.getBoundingClientRect();                
        
        let canvasX: number = _event.pageX - boundingClientRect.left - previewCanvas.clientLeft;
        let canvasY: number = _event.pageY - boundingClientRect.top - previewCanvas.clientTop;
        try {
            let firecracker: Feuerwerk = new Feuerwerk(canvasX, canvasY, selectedFeuerwerk.primaryColor, selectedFeuerwerk.secondaryColor, parseInt(selectedFeuerwerk.radius), parseInt(selectedFeuerwerk.particles));
            activeFeuerwerke.push(firecracker);
        }catch (e) {
            console.log(e);
        }
        
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
    }
}