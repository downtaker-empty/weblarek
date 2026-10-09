import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader{
  count: number;
}

export class Header extends Component<IHeader>{

  private buttonElement:HTMLButtonElement;
  private counterElement:HTMLElement;

  constructor(container: HTMLElement, event:IEvents) {
    super(container);
  
    this.buttonElement = ensureElement<HTMLButtonElement>('.header__basket',this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter',this.container);
  
    this.buttonElement.addEventListener('click', () => {
      event.emit('basket:open'); 
    });
  
  }

  set counter(value:number){
    this.counterElement.textContent = `${value}`;
  }
}