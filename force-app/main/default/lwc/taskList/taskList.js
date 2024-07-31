import { api, LightningElement } from 'lwc';

export default class TaskList extends LightningElement {

    @api
    taskHeader = 'Send Invitations';

    @api
    taskSubHeader = 'Throw party for eve';
}