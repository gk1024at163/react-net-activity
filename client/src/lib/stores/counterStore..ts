// 类：CounterStore
import { makeAutoObservable } from "mobx";
export default class CounterStore {
    // 类的属性定义，自动就是可以观察的
    title = "Counter Store Example";
    count = 42;
    events: string[] = [
        `${new Date().toLocaleString()} Store Initial, count = ${this.count}`
    ];
    constructor() {
        makeAutoObservable(this);
    }
    // 使用箭头函数会自动绑定到此类上，就是类的方法，Mobox会自动把它当成动作处理
    increment = (amount = 1) => {
        this.count += amount;
        this.events.push(`${new Date().toLocaleString()} Incremented by ${amount}, count = ${this.count}`);
    }
    decrement = (amount = 1) => {
        this.count -= amount;
        this.events.push(`${new Date().toLocaleString()} Decremented by ${amount}, count = ${this.count}`);
    }
    // 计算属性，也会自动成为观察的
    get eventCount() {
        return this.events.length;
    }
    clearEvents = () => {
        this.events = [];
    }
}