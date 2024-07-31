import { LightningElement, api, track } from 'lwc';

import bellNotification from '@salesforce/apex/notificationsEmail.bellNotification';
import emailNotification from '@salesforce/apex/notificationsEmail.emailNotification';
import createMenteeAndMentorship from '@salesforce/apex/createMentee.createMenteeAndMentorship';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class RequestDialog extends LightningElement {
    @api mentorlist = [];
    @api mentor = {};
    @track openmodal=true;
    @track message = "Hi, I would like to be mentored by you.";
    @track value;

    handleClose() {
        this.openmodal = false;
        this.dispatchEvent(new CustomEvent('cancelreq'));
    }
    showSuccessToast(variant, message, title) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
    handleRequestMentor(event){
        var inp=this.template.querySelectorAll("lightning-input");
        var dataId= this.mentor.mentorId+"_"+this.mentor.skillId;
        var messageFromInput = '';
        inp.forEach(function(element){
            if(element.name==dataId)
             messageFromInput=element.value;
        },this);
        var messageFromInput = '';
        var email = this.mentor.email;
        var message = 'You have a new mentoring request and message from Mentorcafe <br/>' + '\"Hi, ' + this.mentor.mentorName + ', <br/> I would like to be mentored by you on ' + this.mentor.skillName + '. Hope to connect with you soon.'+' <br/> Thanks, <br/>' + this.mentor.menteeName+'\"';
        var notificationMessage = 'Hi, ' + this.mentor.mentorName +'\n You have a new mentoring request from \n ' + this.mentor.menteeName + ' \n for the skill, ' + this.mentor.skillName;

        var mentorId = this.mentor.mentorId;
        var userId = this.mentor.userId;
        console.log('this.mentor.mentorNam::', this.mentor.mentorName);
        createMenteeAndMentorship({mentorId: this.mentor.mentorId, selectedSkills: this.mentor.mentorSkillId, reqMessage:messageFromInput})
        .then(result =>{
            if(result[1]==='true'){
                this.showSuccessToast('success', 'Requested Mentor Successfully', 'Success');
            }
          
            else { this.showSuccessToast('info', 'Mentorship already Requested', 'Information');}
                
            bellNotification({ userId: userId, body: notificationMessage, actId: mentorId });
            emailNotification({ toAddress: email, body: message });
            this.handleClose();
            this.dispatchEvent(new CustomEvent('handlerefresh'));
                    
        })
        .catch(error =>{
            this.handleClose();
            this.showSuccessToast("Error","Failed to Request",'Error');
            console.log(error);
        });

    }

    handleTextChange(event){
        this.message = event.target.value;
     }

     handleNotification(event) {
        var email = this.mentor.email;
        var message = this.message;
        var mentorId = this.mentor.mentorId;
        var userId = this.mentor.userId;
        bellNotification({userId: userId, body: message, actId: mentorId}).then(data => {
            emailNotification({toAddress: email, body: message});
            
                    })
                    .catch(error =>{
                        this.errorMsg = error;
                    })
     }
}