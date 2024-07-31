import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import TASK_OBJECT from '@salesforce/schema/Task';
import SUBJECT_FIELD from '@salesforce/schema/Task.Subject';
import PRIORITY_FIELD from '@salesforce/schema/Task.Priority';
import STATUS_FIELD from '@salesforce/schema/Task.Status';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class NewTaskCreation extends LightningElement {

    error;
    taskID;
    value = 'inProgress';

    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
    taskRecord = {
        Subject:SUBJECT_FIELD,
        Priority:PRIORITY_FIELD,
        Status:STATUS_FIELD
    };
    handleChange(event){
        if(event.target.name == 'tasksub'){
            this.taskRecord.Subject = event.target.value;
        }
        else if(event.target.name == 'taskpri'){
            this.taskRecord.Priority = event.target.value;
        }
        this.taskRecord.Status = 'Not Started';
          
    }
    createTask(event){
        const fields ={};
        fields[SUBJECT_FIELD.fieldApiName] = this.taskRecord.Subject;
        fields[PRIORITY_FIELD.fieldApiName] = this.taskRecord.Priority;
        fields[STATUS_FIELD.fieldApiName] = 'Not Started';
 
        const recordInput = {apiName:TASK_OBJECT.objectApiName,fields};
 
        createRecord(recordInput)
        .then(result=>{
            this.taskID = result.id;
            const evt = new ShowToastEvent({
                title :'success',
                message: 'Task Record',
                variant:"success"
            });
            this.dispatchEvent(evt);
        })
        .error(error=>{
            const evt = new ShowToastEvent({
                title :'Error',
                message: 'Task Not Record',
                variant:"Error"
            });
            this.dispatchEvent(evt);
        })
 
    }
}