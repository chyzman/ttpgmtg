import { Button, LayoutBox, VerticalBox } from "@tabletop-playground/api";

export class CounterWidget {
  private baseValue: string;
  private currentValue: string;

  private readonly _displayButton: Button;

  private readonly _incrementButton: Button;
  private readonly _decrementButton: Button;

  private readonly _box: VerticalBox;

  constructor(baseValue: string) {
    this.baseValue = baseValue;
    this.currentValue = baseValue;
    this._displayButton = new Button().setFontSize(48).setText(this.currentValue);
    this._incrementButton = new Button().setText("+");
    this._decrementButton = new Button().setText("-");
    this._box = new VerticalBox()
      .addChild(this._incrementButton, 0.25)
      .addChild(this._displayButton, 1)
      .addChild(this._decrementButton, 0.25);
  }

  getWidget(): VerticalBox {
    return this._box;
  }
}
