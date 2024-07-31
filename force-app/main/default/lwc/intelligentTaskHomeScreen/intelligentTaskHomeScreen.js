import { LightningElement } from 'lwc';

export default class IntelligentTaskHomeScreen extends LightningElement {

    _taskListData = {};
    _homeScreenJson = [{
        id: 1,
        iconName: 'standard:today',
        totalTasks: 7,
        executionStatus: 'Today',
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
    },
    {
        id: 2,
        iconName: 'standard:scheduling_policy',
        totalTasks: 5,
        executionStatus: 'Scheduled',
        taskList: [{
            id: 1,
            taskHeader: 'Scheduled Invitations',
            taskSubHeader: 'Thrown party for the eve'
        },
        {
            id: 2,
            taskHeader: 'Planned a test drive on Tuesday',
            taskSubHeader: 'Bought a new car'
        },
        {
            id: 3,
            taskHeader: 'Gave a walkthrough of the office',
            taskSubHeader: 'Onboard James'
        },
        {
            id: 4,
            taskHeader: 'Get copy of signed contract',
            taskSubHeader: 'Onboard James'
        },
        {
            id: 5,
            taskHeader: 'Order a cake',
            taskSubHeader: 'Throw party for eve'
        }]
    },
    {
        id: 3,
        iconName: 'standard:display_text',
        totalTasks: 3,
        executionStatus: 'All',
        taskList: [{
            id: 1,
            taskHeader: 'Get copy of signed contract',
            taskSubHeader: 'Onboard James'
        },
        {
            id: 2,
            taskHeader: 'Order a cake',
            taskSubHeader: 'Throw party for eve'
        },
        {
            id: 3,
            taskHeader: 'Gave a walkthrough of the office',
            taskSubHeader: 'Onboard James'
        }]
    },
    {
        id: 4,
        iconName: 'standard:flow',
        totalTasks: 2,
        executionStatus: 'Flagged',
        taskList: [{
            id: 1,
            taskHeader: 'Get contract',
            taskSubHeader: 'James Bound'
        },
        {
            id: 2,
            taskHeader: 'Cake is ordered',
            taskSubHeader: 'Party is thrown '
        }]
    },
    {
        id: 5,
        iconName: 'standard:task2',
        totalTasks: 0,
        executionStatus: 'Completed',
        taskList: []
    }];

    updateTaskLists(event) {
        console.log('This is the event received from child: '+event);
        const executionStatus = event.detail.executionStatus;
        const taskData =this._homeScreenJson;
        for (let i=0; i<taskData.length; i++) {
            if (taskData[i].executionStatus === executionStatus) {
                this._taskListData = taskData[i];
            }
        }
    }
}