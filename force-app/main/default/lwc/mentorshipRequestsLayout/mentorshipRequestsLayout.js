import { LightningElement,wire,api,track} from 'lwc';
import findAllMenteeRequests from '@salesforce/apex/MentorshipHandler.findAllMenteeRequests'
import updateDBFormentorship1 from '@salesforce/apex/MentorshipHandler.updateDBFormentorship'
import {refreshApex} from '@salesforce/apex';

export default class MentorshipRequestsLayout extends LightningElement {
    allItemsForCurrentView;
    @api mentorshipId;
    @api mmId;
    @api menteeName;
    @api skillName;
    @api menteeStatus;
    @api openMenteeRequest=false;
    @api reguestMessage;
    @track action;
    @track responseMessage;
    errrorDetail;

    @wire(findAllMenteeRequests)
    processrequests({data,error}){
        if (data) {
            this.allItemsForCurrentView = data.mentorships;
          }
          else if (error) {
              console.log(error);
          }
    }
    handleMessageChange(event) {
        this.reguestMessage = event.target.value;
    }

    takeAction(event){
        this.menteeStatus=event.currentTarget.dataset.status;
        if(this.menteeStatus !=='Recieved'){
            event.target.preventDefault();
        }
        this.openMenteeRequest=true;
        this.mmId=event.currentTarget.dataset.id;
        this.menteeName=event.currentTarget.dataset.mentee;
        this.skillName=event.currentTarget.dataset.skill;
    }

    closeRequestMenteeUI(event){
            this.openMenteeRequest=false;
    }

    handleActions(event){
        this.action=event.target.label;
        updateDBFormentorship1({mentorshipId:this.mmId, action:this.action,message:this.reguestMessage})
        .then(result=>{
            this.allItemsForCurrentView=result.mentorships;
            this.closeRequestMenteeUI();
            refreshApex(this.allItemsForCurrentView);
        })
        .catch(error=>{
            this.errrorDetail=error;
        });
    }

}