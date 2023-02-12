namespace FeuerwerkNamespace {
    export interface IFeuerwerk {
        feuerwerkId: string;
        primaryColor: string;
        secondaryColor: string;
        radius: string;
        particles: string;
    }

    export interface IMingiDbResponse {
        status: string,
        data: any
    }
}