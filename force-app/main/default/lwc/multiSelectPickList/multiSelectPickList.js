/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import { LightningElement, wire,track, api } from 'lwc';
import getSkillMap from '@salesforce/apex/LWC_getSkillMap.getDetailsOnLoad';

export default class multiSelectPickList extends LightningElement {

@track options=[];
@track error;
@track dropdown = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
@track dataList;
@track dropdownList = 'slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta';
@track selectedValue = '';
@track selectedListOfValues='';
selectedListofIds = [];
@api context;
@track isDirty = false;

@wire(getSkillMap)
wiredCountryProperty({data, error}){
    
    if(data){
        this.dataList = data.getSkillMap;
        for (var k in this.dataList) {
        this.options = [...this.options, { value: this.dataList[k], id: k, label: this.dataList[k],isChecked:false,class:this.dropdownList }];
        }
        this.error = undefined;
     }
     else if (error) {
           this.error = error;
           this.options = undefined;
         }
}
openDropdown(){
    this.dropdown =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open';  
}
closeDropDown(){
   this.dropdown =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
   console.log(this.selectedListofIds);
   this.dispatchGetSkills();
}
    dispatchGetSkills() {
        if (this.isDirty) {
            let eventData = { "context": this.context, "data": this.selectedListofIds };
            this.dispatchEvent(new CustomEvent('getskills', { "detail": eventData }));
            this.dispatchEvent(new CustomEvent('addskills', { "detail": eventData }));
            this.dispatchEvent(new CustomEvent('getmentorpresent',{"detail": {ismentorpresent :true}}));
            this.isDirty = false;
        }
    }

    @api
    clearSelections(){
        this.options=[];
        for (var k in this.dataList) {
            this.options = [...this.options, { value: this.dataList[k], id: k, label: this.dataList[k],isChecked:false,class:this.dropdownList }];
        }
        this.selectedValue = 'Select Skill';
        this.selectedListOfValues = [];
        this.selectedListofIds = [];
    }

selectOption(event){
var isCheck = event.currentTarget.dataset.id;
var label = event.currentTarget.dataset.name;
var selectedListData=[];
var selectedListofIdsTmp = [];
var selectedOption='';
var allOptions = this.options;
var count=0;
for(let i=0;i<allOptions.length;i++){ 
    if(allOptions[i].label===label)
    { 
        if(isCheck==='true')
        { 
            allOptions[i].isChecked = false;
            allOptions[i].class = this.dropdownList;
         }
        else
        { 
            allOptions[i].isChecked = true; 
            allOptions[i].class = 'slds-media slds-listbox__option slds-listbox__option_plain slds-media_small slds-media_center slds-is-selected';
        }
    } 
    if(allOptions[i].isChecked)
    { 
        this.isDirty = true;
        selectedListData.push(allOptions[i].label); 
        selectedListofIdsTmp.push(allOptions[i].id);
        count++; 
    } 
}
    if(count === 1){
        selectedOption = count+' Skill Selected';
    }
    else if(count>1){
        selectedOption = count+' Skills Selected';
    }
    
    this.options = allOptions;
    this.selectedValue = selectedOption;
    this.selectedListOfValues = selectedListData;
    this.selectedListofIds = selectedListofIdsTmp;
    
}
	
removeRecord(event){
    var value = event.detail.name;
    var removedOptions = this.options;
    var count = 0;
    var selectedListData=[];
    var selectedListIdsInt = [];
    for(let i=0; i < removedOptions.length; i++){
        this.isDirty = true;
        if(removedOptions[i].label === value){
        removedOptions[i].isChecked = false;
        removedOptions[i].class = this.dropdownList;
        }
        if(removedOptions[i].isChecked){
        selectedListData.push(removedOptions[i].label); 
        selectedListIdsInt.push(removedOptions[i].id);
        count++;
        }   
    }
     var selectedOption;
        if(count === 1){
        selectedOption = count+' Skills Selected';
        }
            else if(count>1){
            selectedOption = count+' Skills Selected';
            }
                else if(count === 0){
                selectedOption = '';
                selectedListData = "";
                }
    this.selectedListOfValues = selectedListData;
    this.selectedValue = selectedOption;
    this.options = removedOptions;
    this.selectedListofIds = selectedListIdsInt;
    this.dispatchGetSkills();

    }



}