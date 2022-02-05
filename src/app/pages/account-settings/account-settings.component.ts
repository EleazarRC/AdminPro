import { Component, OnInit } from '@angular/core';
import { elementAt } from 'rxjs';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  constructor( private settingsService: SettingsService) { }

  ngOnInit(): void {

    this.settingsService.checkCurrenTheme();

  }

  changeTheme(theme: string) {

    this.settingsService.changeTheme(theme);

  }

}
