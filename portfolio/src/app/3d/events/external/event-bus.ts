export enum Event {
  on3dModelLabelButtonClick
}

export class Message {
  body?: string;
  constructor(body: string) {
    this.body = body;
  }
}

export interface Registry {
  unregister: () => void;
}

export interface Callable {
  [key: string]: Function;
}

export interface Subscriber {
  [key: string]: Callable;
}

export interface IEventBus {
  dispatch<Message>(event: Event, message: Message): void;
  register(event: Event, callback: Function): Registry;
}

export class EventBus implements IEventBus {
  private subscribers: Subscriber;
  private static nextId = 0;

  private static instance?: EventBus = undefined;

  private constructor() {
    this.subscribers = {};
  }

  public static getInstance(): EventBus {
    if (this.instance === undefined) {
      this.instance = new EventBus();
    }

    return this.instance;
  }

  public dispatch<Message>(event: Event, message: Message): void {
    const subscriber = this.subscribers[event];

    if (subscriber === undefined) {
      return;
    }

    Object.keys(subscriber).forEach((key) => subscriber[key](message));
  }

  public register(event: Event, callback: Function): Registry {
    const id = this.getNextId();
    if (!this.subscribers[event]) this.subscribers[event] = {};

    this.subscribers[event][id] = callback;

    return {
      unregister: () => {
        delete this.subscribers[event][id];
        if (Object.keys(this.subscribers[event]).length === 0)
          delete this.subscribers[event];
      },
    };
  }

  private getNextId(): number {
    return EventBus.nextId++;
  }
}
