import { makeAutoObservable } from "mobx";

export class UiStore {
    isLoading = false;
    constructor() {
        makeAutoObservable(this);
    }
    setBusy = () => {
        this.isLoading = true;
    }
    setIdle = () => {
        this.isLoading = false;
    }
}