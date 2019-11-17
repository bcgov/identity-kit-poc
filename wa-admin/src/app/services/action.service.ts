import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IInvitationRecord } from '../shared/interfaces/invitation-record.interface';
import { StateService, StateType } from './state.service';
import { ActionType } from '../shared/interfaces/actions.interface';
import { of } from 'rxjs';

const testData = [
  {
    _id: 'abcdef',
    consumed: false,
    method: 'github',
    email: 'sean@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime() + 5000000,
    active: false,
    firstName: '',
    lastName: '',
    icon: '',
    created: new Date().getTime() - 5000000
  },
  {
    _id: 'xyzeabced',
    consumed: false,
    method: 'github',
    email: 'billy@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime() - 5000000,
    active: false,
    firstName: '',
    lastName: '',
    icon: '',
    created: new Date().getTime() - 10000000
  }
] as IInvitationRecord[];

const confirmed = [
  {
    _id: 'abc123',
    consumed: true,
    method: 'github',
    email: 'emiliano@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime(),
    active: true,
    firstName: 'Emiliano',
    lastName: 'Example',
    icon: 'github',
    created: new Date().getTime() - 25000000
  },
  {
    _id: 'abcd',
    consumed: true,
    method: 'github',
    email: 'email@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime(),
    active: false,
    firstName: 'Joe',
    lastName: 'Thomson',
    icon: 'github',
    created: new Date().getTime() - 35000000
  }
];

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  invitedUsers: IInvitationRecord[];
  confirmedUsers: IInvitationRecord[];
  constructor(private httpSvc: HttpService, private stateSvc: StateService) {
    this.loadData();
    this.invitedUsers = testData;
    this.confirmedUsers = confirmed;
  }

  loadData() {
    this.stateSvc.userList = testData;
  }

  async createInvitation(params: {
    method: string;
    jurisdiction: string;
    email: string;
  }) {
    // TODO: SH: Hook this up to the back end
    // return this.httpSvc.post<{ _id: string }>('invitations', params);
  }

  applyAction(action: ActionType, records?: string[]) {
    const actions = {
      clear: this.clearRecords(),
      change: this.changeAccess(records)
    };
    return actions[action];
  }

  clearRecords() {
    this.stateSvc.changeRecords.clear();
  }

  changeAccess(records: string[]) {
    console.log('records', records);
    const users = records.map(record => {
      console.log(this.stateSvc.userList);
      const { active, ...noActive } = this.stateSvc.userList.filter(
        user => user._id === record
      )[0];
      return { active: !active, ...noActive };
    });
    this.stateSvc.userList = users;
  }

  changeState(state: StateType) {
    this.stateSvc.userList =
      state === 'invited' ? this.invitedUsers : this.confirmedUsers;
  }

  getRecord(id: string) {
    const recordList = [
      ...this.invitedUsers,
      ...this.confirmedUsers
    ] as IInvitationRecord[];
    return of(recordList.filter(record => record._id === id)[0]);
  }
}
