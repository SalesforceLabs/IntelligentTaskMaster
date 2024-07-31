public with sharing class MentorsBasedOnSkill {

    public class PotentialMentorsWithSkills {
        PotentialMentorsWithSkills(){
            allSkillNames = new List<String>();
        }

        @AuraEnabled
        public String mentorName;

        @AuraEnabled
        public Id mentorSkillId;

        @AuraEnabled
        public Id mentorId;

        @AuraEnabled
        public String skillId;

        @AuraEnabled
        public String skillName;

        @AuraEnabled
        public Decimal rating;

        @AuraEnabled
        public List<String> allSkillNames;
        
        @AuraEnabled
        public String email;

        @AuraEnabled
        public String location;

        @AuraEnabled
        public String userId;

        @AuraEnabled
        public String dataId;

        @AuraEnabled
        public String menteeName;
    }

    @AuraEnabled (cacheable=true) 
    public static List<PotentialMentorsWithSkills> getMentorsBasedOnSkill(String[] skillId) {
       System.debug('SkillId:'+skillId);

        List<MentorSkills__c> mentorIdWithRequiredSkills = [SELECT Id, MentorId__c , MentorId__r.Name,MentorId__r.PersonEmail, MentorId__r.Location__c, MentorId__r.UserId__c, skill__c , skill__r.name, Average_Rating__c FROM MentorSkills__c WHERE Skill__c  IN :skillId LIMIT 10];

        List<PotentialMentorsWithSkills> potentialMentorsWithSkills = new List<PotentialMentorsWithSkills>();
        for(MentorSkills__c mentoSkills : mentorIdWithRequiredSkills){
            PotentialMentorsWithSkills potentialMentor = new PotentialMentorsWithSkills();
            potentialMentor.mentorId = mentoSkills.MentorId__c;
            potentialMentor.mentorName = mentoSkills.MentorId__r.Name;
            potentialMentor.skillId = mentoSkills.skill__c;
            potentialMentor.skillName = mentoSkills.skill__r.name;
            potentialMentor.rating = mentoSkills.Average_Rating__c;
            potentialMentor.email = mentoSkills.MentorId__r.PersonEmail;
            // potentialMentor.location = [select city from user where id=:mentoSkills.MentorId__r.UserId__c] ;//mentoSkills.MentorId__r.Location__c;
            potentialMentor.userId = mentoSkills.MentorId__r.UserId__c;
            potentialMentor.mentorSkillId = mentoSkills.Id;
            potentialMentor.dataId =  potentialMentor.mentorId + '_'+ potentialMentor.skillId;
            potentialMentor.menteeName = UserInfo.getName();
            List<MentorSkills__c> allMentorSkills = [SELECT  skill__r.name  FROM MentorSkills__c WHERE MentorId__c = :mentoSkills.MentorId__c];
            for(MentorSkills__c skill : allMentorSkills){
                potentialMentor.allSkillNames.add(skill.skill__r.name);
            }
            if(allMentorSkills != null && allMentorSkills.size() > 0 && potentialMentor.mentorName != null){
                potentialMentorsWithSkills.add(potentialMentor);
            }
            System.debug('potentialMentor:'+potentialMentor);
        }
        return potentialMentorsWithSkills;

    }
}