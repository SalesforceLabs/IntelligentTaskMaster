import { LightningElement, wire, track, api } from 'lwc';
import getMentorLookUpValues from '@salesforce/apex/MentorList.getMentorLookUpValues';
export default class searchMentorLookup extends LightningElement {
    @track options = [];
    @track searchValue = '';
    @track fieldName;
    @track selectedAccount;
    @track showAccountsListFlag = false;
    @track isSelection = false;
    @track isButton = false;
    @api selectedskills = [];
    @track mentor= {};
    @track openModal = false;
    @track selectedAccountId;
   
    @wire(getMentorLookUpValues)
    picklistvalues({ data, error }) {
        if (data) {
            this.options = data;

        }
        else if (error) {
            console.log(error);
            this.error = error;
       }
    }
    handleClick() {
        if (!this.showAccountsListFlag) {
            this.showAccountsListFlag = true;
            this.template.querySelector('.accounts_list').classList.remove('slds-hide');
            this.template.querySelector('.slds-slds-icon-utility-close').classList.add('slds-hide');
        }
        this.template.querySelector('.slds-dropdown-trigger').classList.add('slds-is-open');

    }
    handleMouseLeave(){
        this.showAccountsListFlag = false;
        this.template.querySelector('.accounts_list').classList.add('slds-hide');
        this.template.querySelector('.slds-slds-icon-utility-close').classList.remove('slds-hide');
        this.template.querySelector('.slds-dropdown-trigger').classList.remove('slds-is-open');
        
    }
    handleKeyUp(event) {
        window.clearTimeout(this.delayTimeout);
        this.searchValue = event.target.value;
        const filter = this.searchValue.toUpperCase();
        const span = this.template.querySelector('.slds-listbox_vertical').childNodes;
        for (let i = 1; i < span.length; i++) {
            const option = span[i].textContent;
            if (option.toUpperCase().indexOf(filter) > -1) {
                span[i].style.display = "";
            } else {
                span[i].style.display = "none";
            }
        }
        this.searchValue = this.searchValue;
        if (this.searchValue === '') {
            this.template.querySelector('.accounts_list').classList.add('slds-hide');
        }else{
            this.template.querySelector('.accounts_list').classList.remove('slds-hide');
            this.template.querySelector('.slds-slds-icon-utility-close').classList.add('slds-hide');
            this.template.querySelector('.slds-dropdown-trigger').classList.add('slds-is-open');
        }

    }
    handleOptionSelect(event) {
        this.selectedAccount = event.currentTarget.dataset.name
        this.selectedAccountId = event.currentTarget.dataset.id;
        if (!this.isSelection) {
            this.isSelection = true;
        }
        console.log('this.selection',this.isSelection);
        this.template.querySelector('.selectedOption').classList.remove('slds-hide');
        this.template.querySelector('.accounts_list').classList.add('slds-hide');
        this.isButton = true;

        event.preventDefault();
        var mentorId = event.currentTarget.dataset.id;
        var mentorSkillId = event.currentTarget.dataset.key;

        for(var mentorVal in this.options) {
            if(this.options[mentorVal].mentorId === mentorId && this.options[mentorVal].mentorSkillId === mentorSkillId && mentorId) {  
                this.mentor = this.options[mentorVal];
                console.log('mentor', JSON.stringify(this.mentor));
            } 
        }
        this.openModal = true;
        
    }
    handleRemoveSelectedOption() {
        this.template.querySelector('.selectedOption').classList.add('slds-hide');
        this.template.querySelector('.searchvalue').value = '';
        this.searchKey = '';
    }
    handleCancel(){
        this.openModal = false;
        
    }

}