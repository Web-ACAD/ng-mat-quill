import {Component, Input, Self, Optional, ElementRef, SimpleChanges, OnChanges, DoCheck, OnDestroy} from '@angular/core';
import {NgControl, NgForm, FormGroupDirective, FormControl} from '@angular/forms';
import {ErrorStateMatcher, CanUpdateErrorState} from '@angular/material/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {QuillComponent} from '@webacad/ng-quill';
import {Subject} from 'rxjs';


let nextUniqueId: number = 0;


@Component({
	selector: 'wa-mat-quill',
	template: '',
	providers: [
		{
			provide: MatFormFieldControl,
			useExisting: MatQuillComponent,
		},
	],
})
export class MatQuillComponent extends QuillComponent implements
	OnChanges,
	DoCheck,
	OnDestroy,
	MatFormFieldControl<string>,
	CanUpdateErrorState
{


	@Input()
	public placeholder: string;

	@Input()
	public required: boolean = false;

	@Input()
	public errorStateMatcher: ErrorStateMatcher;

	public errorState: boolean = false;

	public readonly stateChanges: Subject<void> = new Subject<void>();

	public readonly shouldLabelFloat: boolean = true;

	private _disabled: boolean = false;

	private _id: string;

	private _uid: string = `wa-quill-${nextUniqueId++}`;


	constructor(
		el: ElementRef,
		private _defaultErrorStateMatcher: ErrorStateMatcher,
		@Optional() private _parentForm: NgForm,
		@Optional() private _parentFormGroup: FormGroupDirective,
		@Self() @Optional() public readonly ngControl: NgControl,
	) {
		super(el);

		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}
	}


	@Input()
	get value(): any
	{
		return this.getValue();
	}

	set value(value: any)
	{
		if (this.editor) {
			if (value !== this.value) {
				this.editor.setContents(value);
				this.stateChanges.next();
			}
		}
	}


	@Input()
	get disabled(): boolean
	{
		if (this.ngControl && this.ngControl.disabled !== null) {
			return this.ngControl.disabled;
		}

		return this._disabled;
	}

	set disabled(disabled: boolean)
	{
		this._disabled = disabled;
	}


	@Input()
	get id(): string
	{
		return this._id;
	}

	set id(id: string)
	{
		this._id = id || this._uid;
	}


	get empty(): boolean
	{
		return typeof this.value === 'undefined';
	}


	get focused(): boolean
	{
		if (this.editor) {
			return this.editor.hasFocus();
		}

		return false;
	}


	public ngOnChanges(changes: SimpleChanges): void
	{
		if (typeof changes['value'] !== 'undefined' || typeof changes['required'] !== 'undefined') {
			this.stateChanges.next();
		}
	}


	public ngDoCheck(): void
	{
		if (this.ngControl) {
			this.updateErrorState();
		}
	}


	public ngOnDestroy(): void
	{
		this.stateChanges.complete();
	}


	public onContainerClick(event: MouseEvent): void
	{
		if (!this.focused) {
			this.focus();
		}
	}


	public focus(): void
	{
		if (this.editor) {
			this.editor.focus();
			this.stateChanges.next();
		}
	}


	public updateErrorState(): void
	{
		const oldState = this.errorState;
		const parent = this._parentFormGroup || this._parentForm;
		const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
		const control = this.ngControl ? <FormControl>this.ngControl.control : null;
		const newState = matcher.isErrorState(control, parent);

		if (newState !== oldState) {
			this.errorState = newState;
			this.stateChanges.next();
		}
	}


	public setDescribedByIds(ids: Array<string>): void
	{
	}

}
