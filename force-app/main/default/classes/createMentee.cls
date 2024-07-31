public with sharing class createMentee {
    @AuraEnabled public static List<String> createMenteeAndMentorship(String mentorId, String selectedSkills, String reqMessage) {

        ID menteeId = null;
		ID mentorshipId = null;
		List<Mentorship__c> mentorshipList = new List<Mentorship__c>();
		List<String> status = new List<String>();
		String isNewMentorshipCreated = 'false';
		List<String> result = new List<String>();

        try {
			if (!(Schema.sObjectType.Account.isAccessible() && Schema.sObjectType.Account.isCreateable())){
				throw new NoAccessException();

			}
			if(!FeatureManagement.checkPermission('Mentorforce_Permission')){
				throw new NoAccessException();
			}

			Id menteeRecordTypeId = [SELECT Id FROM RecordType where Name='Mentee' and SobjectType='Account'].get(0).Id;

			Account[] mentees = [select Id,name from account where userId__c=:UserInfo.getUserId() and recordTypeId=:menteeRecordTypeId];
			if (mentees.size()==0){
				Account mentee = new Account();
				mentee.UserId__c=UserInfo.getUserId();
				mentee.recordTypeId=menteeRecordTypeId;
				mentee.firstName = UserInfo.getFirstName();
				mentee.lastName = UserInfo.getLastName();
				mentee.PersonEmail = UserInfo.getUserEmail();	
				insert mentee;
				menteeId = mentee.ID;
			}
			else{
                menteeId=mentees[0].Id;
			}

			Mentorship__c[] mentorships = [SELECT Id, Status__c FROM Mentorship__c WHERE MentorId__c = :mentorId AND MenteeId__c = :menteeId AND Mentor_Skills__c = :selectedSkills];
			if(mentorships.size()==0){
				Mentorship__c mentorship = new Mentorship__c();
				mentorship.MentorId__c =  mentorId;
				mentorship.Mentor_Skills__c = selectedSkills;
				mentorship.MenteeId__c = menteeId;
				mentorship.Status__c = 'New';
				mentorship.Request_Message__c = reqMessage;
				mentorship.Name = 'Mentorship for '+ UserInfo.getFirstName();
				insert mentorship;
				mentorshipId = mentorship.ID;

				isNewMentorshipCreated = 'true';
			}
			else
			 if(mentorships.size()>0){
				for(Mentorship__c mentorshipRelation : mentorships){
					status.add(mentorshipRelation.Status__c);
					System.debug('mentorshipRelation.Status__c '+mentorshipRelation.Status__c);
				}

				if(status.contains('Requested') || status.contains('New') || status.contains('In Progress') || status.contains('Accepted')){
					mentorshipId=mentorships[0].Id;

				}
				else{
					Mentorship__c mentorship = new Mentorship__c();
					mentorship.MentorId__c =  mentorId;
					mentorship.Mentor_Skills__c = selectedSkills;
					mentorship.MenteeId__c = menteeId;
					mentorship.Status__c = 'New';
					mentorship.Request_Message__c = reqMessage;
					mentorship.Name = 'Mentorship for '+ UserInfo.getFirstName();
					mentorshipList.add(mentorship);
					insert mentorshipList;
					mentorshipId = mentorship.ID;
					isNewMentorshipCreated = 'true';
				}
			
			}
			
        }
        catch(Exception e) {
			System.debug('An unexpected error has occurred: ' + e.getMessage());
			throw e;
		}
		result.add(menteeId);
		result.add(isNewMentorshipCreated);	
        return result;
    }
}
