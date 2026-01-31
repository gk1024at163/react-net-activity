import { createContext } from "react";
import CounterStore from "./counterStore.";
import { UiStore } from "./uiStore";

// 创建 Store 对象, 包含多个子 Store, 这里仅包含 CounterStore, 可根据需要添加更多子 Store
interface Store {
    counterStore: CounterStore;//此处 CounterStore 是作为类型使用
    uiStore: UiStore;
}

export const store: Store = {
    counterStore: new CounterStore(),
    uiStore: new UiStore(),
};
export const StoreContext = createContext(store);