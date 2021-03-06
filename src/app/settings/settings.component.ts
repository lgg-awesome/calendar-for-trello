import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, select$} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {Board} from '../models/board';
import {SettingsActions} from '../redux/actions/settings-actions';
import {Language} from './language';
import {Settings} from '../models/settings';
import * as moment from 'moment';
import {getOpenBoards} from '../calendar/add-card/add-card.component';

@Component({
  selector: 'app-board-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public languages: Language[] = [];
  private subscriptions: Subscription[] = [];

  @select$('boards', getOpenBoards) public boards$: Observable<Board[]>;
  boards: Board[];

  @select('settings') public settings$: Observable<Settings>;
  public settings: Settings = new Settings();

  constructor(private settingsActions: SettingsActions) {
    this.languages.push(new Language('de', 'Deutsch'));
    this.languages.push(new Language('en', 'English'));
    this.languages.push(new Language('fr', 'Français'));
  }

  public updateLang(locale: string) {
    this.settingsActions.setLanguage(locale);
  }

  public updateIncludeDoneCards(includePref: boolean) {
    this.settingsActions.toggleIncludeDoneCards(includePref);
  }

  public updateShowMembers(includePref: boolean) {
    this.settingsActions.toggleShowMembers(includePref);
  }


  ngOnInit() {
    this.subscriptions.push(
      this.boards$.subscribe(
        boards => {
          this.boards = boards
            .map(board => Object.assign({}, board));
        }
      ));
    this.subscriptions.push(
      this.settings$.subscribe(
        settings => {
          this.settings = settings;
          moment.locale(settings.language);
        }
      ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
