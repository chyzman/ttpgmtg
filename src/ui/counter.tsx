import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { Border, Button, GameObject, LayoutBox, StaticObject, UIElement, UIZoomVisibility, Vector, VerticalBox } from "@tabletop-playground/api";
import { ChyzUIElement, DEFAULT_ROTATION, UI_SCALE } from "./index";
import { autoSizeText } from "../card/types";

export class Counter extends ChyzUIElement {
  private _value: string | number = 0;
  private _onValueChange = new TriggerableMulticastDelegate<((newValue: string | number) => void)>();

  private _element = new UIElement();
  private _displayElement = new UIElement();

  private _layout = new LayoutBox();
  private _valueButton = new Button();
  private _incrementButton = new Button();
  private _decrementButton = new Button();

  private _displayLayout = new LayoutBox();
  private _displayValueButton = new Button();

  constructor(value?: string | number) {
    super();
    if (value) this.value = value;

    this._element.scale = UI_SCALE;
    this._element.rotation = DEFAULT_ROTATION;
    this._element.castShadow = false;

    this._displayElement.scale = UI_SCALE;
    this._displayElement.rotation = DEFAULT_ROTATION;
    this._displayElement.castShadow = false;
    this._displayElement.zoomVisibility = UIZoomVisibility.Both;

    this._incrementButton.setText("+").onClicked.add(() => this.value += 1);
    this._decrementButton.setText("-").onClicked.add(() => this.value -= 1);

    this._layout.setChild(new Border().setChild(
      new VerticalBox()
        .addChild(new LayoutBox().setOverrideHeight(30).setChild(this._incrementButton))
        .addChild(new LayoutBox().setOverrideHeight(90).setChild(this._valueButton))
        .addChild(new LayoutBox().setOverrideHeight(30).setChild(this._decrementButton))));
    this._element.widget = this._layout;

    this._displayLayout.setChild(new Border().setChild(
      new VerticalBox()
        .addChild(new LayoutBox().setOverrideHeight(90).setChild(this._displayValueButton))));
    this._displayElement.widget = this._displayLayout;


    this._onValueChange.add(newValue => {
      this._valueButton.setText(newValue.toString()).setFontSize(autoSizeText(newValue.toString()));
      this._displayValueButton.setText(newValue.toString()).setFontSize(autoSizeText(newValue.toString()));
    });

    this.updateVisibility(true);
    this.onValueChange.trigger(this.plainValue);

    this.onAttached.add(obj => {
      obj.addUI(this._element);
      obj.addUI(this._displayElement);
    });

    this.onDetached.add(() => {
      this.attachedObject?.removeUIElement(this._element);
      this.attachedObject?.removeUIElement(this._displayElement);
    });

    this.onVisibilityChanged.add(visible => {
      this._layout.setVisible(visible);
      this._displayLayout.setVisible(visible);
    });
  }

  public get value() {
    return !isNaN(+this._value) ? +this._value : 0;
  }

  public set value(value: any) {
    if (value === this._value) return;
    if (value === undefined) value = 0;
    this._value = !isNaN(+value) ? +value : value;
    this._onValueChange.trigger(this._value);
  }

  public get plainValue() {
    return this._value.toString();
  }

  public get onValueChange() {
    return this._onValueChange;
  }

  public set position(position: Vector) {
    this._element.position = position;
    this._displayElement.position = position.add([0, 0, 0.001]);
  }

  public set anchorX(anchorX: number) {
    this._element.anchorX = anchorX;
    this._displayElement.anchorX = anchorX;
  }

  public updateVisibility(hovered: boolean) {
    this._layout.setVisible(hovered);
    this._displayLayout.setVisible(!hovered);
  }
}
