import {
  Component, OnInit, forwardRef, ViewChild, EventEmitter, Output, Renderer,
  ElementRef, Input
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const INLINE_EDIT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InlineEditComponent),
  multi: true
};

@Component({
  selector: 'hxl-inline-edit',
  providers: [INLINE_EDIT_CONTROL_VALUE_ACCESSOR],
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.less']
})
export class InlineEditComponent implements OnInit, ControlValueAccessor {
  @ViewChild('editControl')
  private editControl;
  @Input()
  public editMode: string;
  @Input()
  public textArea = false;
  @Input()
  public showEditIcon = false;
  @Input()
  public placeholder: string;
  @Input()
  public maxEditorWidth: string;
  @Output()
  public onSave: EventEmitter<any> = new EventEmitter();

  // internal data model
  private _value = '';
  private preValue: string;
  editing = false;

  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;

  constructor(element: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    if (value !== this._value) {
      this._value = value;
      this.onChange(value);
    }
  }

  edit(value) {
    this.preValue = value;
    this.editing = true;
    // automatically set focus
    setTimeout( _ => this.renderer.invokeElementMethod(this.editControl.nativeElement, 'focus', []));
  }

  save(value) {
    this.onSave.emit(value);
    this.editing = false;
  }

  cancel(value: any) {
    this._value = this.preValue;
    this.editing = false;
  }
}
