public with sharing class MentorList {

  public class MentorInformation{

    MentorInformation(){
      allSkillNames = new List<String>();
  }

    @AuraEnabled
    public String mentorName;

    @AuraEnabled
    public String skillName;

    @AuraEnabled
    public String skillId;

    @AuraEnabled
    public Id mentorId;

    @AuraEnabled
    public String email;

    @AuraEnabled
    public String location;

    @AuraEnabled
    public String userId;

    @AuraEnabled
    public List<String> allSkillNames;

    @AuraEnabled
    public Id mentorSkillId;

    @AuraEnabled
    public String menteeName;

  }

  @AuraEnabled (cacheable=true) 
    public static List <MentorInformation> getMentorLookUpValues() {


      Id mentorRecordTypeId = [SELECT Id FROM RecordType where Name='Mentor' and SobjectType='Account'].get(0).Id;
      List <Account> listOfMentors = [SELECT Id, Name FROM Account WHERE RecordTypeId = :mentorRecordTypeId];

      List<MentorInformation> mentorInformation = new List<MentorInformation>();
        
      for(Account mentor: listOfMentors) {
        System.debug('Mentors'+ mentor.Name);

        List<MentorSkills__c> mentorSkillsList = [SELECT skill__r.name,MentorId__r.PersonEmail, MentorId__r.Location__c, MentorId__r.UserId__c, skill__c   FROM MentorSkills__c WHERE MentorId__c = :mentor.Id];

        for(MentorSkills__c mentorSkill: mentorSkillsList){
          MentorInformation returnMentorList = new MentorInformation();
          returnMentorList.mentorId = mentor.Id;
          returnMentorList.mentorName = mentor.Name;
          returnMentorList.skillName = mentorSkill.skill__r.name;
          returnMentorList.skillId = mentorSkill.skill__c;
          returnMentorList.email = mentorSkill.MentorId__r.PersonEmail;
          returnMentorList.userId = mentorSkill.MentorId__r.UserId__c;
          returnMentorList.mentorSkillId = mentorSkill.Id;
          returnMentorList.menteeName = UserInfo.getName();
          //returnMentorList.location = [select city from user where id=:mentorSkill.MentorId__r.UserId__c] ;
          mentorInformation.add(returnMentorList);

          System.debug('mentorInformation'+mentorInformation);

          List<MentorSkills__c> allMentorSkills = [SELECT  skill__r.name  FROM MentorSkills__c WHERE MentorId__c = :mentor.Id];
            for(MentorSkills__c skill : allMentorSkills){
              returnMentorList.allSkillNames.add(skill.skill__r.name);
            }

        }
            
        }
        
        
        return mentorInformation;
    }
}