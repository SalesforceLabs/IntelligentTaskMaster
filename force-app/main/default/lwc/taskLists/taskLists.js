import { LightningElement, api } from 'lwc';

export default class TaskLists extends LightningElement {

    _taskListData = {
        iconName:"custom:custom11",
        title:"Today",
        taskList: [{
            id: 1,
            taskHeader: 'Send Invitations',
            taskSubHeader: 'Throw party for eve'
        },
        {
            id: 2,
            taskHeader: 'Plan a test drive',
            taskSubHeader: 'Buy a new car'
        },
        {
            id: 3,
            taskHeader: 'Inquire about loans',
            taskSubHeader: 'Buy a new car'
        },
        {
            id: 4,
            taskHeader: 'Provide access keyboard',
            taskSubHeader: 'Onboard James'
        },
        {
            id: 5,
            taskHeader: 'Gave a walkthrough of the office',
            taskSubHeader: 'Onboard James'
        },
        {
            id: 6,
            taskHeader: 'Get copy of signed contract',
            taskSubHeader: 'Onboard James'
        },
        {
            id: 7,
            taskHeader: 'Order a cake',
            taskSubHeader: 'Throw party for eve'
        }]
    };

    @api
    get taskListData() {
        return this._taskListData;
    }
    set taskListData(value) {
        this._taskListData = value;
    }

}