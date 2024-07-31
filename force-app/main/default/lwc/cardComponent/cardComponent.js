import { LightningElement, api } from 'lwc';

export default class CardComponent extends LightningElement {
    @api
    iconName;

    @api
    totalTasks;

    @api
    executionStatus;
}