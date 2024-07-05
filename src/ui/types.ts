import { StaticObject } from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";

export class ChyzUIElement {
  private _visible = true;
  private _onVisibilityChanged = new TriggerableMulticastDelegate<((newVisibility: boolean) => void)>();

  private _attached?: StaticObject;
  private _onAttached = new TriggerableMulticastDelegate<((object: StaticObject) => void)>();
  private _onDetached = new TriggerableMulticastDelegate();

  constructor() {
  }

  //region Visibility

  public get visible() {
    return this._visible;
  }

  public set visible(value: boolean) {
    this.setVisibility(value);
  }

  public setVisibility(value: boolean) {
    if (this._visible === value) return false;
    this._visible = value;
    this._onVisibilityChanged.trigger(value);
    return true;
  }

  public get onVisibilityChanged() {
    return this._onVisibilityChanged;
  }

  //endregion

  //region Attach

  public get attachedObject() {
    return this._attached;
  }

  public get onAttached() {
    return this._onAttached;
  }

  public get onDetached() {
    return this._onDetached;
  }

  public attach(object: StaticObject) {
    if (this._attached === object) return false;
    this._attached = object;
    this._onAttached.trigger(object);
    return true;
  }

  public detach() {
    if (!this._attached) return false;
    this._onDetached.trigger();
    this._attached = undefined;
    return true;
  }

  public setAttached(object: StaticObject | undefined) {
    if (this._attached === object) return false;
    this.detach();
    if (object) this.attach(object);
    this._attached = object;
    return true;
  }

  //endregion
}
