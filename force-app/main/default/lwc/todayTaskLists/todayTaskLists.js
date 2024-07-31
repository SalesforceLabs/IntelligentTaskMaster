import { api, LightningElement, wire } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import fetchTodaysTasks from '@salesforce/apex/toDaysTaskList.fetchTodaysTasks';
import fetchFlaggedTasks from '@salesforce/apex/toDaysTaskList.fetchFlaggedTasks';
import updateTask from '@salesforce/apex/toDaysTaskList.updateTask';

export default class TodayTaskLists extends LightningElement {
    searchTask;
    todaysTasks;
    flaggedTodaysTasks;
    taskID;
    taskStatsUpdate;
    errorDetails;
    executionStatus;

    @wire(CurrentPageReference)
    currentPageRef;

    @api cardComponent;

    get isTodayTask() {
        return this.currentPageRef.state.c__executionStatus==='Today';
    }

    get isFlaggedTask() {
        return this.currentPageRef.state.c__executionStatus==='Flagged';
    }

    taskNameChange(event){
        this.searchTask=event.target.value;
        console.log('this.searchTask'+this.searchTask);
        fetchTodaysTasks({searchTask:this.searchTask})
        .then(result => {
            this.todaysTasks=result;
        })
        .catch(error => {
            this.errorDetails=error;
        });
    }

    flaggedTaskNameChange(event){
        this.searchTask=event.target.value;
        console.log('this.searchTask'+this.searchTask);
        fetchFlaggedTasks({searchTask:this.searchTask})
        .then(result => {
            this.flaggedTodaysTasks=result;
        })
        .catch(error => {
            this.errorDetails=error;
        });
    }

    updateTaskFunction(event){
        this.taskID=event.target.name;
        console.log('this.taskID: '+this.taskID);
        this.taskStatsUpdate=event.target.label;
        console.log('this.taskStatsUpdate: '+this.taskStatsUpdate);
        updateTask({taskID:this.taskID,taskStatsUpdate:this.taskStatsUpdate})
        .then(result => {
            this.todaysTasks=result;
        })
        .catch(error => {
            this.errorDetails=error;
        });
    }

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

    get iconName() {
        return this.currentPageRef.state.c__iconName;
    }

    get todayText() {
        return this.currentPageRef.state.c__executionStatus;
    }

    @api
    get taskListData() {
        return this._taskListData;
    }
    set taskListData(value) {
        this._taskListData = value;
    }

}