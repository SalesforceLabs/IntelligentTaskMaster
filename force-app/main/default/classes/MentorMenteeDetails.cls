public with sharing class MentorMenteeDetails {
    @AuraEnabled (cacheable=true)
    public static List<Account> getMentorDetails(String userId){
        try {
            Id mentorRecordTypeId = [SELECT Id FROM RecordType where Name='Mentor' and SobjectType='Account'].get(0).Id;
            List<Account> mentors = [SELECT Name, UserId__r.City FROM Account WHERE UserId__c =:userId AND RecordTypeId = :mentorRecordTypeId];
            if (!(Schema.sObjectType.Account.isAccessible())){
				throw new NoAccessException();

			}
			if(!FeatureManagement.checkPermission('Mentorforce_Permission')){
				throw new NoAccessException();
			}
            System.debug('Mentor'+ mentors);
            return mentors;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled (cacheable=true)
    public static List<Account> getMenteeDetails(String userId){
        try {
            Id menteeRecordTypeId = [SELECT Id FROM RecordType where Name='Mentee' and SobjectType='Account'].get(0).Id;
            List<Account> mentees = [SELECT Name, UserId__r.City FROM Account WHERE UserId__c =:userId AND RecordTypeId = :menteeRecordTypeId];
            if (!(Schema.sObjectType.Account.isAccessible())){
				throw new NoAccessException();

			}
			if(!FeatureManagement.checkPermission('Mentorforce_Permission')){
				throw new NoAccessException();
			}
            System.debug('Mentee'+ mentees);
            return mentees;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}