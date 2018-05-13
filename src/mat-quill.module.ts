import {NgModule} from '@angular/core';
import {QuillModule} from '@webacad/ng-quill';

import {MatQuillComponent} from './mat-quill.component';


@NgModule({
	imports: [
		QuillModule,
	],
	declarations: [
		MatQuillComponent,
	],
	exports: [
		QuillModule,
		MatQuillComponent,
	],
})
export class MatQuillModule {}
