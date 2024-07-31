public with sharing class notificationsEmail {

    @AuraEnabled(cacheable=true)
    public static void bellNotification(String userId, String body, String actId){
        Messaging.CustomNotification notification = new Messaging.CustomNotification();
        notification.setBody(body);
        notification.setTitle('Notification from Mentorcafe');
        notification.setSenderId(Userinfo.getUserId());
        CustomNotificationType type = [SELECT Id FROM CustomNotificationType WHERE DeveloperName = 'custom_notification'];
        notification.setNotificationTypeId(type.id);
        notification.setTargetId(actId); // target object id
        //String pageRef = '{"type": "standard__component","attributes": {"componentName": ' + '"' + component + '"' +'}}';
        //notification.setTargetPageRef(pageRef);
        Set<String> addressee = new Set<String>();
        addressee.add(userId);
        try {
                notification.send(addressee);
                }
                catch (Exception e) {
                    System.debug('Problem sending notification: ' + e.getMessage());
                    throw e;
            }
    }

    @AuraEnabled(cacheable=true)
    public static void emailNotification(String toAddress, String body) {
        Messaging.SingleEmailMessage mail =  new Messaging.SingleEmailMessage();
        mail.toAddresses = new String[] {toAddress};
        mail.setReplyTo('mentorforce-team@salesforce.com');
        mail.setSenderDisplayName('Mentorcafe Admin');
        mail.setSubject('Mentorcafe: New message from '+UserInfo.getFirstName());
        mail.setHtmlBody('<br/>'+ body);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
    
}