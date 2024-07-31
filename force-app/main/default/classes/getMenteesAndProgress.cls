public with sharing class getMenteesAndProgress {

    public class taskList{
        public taskList(){
            mentorTasks = new List<userTask>();
            menteeTasks = new List<userTask>();
        }

        // Tasks assigned by my mentor
        @AuraEnabled
        public List<userTask> mentorTasks;

        // Tasks assigned to my mentor
        @AuraEnabled
        public List<userTask> menteeTasks;
    }

    public class userTask{

        @AuraEnabled
        public String name;

        @AuraEnabled
        public String description;

        @AuraEnabled
        public String status;

        @AuraEnabled
        public String mentorship;

        @AuraEnabled
        public String recordId;
    }

    public class mentorshipList{
        public mentorShipList(){
            mentorships = new List<mentorship>();
        }

        @AuraEnabled
        public List<mentorship> mentorships;
    }

    public class mentorship {
        @AuraEnabled
        public Id personId;

        @AuraEnabled
        public String personName;

        @AuraEnabled
        public String status;

        @AuraEnabled
        public Date startDate;

        @AuraEnabled
        public Date endDate;

        @AuraEnabled
        public String skillName;

        @AuraEnabled
        public String programName;

        @AuraEnabled
        public String mentorshipId;

    }
    @AuraEnabled
    public static taskList getActionPlanTasks() {
        try {
        System.debug('afds actionplanTasks');
        taskList tasks = new taskList();
        List<MentorShip__c> mentorMentorships = getMyMentors();
        List<MentorShip__c> menteeMentorships = getMyMentees();
        tasks.mentorTasks = getTasks(mentorMentorships);
        tasks.menteeTasks = getTasks(menteeMentorships);
        System.debug('actionplanTasks'+tasks);
        return tasks;
        } catch(Exception e){
            System.debug('afds actionplanTasks' +e.getCause());
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    public static mentorshipList getPersonProgress(String context, String mentorshipId) {
        System.debug('hello');
        System.debug('hello' + context);
        mentorshipList mentorShipListRecs = new mentorshipList();
        try{
            Id personId = null;
        
            List<MentorShip__c> mentorships = new List<MentorShip__c>();
            if(context == 'MyMentors'){
                mentorships = getMyMentors();
            }
            if(context == 'MyMentees'){
                mentorships = getMyMentees();
            }
            if(context == 'GetMenteeDetails'){
                if(mentorshipId == null){
                    return mentorShipListRecs;
                }
                mentorships = [select Id, menteeid__r.Name, status__c,start_date__c,end_date__c,Mentor_Skills__r.Skill__c, Program_Id__r.Name  from mentorship__c where id=:mentorshipId];
            }
            for(Mentorship__c men: mentorships) {
                mentorship mentorshipRec = new mentorship();
                mentorshipRec.personId = personId;
                mentorshipRec.personName = context == 'MyMentors' ? men.MentorId__r.Name : men.menteeid__r.Name;
                mentorshipRec.status = men.status__c;
                mentorshipRec.startDate = men.start_date__c;
                mentorshipRec.endDate  = men.end_date__c;
                //mentorshipRec.programName = men.Program_Id__r.Name;
                mentorshipRec.mentorshipId = men.Id;
                
                Id skillId = men.Mentor_Skills__r.Skill__c;
                Skill3__c skill = [SELECT Name FROM Skill3__c WHERE Id =:skillId];
                mentorshipRec.skillName = skill.Name;
                mentorShipListRecs.mentorships.add(mentorshipRec);
                System.debug(mentorshipRec);
            }
      }catch(Exception e){
        System.debug('An unexpected error has occurred: ' + e.getMessage());  
        System.debug('An unexpected error has occurred: ' + e);  
      }
      return mentorShipListRecs;
    }

    private static List<MentorShip__c> getMyMentors(){
        List<MentorShip__c> mentorships = new List<MentorShip__c>();
        Id personId = null;
        Id menteeRecordId = [SELECT Id FROM RecordType where Name='Mentee' and SobjectType='Account'].get(0).Id;
        System.debug(menteeRecordId);
        List<Account> personAccounts = null;
        if (Schema.sObjectType.Account.isAccessible() ) {
            personAccounts = [select Id,name from account where userId__c=:UserInfo.getUserId() and recordTypeId=:menteeRecordId];
        }
        if(personAccounts != null && personAccounts.size() > 0 && Schema.sObjectType.mentorship__c.isAccessible()){
             personId = personAccounts.get(0).Id;
             mentorships = [select Id,Name,MentorId__r.Name, status__c,start_date__c,end_date__c,Mentor_Skills__r.Skill__c  from mentorship__c where menteeid__c=:personId];
        }
        return mentorships;
    }
    @AuraEnabled(cacheable=true)
    public static List<MentorShip__c> getMyMentees(){
        List<MentorShip__c> mentorships = new List<MentorShip__c>();
        Id personId = null;
       
        Id mentorRecordId = [SELECT Id FROM RecordType where Name='Mentor' and SobjectType='Account'].get(0).Id;
        List<Account> personAccounts = null;
        if (Schema.sObjectType.Account.isAccessible() ) {
            personAccounts = [select Id,name from account where userId__c=:UserInfo.getUserId() and recordTypeId=:mentorRecordId];
        }
        if(personAccounts != null && personAccounts.size() > 0 && Schema.sObjectType.mentorship__c.isAccessible()){
          personId = personAccounts.get(0).Id;
          mentorships = [select Id,Name,menteeid__r.Name,status__c,start_date__c,end_date__c,Mentor_Skills__r.Skill__c from mentorship__c where MentorId__c=:personId];
        }
        return mentorships;
    }

    private static List<userTask> getTasks(List<Mentorship__c> mentorships){
        List<userTask> tasks = new List<userTask>();
        System.debug('getTasksMethod');
        for(Mentorship__c men: mentorships) {
            System.debug('no of mentorships are'+mentorships.size());
            List<ActionPlan> actionplans = null;
            if (Schema.sObjectType.ActionPlan.isAccessible()) {
            actionplans =  [select id from ActionPlan where targetId=:men.Id];
            }
            if(actionplans != null && actionplans.size() > 0){
                for(ActionPlan ap : actionplans){
                     Id apId = ap.Id;
                     List<ActionPlanItem> apItems = [select Id, name , ItemState, ItemId, ActionPlanTemplateItemId from ActionPlanItem where ActionPlanId=:apId and ItemState!='Completed'];
                     System.debug('no of action items are'+UserInfo.getUserId());
                     for(ActionPlanItem api : apItems){
                        if (Schema.sObjectType.Task.isAccessible() ) {
                            Task sfdcTask = [select Id, Status from Task where Id = :api.ItemId Limit 1];
                            sfdcTask.OwnerId = +UserInfo.getUserId();  
                            userTask t = new userTask();
                            t.name = api.name;
                            t.status = sfdcTask.Status;
                            t.mentorship = men.Name;
                            t.recordId=sfdcTask.Id;
                            tasks.add(t);
                            System.debug('no of user tasks'+tasks.size());
                            if(Schema.sObjectType.Task.isUpdateable()){
                                update sfdcTask; 
                            }
                        }
                     }
                   //  update sfdcTasks;
                     //System.debug('Task update for'+ +UserInfo.getUserId());
                  }
              }
            }
            return tasks;
    }
}