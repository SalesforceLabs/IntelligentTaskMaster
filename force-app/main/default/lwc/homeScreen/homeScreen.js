import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class HomeScreen extends NavigationMixin(LightningElement) {

    handleClick(event) {
        const cardComponent = event.target;
        console.log('This is the card component: '+cardComponent)
        const detail = {
            executionStatus: cardComponent.executionStatus
        };

        this.dispatchEvent(
            new CustomEvent("updatetasklists", {
                detail,
                bubbles: true,
                composed: true
            })
        );
    }

    navigateToRecordList(event) {
        event.preventDefault();
        event.stopPropagation();
        const cardComponent = event.target;
        console.log('This is the card component: '+cardComponent)
        this[NavigationMixin.Navigate]({
            type: "standard__component",
            attributes: {
              componentName: "c__todayTaskLists",
            },
            state: {
                c__iconName: cardComponent.iconName,
                c__totalTasks: cardComponent.totalTasks,
                c__executionStatus: cardComponent.executionStatus,
            },
        });
    }

    _homeScreenJson = [{
        id: 1,
        iconName: 'standard:today',
        totalTasks: 6,
        executionStatus: 'Today'
    },
    {
        id: 2,
        iconName: 'standard:scheduling_policy',
        totalTasks: 4,
        executionStatus: 'Scheduled'
    },
    {
        id: 3,
        iconName: 'standard:display_text',
        totalTasks: 10,
        executionStatus: 'All'
    },
    {
        id: 4,
        iconName: 'standard:flow',
        totalTasks: 10,
        executionStatus: 'Flagged'
    },
    {
        id: 5,
        iconName: 'standard:task2',
        totalTasks: 30,
        executionStatus: 'Completed'
    }];
}