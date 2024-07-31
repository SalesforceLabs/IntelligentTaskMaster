public with sharing class LWC_getSkillMap {
    
    public class getDetailsOnLoadWrapper {
        @AuraEnabled
        public Map<Id, String> getSkillMap;
    }
    
    @AuraEnabled(cacheable=true)
    
    public static getDetailsOnLoadWrapper getDetailsOnLoad(){
        try{
            if(!FeatureManagement.checkPermission('Mentorforce_Permission')){
                throw new NoAccessException();
            } 
            getDetailsOnLoadWrapper onLoadWrapper = new getDetailsOnLoadWrapper();
            Skill3__c[] skills = [select Id,name from Skill3__c limit 1000];
            Map<Id, String> skillMap = new Map<Id, String>();
            for (Skill3__c skill : skills){
                skillMap.put(skill.Id, skill.Name);
            }
            onLoadWrapper.getSkillMap = skillMap;
            return onLoadWrapper;
                
            
        }catch(Exception e) {
            System.debug('An unexpected error has occurred: ' + e.getMessage());
            throw e;
        }
    }
}
