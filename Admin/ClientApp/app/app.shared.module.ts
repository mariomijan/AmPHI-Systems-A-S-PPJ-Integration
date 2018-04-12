import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { VehicleComponent } from './components/Vehicle/vehicle.component';
import { Manager } from '../Manager';
import { Proxy } from '../proxy';

@NgModule({
    declarations: [
        AppComponent,
        VehicleComponent
        
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [Manager, Proxy]
})
export class AppModuleShared {
}
