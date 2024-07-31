public with sharing class toDaysTaskList {
    @AuraEnabled
    public static list<Task> fetchTodaysTasks(String searchTask){
        string searchTaskText ='%'+searchTask+'%';
        if(string.isNotBlank(searchTask)){
            return [SELECT AccountId,CompletedDateTime,ActivityDate,CreatedById,CreatedDate,Description,Id,IsClosed,IsHighPriority,IsRecurrence,IsReminderSet,Priority,Status,Subject 
            FROM Task 
            WHERE Subject LIKE:searchTaskText and ActivityDate=TODAY];
        }else{
            return [SELECT AccountId,CompletedDateTime,ActivityDate,CreatedById,CreatedDate,Description,Id,IsClosed,IsHighPriority,IsRecurrence,IsReminderSet,Priority,Status,Subject 
        FROM Task WHERE ActivityDate=TODAY];
        }
    }

    @AuraEnabled
    public static list<Task> fetchFlaggedTasks(String searchTask){
        string searchTaskText ='%'+searchTask+'%';
        return [SELECT AccountId,CompletedDateTime,ActivityDate,CreatedById,CreatedDate,Description,Id,IsClosed,IsHighPriority,IsRecurrence,IsReminderSet,Priority,Status,Subject 
        FROM Task 
        WHERE Subject LIKE:searchTaskText and IsHighPriority=True];
    }

    @AuraEnabled
    public static list<Task> updateTask(String taskId,String taskStatus){
        string message;
        try{
            Task task1 = new Task(Id=taskId);
            task1.Status=taskStatus;
            update task1;
            message = 'Success';
        }   
        catch(Exception ex){
            message = ex.getMessage();
        } 
        return [SELECT AccountId,CompletedDateTime,ActivityDate,CreatedById,CreatedDate,Description,Id,IsClosed,IsHighPriority,IsRecurrence,IsReminderSet,Priority,Status,Subject 
        FROM Task WHERE ActivityDate=TODAY];
    }
}