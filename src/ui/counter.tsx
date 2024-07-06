import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { Border, Button, HorizontalAlignment, LayoutBox, MultilineTextBox, Player, TextBox, UIElement, UIZoomVisibility, Vector, VerticalBox } from "@tabletop-playground/api";
import { ChyzUIElement, DEFAULT_ROTATION, UI_SCALE } from "./index";
import { autoSizeText } from "../card/types";
import { boxChild, jsxInTTPG, render } from "jsx-in-ttpg";

export class Counter extends ChyzUIElement {
  private _value: string | number = 0;
  private _onValueChange = new TriggerableMulticastDelegate<((newValue: string | number) => void)>();

  private _defaultValue = 0;

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

    this._valueButton.onClicked.add((button, player) => this.openEditor(player));


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

  public set defaultValue(value: any) {
    if (value === undefined) this._defaultValue = 0;
    this._defaultValue = !isNaN(+value) ? +value : value;
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

  public openEditor(player: Player) {
    if (!this.attachedObject) return;

    let editor = new UIElement();
    editor.scale = UI_SCALE;
    editor.rotation = DEFAULT_ROTATION;
    editor.castShadow = false;
    editor.position = this._element.position.add([0, 0, -0.1]);
    editor.players.addPlayer(player);

    let tempValue = this._value;

    let input = new TextBox().setText(tempValue.toString()).setFontSize(30).setInputType(1).setSelectTextOnFocus(true).setMaxLength(1023);
    input.onTextChanged.add((text) => {
      tempValue = text.getText();
    });


    function setTempValue(value: string | number) {
      tempValue = value;
      input.setText(tempValue.toString());
    }

    editor.widget = render(
      <border>
        <layout minWidth={200}>
          <verticalbox halign={HorizontalAlignment.Fill}>
            <horizontalbox>
              {boxChild(1/2, <button onClick={button => setTempValue(this.value)}>previous</button>)}
              {boxChild(1/2, <button onClick={button => setTempValue(this._defaultValue)}>default</button>)}
            </horizontalbox>
            <horizontalbox>
              {boxChild(1/3,<verticalbox>
                {boxChild(1/2, <button onClick={button => setTempValue(!isNaN(+tempValue) ? +tempValue * 2 : 2)}>x2</button>)}
                {boxChild(1/2, <button onClick={button => setTempValue(!isNaN(+tempValue) ? +tempValue / 2 : 0.5)}>1/2</button>)}
              </verticalbox>)}
              {boxChild(1/3,<verticalbox>
                {boxChild(1/2, <button onClick={button => setTempValue(!isNaN(+tempValue) ? +tempValue + 10 : 10)}>+10</button>)}
                {boxChild(1/2, <button onClick={button => setTempValue(!isNaN(+tempValue) ? +tempValue - 10 : -10)}>-10</button>)}
              </verticalbox>)}
              {boxChild(1/3,<verticalbox>
                {boxChild(1/2, <button onClick={button => setTempValue(!isNaN(+tempValue) ? +tempValue + 1 : 1)}>+1</button>)}
                {boxChild(1/2, <button onClick={button => setTempValue(!isNaN(+tempValue) ? +tempValue - 1 : -1)}>-1</button>)}
              </verticalbox>)}
            </horizontalbox>
            {input}
            <horizontalbox>
              {boxChild(1 / 2, <button
                onClick={() => {
                  this.value = tempValue;
                  this.attachedObject?.removeUIElement(editor);
                }}
              >Save</button>)}
              {boxChild(1/2, <button onClick={() => this.attachedObject?.removeUIElement(editor)}>Cancel</button>)}
            </horizontalbox>
          </verticalbox>
        </layout>
      </border>
    );

    this.attachedObject.addUI(editor);

  }
}
