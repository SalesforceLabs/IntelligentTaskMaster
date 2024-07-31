import { LightningElement, track, wire, api} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import createMentorAndMentorSkills from '@salesforce/apex/createMentor.createMentorAndMentorSkills';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFld from '@salesforce/schema/User.Name';
import UserCity from '@salesforce/schema/User.City';
import getMenteeDetails from '@salesforce/apex/MentorMenteeDetails.getMenteeDetails';
import getMentorDetails from '@salesforce/apex/MentorMenteeDetails.getMentorDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import notFoundImage from '@salesforce/resourceUrl/NotFound'
import findAllMenteeRequests from '@salesforce/apex/MentorshipHandler.findAllMenteeRequests'
import updateDBFormentorship from '@salesforce/apex/MentorshipHandler.updateDBFormentorship'
import noRequestFlag from '@salesforce/apex/MentorshipHandler.noRequestFlag'
import createMentorFlag from '@salesforce/apex/MentorshipHandler.createMentorFlag'
import {refreshApex} from '@salesforce/apex';
import bellNotification from '@salesforce/apex/notificationsEmail.bellNotification';
import emailNotification from '@salesforce/apex/notificationsEmail.emailNotification';

export default class createMentor extends NavigationMixin(LightningElement) {

    noDataUrl = notFoundImage;
    userId = Id;
    currentUserName;
    @track createMentor=false;
    @track viewMentor=false;
    @track notFoundImage = false;
    isMentee = false;
    isMentor = false;
    @track openSuccessModal = false;
    @api mentorId;
    @track openModal = false;
    @track TypeOptions= [];
    skills = [];
    pickListValue;
    checkBoxValue=true;
    @track isMyMentees=false;
    @track location;
    @track noReqFlag=false;
    @track noReqFlag=false;
    @track allItemsForCurrentView;
    @api mentorshipId;
    @api mmId;
    @api menteeName;
    @api skillName;
    @api menteeStatus;
    @api openMenteeRequest=false;
    @api reguestMessage = "Sure, glad to be your mentor. Lets meet sometime next week to set the ball rolling";
    @track action;
    @track responseMessage;
    errrorDetail;

    connectedCallback(){
        createMentorFlag({})
        .then(result=>{
            if(result === true){
                this.createMentor=result;
            }else if(result === false){
                this.viewMentor=result;
            }  
        })
        .catch(error=>{
            this.errrorDetail=error;
        });
        noRequestFlag({})
        .then(result=>{
            this.noReqFlag=result;
        })
        .catch(error=>{
            this.errrorDetail=error;
        });
    }

    @wire(findAllMenteeRequests)
    processrequests({data,error}){
        if (data) {
            this.allItemsForCurrentView = data.mentorships;
          }
          else if (error) {
              console.log(error);
          }
          if(this.allItemsForCurrentView != null && this.allItemsForCurrentView.length === 0){
            this.noReqFlag=true;
          }else{
            this.noReqFlag=false;
          }
    }

     @wire(getRecord, { recordId: Id, fields: [UserNameFld,UserCity]}) 
      async userDetails({error, data}) {
        if (data) {
            this.currentUserName = data.fields.Name.value;
            this.mentorId = data.fields.id;
            if(data.fields.City.value!==null){
                this.location = data.fields.City.value;
            }
            else{
                console.log('Location not set')
            }
            
        } else if (error) {
            console.log('Error::',error);
            this.error = error ;
        }   
        try{
            const menteeDetails =  await getMenteeDetails({userId: this.userId});
            if(menteeDetails.length === 1){
                this.isMentee = true;
                console.log('isMentee', this.isMentee);
            }

            const mentorDetails =  await getMentorDetails({userId: this.userId});
            if(mentorDetails.length === 1){
                
                this.mentorId =  mentorDetails[0].Id;
                this.isMentor = true;
                
            }

        }catch(error){
            console.log(error);
        }

        if(!this.isMentor){
            this.createMentor = true;
            console.log('Mentor profile is not existing', this.createMentor);
        }
        if(this.isMentor){
            this.viewMentor = true;
            console.log('Mentor Profile is existing', this.viewMentor);

            if(this.myMentees){
                this.isMyMentees = true;
            }
        }
    }
    createMentorProfile() {
        this.openModal = true;
    }

    closeModal() {
        this.openModal = false;
   
    }

    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Mentor Profile added sucessfully',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showFailureToast() {
        const evt = new ShowToastEvent({
            title: 'Failed',
            message: 'Select atleast one skill',
            variant: 'failure',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    addSkills(event) {
        console.log(event.detail.data.length);
        this.skills = event.detail.data;
    }

    handleClick(event) {
        if(this.skills.length > 0){
        createMentorAndMentorSkills({selectedSkills: this.skills, pickListValue: this.pickListValue, checkBoxValue: this.checkBoxValue})
        .then(result =>{
            this.mentorId=result; 
        //    console.log('Create mentor result',this.mentorId);
            this.closeModal();
            this.showSuccessToast();
            this.viewMentor = true;
            this.createMentor = false;
            this.notFoundImage = true;
        })
        .catch(error =>{
            console.log(error);
        })
    }
    else{
        this.showFailureToast();
    }
        
    }

    handleTypeChange(event){
        this.pickListValue = event.target.value;
       
    }

    handleChange(event){
        this.checkBoxValue = event.target.checked;
    }

    get options() {
        return [
            { label: 'In Person and Virtual', value: 'In Person and Virtual' },
            { label: 'Virtual', value: 'Virtual' },
        ];
    }
    handleInputChange(event) {
        this.textValue = event.detail.value;
    }
    
    viewMentorProfile(){
        // Navigate to View Account Page
        console.log('mentorId1', this.mentorId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
            recordId: this.mentorId,
            objectApiName: 'Account',
            actionName: 'view'
            },
        });
    }
    
    handleMessageChange(event) {
        this.reguestMessage = event.target.value;
    }

    takeAction(event){
        this.menteeStatus=event.currentTarget.dataset.status;
        if(this.menteeStatus !=='Received'){
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
        var mentorshipRecord = {};
        for(var i in this.allItemsForCurrentView){
                if(this.allItemsForCurrentView[i].mID == this.mmId){
                    mentorshipRecord = this.allItemsForCurrentView[i];
                }
        }
        updateDBFormentorship({mentorshipId:this.mmId, action:this.action,message:this.reguestMessage})
        .then(result=>{
            this.allItemsForCurrentView=result.mentorships;
            if(mentorshipRecord.menteeUserId) {
                bellNotification({userId: mentorshipRecord.menteeUserId, body: this.reguestMessage, actId: mentorshipRecord.menteeId});
            }
            
            if(mentorshipRecord.menteeEmail) {
                emailNotification({toAddress: mentorshipRecord.menteeEmail, body: this.reguestMessage});   
            }
            this.closeRequestMenteeUI();
            refreshApex(this.allItemsForCurrentView);

        })
        .catch(error=>{
            this.errrorDetail=error;
        });
    }
}