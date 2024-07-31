import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getActionPlanTasks from '@salesforce/apex/getMenteesAndProgress.getActionPlanTasks';
import notFoundImage from '@salesforce/resourceUrl/NotFound'

export default class cardList extends NavigationMixin(
    LightningElement
) {
    @track tasks = [];
    @track isEmpty = false;
    noDataUrl = notFoundImage;

    connectedCallback() {
        getActionPlanTasks()
            .then(result => {
                this.tasks = result.mentorTasks;
                this.isEmpty = this.tasks == null || this.tasks.length == 0;
            })
            .catch(error => {
                this.error = error;
            });   
    };
    recordPageUrl;

    viewRecord(event) {
        event.preventDefault();
        // Navigate to Account record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.currentTarget.dataset.id,
                actionName: 'view',
            },
        }).then((url) => {
            this.recordPageUrl = url;
        });
    }
}