public with sharing class returnOverAllTasks {

    @AuraEnabled(cacheable=true)
    public static Integer flaggedNumOfTasks() {
        return [SELECT count() FROM Task WHERE ActivityDate=TODAY];
    }
    @AuraEnabled(cacheable=true)
    public static Integer scheduledNumOfTasks() {
        return [SELECT count() FROM Task WHERE ActivityDate=TODAY];
    }

    @AuraEnabled(cacheable=true)
    public static Integer completedNumbOfTasks() {
        return [SELECT count() FROM Task WHERE ActivityDate=TODAY];
    }

    @AuraEnabled(cacheable=true)
    public static Integer allNumbOfTasks() {
        return [SELECT count() FROM Task WHERE ActivityDate=TODAY];
    }
}