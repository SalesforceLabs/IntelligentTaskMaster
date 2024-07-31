public with sharing class MentorshipHandler {

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
      public Id mID;
  
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
  
      @AuraEnabled
      public Date lastmodifiedDate;
  
      @AuraEnabled
      public Boolean newMentorshipFlag;

      @AuraEnabled
      public Id menteeUserId;

      @AuraEnabled
      public String menteeEmail;

      @AuraEnabled
      public Id menteeId;
  
  }
      @AuraEnabled(cacheable=true)
      public static mentorshipList findAllMenteeRequests(){
          return getAllMenteeRequestForCurrentUser();
      }
  
      @AuraEnabled
      public static mentorshipList updateDBFormentorship(String mentorshipId,String action,String message){
        try{
          if(!FeatureManagement.checkPermission('Mentorforce_Permission')){
            throw new NoAccessException();
          } 
          Mentorship__c mentorship=new Mentorship__c(Id=mentorshipId);
        if(action.equals('Accept Request')){
          mentorship.status__c='Accepted';
          if( message != null){
            mentorship.Request_Message__c=message;
          }
        }else if(action.equals('Decline')){
          mentorship.status__c='Rejected';
          if( message != null){
            mentorship.Rejection_Reason__c=message;
          }
        }
        update mentorship;
        }catch(Exception e){
          system.debug('Errors:'+ e.getCause());
        }  
        mentorshipList mentorShipListRecs = new mentorshipList();
        mentorShipListRecs=getAllMenteeRequestForCurrentUser();
        return mentorShipListRecs;
      }
  
      public static mentorshipList getAllMenteeRequestForCurrentUser(){
        if(!FeatureManagement.checkPermission('Mentorforce_Permission')){
          throw new NoAccessException();
        } 
        mentorshipList mentorShipListRecs = new mentorshipList();
          List<MentorShip__c> mentorships = new List<MentorShip__c>();
          Id personId = null;
          Id mentorRecordId = [SELECT Id FROM RecordType where Name='Mentor' and SobjectType='Account'].get(0).Id;
          List<Account> personAccounts = [select Id,name from account where userId__c=:UserInfo.getUserId() and recordTypeId=:mentorRecordId];
          
          if(personAccounts != null && personAccounts.size() > 0){
            personId = personAccounts.get(0).Id;
            mentorships = [select Id, lastModifiedDate,menteeid__r.Name, status__c,start_date__c,end_date__c,Mentor_Skills__r.Skill__c,menteeid__r.userid__c, menteeid__r.PersonEmail,menteeid__c,Program_Id__r.Name  from mentorship__c where MentorId__c=:personId LIMIT 5];
          }
          for(Mentorship__c men: mentorships) {
            mentorship mentorshipRec = new mentorship();
            mentorshipRec.personId = personId;
            mentorshipRec.personName = men.menteeid__r.Name;
            mentorshipRec.mID=men.Id;
            if(String.valueOf(men.status__c).equals('New')){
              mentorshipRec.status = 'Received';
              mentorshipRec.newMentorshipFlag=true;
            }else{
              mentorshipRec.status = men.status__c;
              mentorshipRec.newMentorshipFlag=null;
            }
            mentorshipRec.lastModifiedDate=men.lastModifiedDate.date();
            mentorshipRec.startDate = men.start_date__c;
            mentorshipRec.endDate  = men.end_date__c;
            mentorshipRec.programName = men.Program_Id__r.Name;
            mentorshipRec.mentorshipId = men.Id;
            mentorshipRec.menteeEmail = men.menteeid__r.PersonEmail;
            mentorshipRec.menteeUserId = men.menteeid__r.userid__c;
            mentorshipRec.menteeId = men.menteeid__c;
            Id skillId = men.Mentor_Skills__r.Skill__c;
            Skill3__c skill = [SELECT Name FROM Skill3__c WHERE Id =:skillId];
            mentorshipRec.skillName = skill.Name;
            mentorShipListRecs.mentorships.add(mentorshipRec);
        }
          return mentorShipListRecs;
      }
      @AuraEnabled
      public static Boolean createMentorFlag(){
        if(!FeatureManagement.checkPermission('Mentorforce_Permission')){
          throw new NoAccessException();
        } 
        Id mentorRecordId = [SELECT Id FROM RecordType where Name='Mentor' and SobjectType='Account'].get(0).Id;
        List<Account> personAccounts = [select Id,name from account where userId__c=:UserInfo.getUserId() and recordTypeId=:mentorRecordId];
        if(personAccounts == null){
          return true;
        }
        return false;
      }
      @AuraEnabled
      public static Boolean noRequestFlag(){
        if(!FeatureManagement.checkPermission('Mentorforce_Permission')){
          throw new NoAccessException();
        } 
        Id personId = null;
        List<MentorShip__c> mentorships;
        Id mentorRecordId = [SELECT Id FROM RecordType where Name='Mentor' and SobjectType='Account'].get(0).Id;
        List<Account> personAccounts = [select Id,name from account where userId__c=:UserInfo.getUserId() and recordTypeId=:mentorRecordId];
        if(personAccounts != null && personAccounts.size() > 0){
          personId = personAccounts.get(0).Id;
          mentorships = [select Id from mentorship__c where MentorId__c=:personId LIMIT 5];
        }
        if(mentorships != null && mentorships.size() > 0){
          return false;
        }
        return true;
      }
  }