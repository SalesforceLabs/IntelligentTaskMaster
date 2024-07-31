import { LightningElement,wire,api,track} from 'lwc';
import getMentorsBasedOnSkill from '@salesforce/apex/MentorsBasedOnSkill.getMentorsBasedOnSkill';

export default class MenteeRegistration extends LightningElement {
    @api selectedSkills = [];
    @track searchMentor = false;
    @track mentorList = [];
    @track mentor = {};
    @track openModal = false;
    @track columns =  [{ label: 'Name', fieldName: 'mentorName' }, { label: 'Rating', fieldName: 'mentorName' }]
    @track message = "Hi, I would like to be mentored";
    @track value;
    isMentorPresent = true;

    getMentorPresent(event){
        this.isMentorPresent = event.detail.ismentorpresent;
        console.log('ismentorpresentEvent::', this.isMentorPresent);
    }

    getSkills(event){
        this.selectedSkills = event.detail.data;
    }

    @wire(getMentorsBasedOnSkill, {skillId: '$selectedSkills'})
    handleMentorSkills({data, error}){
        this.searchMentor = this.selectedSkills.length > 0;
        if(data){
            this.mentorList = data;
            if (this.searchMentor && this.mentorList.length > 0 ){
                this.isMentorPresent = true;  
            } else if (this.searchMentor && this.mentorList.length <= 0){
                this.isMentorPresent = false;
            }
            console.log('ismentorpresent::', this.isMentorPresent);
         }
         else if (error) {
               this.error = error;
             }
    }
    handleAcceptReject(event){
        event.preventDefault();
        var mentorId = event.currentTarget.dataset.id;
        for(var mentorVal in this.mentorList){
            if(this.mentorList[mentorVal].mentorId ==  mentorId){
                this.mentor = this.mentorList[mentorVal];

                break;
            }
        }
        this.openModal = true;

    }
    handleCancel(){
        this.openModal = false;
    }

    handleRefresh(event){
        console.log('menteeReg');
        this.mentorList = [];
        const objChild = this.template.querySelector('c-multi-select-pick-list');
        objChild.clearSelections();
        this.searchMentor = this.selectedSkills.length > 0;
        // getMentorsBasedOnSkill({skillId: '$selectedSkills'})
        // .then(result =>{
        //    console.log(result);
        //    this.searchMentor = this.selectedSkills.length > 0;
        //    this.mentorList = result;
        // })
        // .catch(error =>{
        //     console.log(error);
        // })
    }
  

    }