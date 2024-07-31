import { LightningElement, wire, track} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import uId from '@salesforce/user/Id';
import userName from '@salesforce/schema/User.Name';
import name_field from "@salesforce/schema/Account.Name";
import recordTypeId_field from "@salesforce/schema/Account.recordTypeId";
import createMentorAndMentorSkills from '@salesforce/apex/createMentor.createMentorAndMentorSkills';

export default class mentorRegistration extends LightningElement {
    skills = [];

    handleClick(event) {
        createMentorAndMentorSkills({selectedSkills: this.skills})
        .then(result =>{
           alert(result);
           console.log(result);
        })
        .catch(error =>{
            console.log(error);
        })
        
    }
    addSkills(event) {
        // strName = 'Pooja';
        // strRecordTypeId = '012B0000000BRuIIAW';

        // // Creating mapping of fields of mentor with values
        // var fields = {'UserId__c' : uId,'Name' : this.strName,'recordTypeId': this.recordTypeId };

        // // Record details to pass to create method with api name of Object.
        // var objRecordInput = {'apiName' : 'Account', fields};
        // // LDS method to create record.
        // createRecord(objRecordInput).then(response => {
        //     alert('mentor created with Id: ' +response.id);
        // }).catch(error => {
        //     alert('Error: ' +JSON.stringify(error));
        // });
        // console.log(event);
        // console.log(event.detail);
        // console.log(event.target.dataSet);
        // console.log(event.target.data);
        console.log(event.detail.data.length);
        this.skills = event.detail.data;
    }
}