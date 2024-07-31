import { LightningElement, track, wire, api } from 'lwc';
import getPersonProgress from '@salesforce/apex/getMenteesAndProgress.getPersonProgress';
import { NavigationMixin } from 'lightning/navigation';
import notFoundImage from '@salesforce/resourceUrl/NotFound'



 
// const allItems = [
//     { Name: 'Shanti', Skill: 'Java', StartDate: '21-06-2021', EndDate: '21/07/2021' },
//     { Name: 'Sowmya', Skill: 'Node', StartDate: '06-06-2021', EndDate: '21/07/2021' },
//     { Name: 'Sowmya', Skill: 'Scripting', StartDate: '21/06/2021', EndDate: '21/07/2021' },
//     { Name: 'Sowmya', Skill: 'LwC', StartDate: '21/06/2021', EndDate: '21/07/2021' },
//     { Name: 'Shanti', Skill: 'React', StartDate: '21/07/2021', EndDate: '21/07/2021' },
 
// ];


 
export default class mentorListView extends NavigationMixin(LightningElement) {
    @track isExpanded = false;
    @track allItems = [];
    @track itemsForCurrentView;
    @track isLoaded = false;
    @track columns = [];
    @track title='My Mentors';
    noDataUrl = notFoundImage;
    
    @wire(getPersonProgress, {context:'MyMentors', mentorshipId:''})
    getMenteeData({ data, error }) {
        if (data) {
          this.itemsForCurrentView = data.mentorships;
           this.columns = [
            {label:'MentorhsipId', fieldName:'mentorshipId', type: 'text', hideDefaultActions: true},
            { label: 'Name', fieldName: 'personName', type: 'text', hideDefaultActions: true },
            { label: 'Skill', fieldName: 'skillName', type: 'text', hideDefaultActions: true },
            { label: 'Status', fieldName: 'status', type: 'text', hideDefaultActions: true },
            { label: 'StartDate', fieldName: 'startDate', type: 'date-local', hideDefaultActions: true, editable: false },
            { label: 'EndDate', fieldName: 'endDate', type: 'date', hideDefaultActions: false },
        ];
    
        }
        else if (error) {
            console.log(error);
        }
    }
    get itemsSize(){
        return this.itemsForCurrentView != null && this.itemsForCurrentView.length > 0;
    }
    
    renderedCallback() {
        this.isLoaded = true;
    }
 
    get dropdownTriggerClass() {
        if (this.isExpanded) {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click custom_list_view slds-is-open'
        } else {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click custom_list_view'
        }
    }
 
    handleFilterChangeButton(event) {
        this.isLoaded = false;
        let filter = event.target.dataset.filter;
        this.isExpanded = !this.isExpanded;
            this.isLoaded = true;
        
    }
 
    handleClickExtend() {
        this.isExpanded = !this.isExpanded;
    }
    handleRecordClick(event){
        const row = event.currentTarget.data[0].mentorshipId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
            recordId: row,
            objectApiName: 'Mentorforce__c',
            actionName: 'view'
            },
        });
    }
}