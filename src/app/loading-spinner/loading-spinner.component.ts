import {Component, OnInit} from "@angular/core";
import {TrelloPullService} from "../services/trello-pull.service";
import {Observable, ReplaySubject, Subject, Subscription} from "rxjs";
import {select} from "ng2-redux";
import {selectSettingsType} from "../redux/store/selects";
import {CalendarType} from "../redux/actions/settings-actions";
import {CalendarActions} from "../redux/actions/calendar-actions";
import * as moment from "moment";

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit {

  calendarType: CalendarType;
  @select(selectSettingsType) public calendarType$: Observable<any>;
  loadingState$: Subject<boolean> = new ReplaySubject();
  private subscriptions: Subscription[] = [];

  constructor(private trelloPullService: TrelloPullService, private calendarActions: CalendarActions) {
    this.loadingState$ = trelloPullService.loadingState$;
  }

  ngOnInit() {
    this.subscriptions.push(
      Observable
        .timer(0, 30000)
        .subscribe(() => {
          this.doRefresh();
        })
    );

    this.subscriptions.push(this.calendarType$.subscribe(
      type => this.calendarType = type
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  doRefresh() {
    this.trelloPullService.pull();
    this.calendarActions.navigateToDate(moment(), this.calendarType);
  }
}
