public with sharing class createMentor {


	@AuraEnabled
    public static String createMentorAndMentorSkills(String[] selectedSkills, String pickListValue, Boolean checkBoxValue) {
		ID mentorId = null;

		try {
			Id mentorRecordTypeId = [SELECT Id FROM RecordType where Name='Mentor' and SobjectType='Account'].get(0).Id;
			System.debug(mentorRecordTypeId);
			Account[] mentors = [select Id,name from account where userId__c=:UserInfo.getUserId() and recordTypeId=:mentorRecordTypeId];
			if (!(Schema.sObjectType.Account.isAccessible() && Schema.sObjectType.Account.isCreateable())){
				throw new NoAccessException();

			}
			if(!FeatureManagement.checkPermission('Mentorforce_Permission')){
				throw new NoAccessException();
			}

			if (mentors.size()==0){
				Account mentor = new Account();
				mentor.UserId__c=UserInfo.getUserId();
				mentor.recordTypeId=mentorRecordTypeId;
				mentor.firstName = UserInfo.getFirstName();
				mentor.lastName = UserInfo.getLastName();
				//mentor.location = UserInfo.getCity();
				mentor.PersonEmail = UserInfo.getUserEmail();	
				insert mentor;
				mentorId = mentor.ID;
			}
			else{
					mentorId=mentors[0].Id;
			}
			// Get existing skills for the mentor and add it in map
			MentorSkills__c[] mentorSkills = [select Id,MentorId__c,Skill__c from MentorSkills__c where MentorId__c=:mentorId];
			Map<Id,Boolean> mentorSkillMap = new Map<Id, Boolean>();
			Map<Id,Id> tempMap = new Map<Id,Id>();
			for (MentorSkills__c mentorSkill : mentorSkills){
					mentorSkillMap.put(mentorSkill.skill__c,false);
			tempMap.put(mentorSkill.Skill__c,mentorSkill.Id);
			}
			if(mentorSkills.size()!=0){
				for (String selectedSkill : selectedSkills){
					Id selectedSkillId = Id.valueOf(selectedSkill);
					if(mentorSkillMap.containsKey(selectedSkillId)){
						mentorSkillMap.put(selectedSkillId, true);
					}
					else{
						//this is to calulate for the new skills
						MentorSkills__c mentorSkill = new MentorSkills__c();
						mentorSkill.MentorId__c=mentorId;
						mentorSkill.skill__c=selectedSkillId;
						insert mentorSkill;
					}
				}
				for (String key : mentorSkillMap.keySet()) {
										//This is to identify the skills that are not relevant any more so we just delete
					if(mentorSkillMap.get(key)==false)
					{
						MentorSkills__c deleteMentorSkill = new MentorSkills__c(Id=tempMap.get(key));
						delete deleteMentorSkill;
					}
				}
			}
			else{
				for (String selectedSkill : selectedSkills){
						Id selectedSkillId = Id.valueOf(selectedSkill);
						MentorSkills__c mentorSkill = new MentorSkills__c();
								mentorSkill.MentorId__c=mentorId;
						mentorSkill.skill__c=selectedSkillId;
								insert mentorSkill;
				}
			
			}	   
		} catch(DmlException e) {
			System.debug('An unexpected error has occurred: ' + e.getMessage());
			throw e;
		}	
		return mentorId;	
	}

	
}