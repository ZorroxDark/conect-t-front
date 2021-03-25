import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { congregantesRoutes } from './congregantes.routing';
import { CongregantesComponent } from 'app/modules/admin/pages/congregantes/congregantes.component';

import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { exampleRoutes } from 'app/modules/admin/example/example.routing';


@NgModule({
    declarations: [
        CongregantesComponent
    ],
    imports     : [
        RouterModule.forChild(congregantesRoutes),
        SharedModule
    ]
})
export class CongregantesModule
{
}
